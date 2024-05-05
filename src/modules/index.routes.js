import bookTripRouter from "./Book trip/bookTrip.routes.js"
import authRouter from "./auth/auth.routes.js"
import companyRouter from "./company/company.routes.js"
import favouritesRouter from "./favouritesTrip/favourites.routes.js"
import feedbackRouter from "./feedBack/feedback.routes.js"
import tourismTypeRouter from "./tourismType/tourismType.routes.js"
import tripRouter from "./trip/trip.routes.js"
import userRouter from "./user/user.routes.js"
import { server } from '../../index.js';
import dashboardRouter from "./Dashboard/dashboard.routes.js"

export const bootstrab = (app) => {
    app.use('/api/v1/tourismType', tourismTypeRouter)
    app.use('/api/v1/user', userRouter)
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/feedback', feedbackRouter)
    app.use('/api/v1/company', companyRouter)
    app.use('/api/v1/trip', tripRouter)
    app.use('/api/v1/favourites', favouritesRouter)
    app.use('/api/v1/bookTrip', bookTripRouter)
    app.use('/api/v1/dashboard', dashboardRouter)
}






