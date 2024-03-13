import { catchError } from '../../../middleware/catchError.js'
import { AppError } from '../../../utils/AppError.js'
import { tripModel } from '../../../../db/models/trip.model.js'
import { ApiFeature } from '../../../utils/ApiFeature.js'
import { reservedModel } from '../../../../db/models/reserved.model.js'
import { userModel } from '../../../../db/models/user.model.js'
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51OrwJRCWdWW6cS4fLPRZtRX528YSClxGTEZ9YKdLLqGh0vCGeUA0Q6hIbv7Tiilu9regkjDrBi1vObSFG9EFURhx000Taq17zi');

const tripDetails = catchError(async (req, res, next) => {
    let trip = await tripModel.findById(req.params.id)
    if (!trip) next(new AppError('trip not founded', 404))
    let numberReserves = req.body.numberReserves || 1
    let totalPrice = numberReserves * trip.price
    await userModel.findByIdAndUpdate(req.user._id, { bookeDetails: { totalPrice, numberReserves } })
    res.send({ msg: "success", totalPrice, trip })
})

const getallReserves = catchError(async (req, res, next) => {
    let trip = await tripModel.findOne({owner:req.user._id})
    if (!trip) return next(new AppError('trip not founded', 404))
    let apiFeature = new ApiFeature(reservedModel.find({ trip:trip._id }).populate('trip'), req.query)
        .pagenation().fields().search().sort().filter()
    let Reserves = await apiFeature.mongoseQuery
    if (!Reserves) return next(new AppError('Reserves not founded', 404))
    res.send({ msg: 'success', Reserves })
})
const getReservedForUser = catchError(async (req, res, next) => {
    let Reserve = await reservedModel.find({ user: req.user._id }).populate('trip')
    if (!Reserve) return next(new AppError('order not founded', 404))
    res.send({ msg: 'success', Reserve })
})
const getSpcificReserved = catchError(async (req, res, next) => {
    let Reserve = await reservedModel.findById(req.params.id).populate('trip')
    if (!Reserve) return next(new AppError('order not founded', 404))
    res.send({ msg: 'success', Reserve })
})

const createCheckOutSession = async (req, res, next) => {
    let trip = await tripModel.findById(req.params.id)
    if(!trip) return next(new AppError('trip not founded',404))
    let user = await userModel.findById(req.user._id)
    if(!user) next (new AppError('user not founded',401))
    let totalPrice = user.bookeDetails[0].totalPrice
    if (!user.bookeDetails) return next(new AppError('please select trip', 404))
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: totalPrice * 100,
                    product_data: {
                        name: `${user.firstName} ${user.lastName}`
                    }
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'https://www.linkedin.com/in/islammuhaamed/',
        cancel_url: 'https://www.linkedin.com/in/islammuhaamed/',
        customer_email: user.email,
        client_reference_id: req.params.id
    });
    res.send({ msg: "success", session })
}

const reservePlace = (request, response) => {
    const sig = request.headers['stripe-signature'].toString();

    let event;
    event = stripe.webhooks.constructEvent(request.body, sig, "whsec_bPFV8r8Y4lisWmtrkhH68eREbidIsDjj");
    if (event.type == "checkout.session.completed") {
        bookedTrip(event.data.object, response)
        console.log("create Order here...");
    } else {
        console.log(`Unhandled event type ${event.type}`);

    }

}

export {
    tripDetails,
    getallReserves,
    getSpcificReserved,
    createCheckOutSession,
    getReservedForUser,
    reservePlace
}

async function bookedTrip(e, res) {
    try {
        let trip = await tripModel.findById(e.client_reference_id);
        if (!trip) throw new AppError('Trip not found', 404);

        let user = await userModel.findOne({ email: e.customer_email });
        if (!user) throw new AppError('User not found', 404);

        let reserve = new reservedModel({
            user: user._id,
            trip:trip._id,
            totalprice: e.amount_total / 100,
            isPaid: true,
            paidAt: Date.now()
        });

        await reserve.save();
        let quantity = trip.quantity - user.bookeDetails[0].numberReserves;
        let booked = trip.booked + user.bookeDetails[0].numberReserves;
        await tripModel.findByIdAndUpdate(e.client_reference_id, { quantity:quantity, booked:booked });

        // Sending response after successful database operations
        res.send({ msg: 'success', reserve });
    } catch (error) {
        // Handling errors within the function
        console.error('Error processing checkout:', error);
        // Sending appropriate error response if necessary
        res.status(error.statusCode || 500).send({ error: error.message });
    }
}



