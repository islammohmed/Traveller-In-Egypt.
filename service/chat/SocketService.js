
const onlineUsers = new Map();
const onlineSockets = new Map();
const onlineUsersRoles = new Map();

import { userModel } from '../../db/models/user.model.js'

const errorWrapper = (asyncFun) => {
    return async (...args) => {
        try {
            return await asyncFun(...args)
        }
        catch (error) {
            console.log(error);
            // throw error;
        }
    }
}

const AddOnlineUser = errorWrapper(
    async (socketId, userId) => {
        const user = await userModel.findByIdAndUpdate(userId, { isActive: true }, { new: true });
        onlineUsersRoles.set(userId, user.role);
        onlineUsers.set(socketId, userId);
        onlineSockets.set(userId, socketId);
    }
)
const RemoveOnlineUser = errorWrapper(
    async (socketId) => {
        const userId = onlineUsers.get(socketId);
        await userModel.findByIdAndUpdate(userId, { isActive: false });
        onlineSockets.delete(userId)
        onlineUsersRoles.delete(userId)
        onlineUsers.delete(socketId);
    }
)
const GetUserId = errorWrapper(
    async (socketId) => {
        return onlineUsers.get(socketId);
    }
)

const GetSocketId = errorWrapper(
    async (userId) => {
        return onlineSockets.get(userId);
    }

)

const GetUserRole = errorWrapper(
    async (userId) => {
        return onlineUsersRoles.get(userId);
    }
)



export { AddOnlineUser, RemoveOnlineUser, GetUserId, GetSocketId, GetUserRole };