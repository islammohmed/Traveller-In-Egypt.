import dotenv from 'dotenv';
dotenv.config();

import util from 'util'
import jwt from 'jsonwebtoken'

const verifyToken = util.promisify(jwt.verify);

const errorWrapper = (asyncFun) => {
    return async (...args) => {
        try {
            return await asyncFun(...args)
        }
        catch (error) {
            // throw error;
            console.log(error);
        }
    }
}


const validateToken = errorWrapper(
    async function validateAndReturnPayload(token) {

        const payLoad = await verifyToken(token, process.env.SECRET_KEY)
        return payLoad;

    }

)


export { validateToken }
