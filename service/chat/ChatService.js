import { Chat } from '../../db/models/chatModel.js'
import { userModel } from '../../db/models/user.model.js'
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


const GetChatId = errorWrapper(
    async (senderId, receiverId) => {

        // if there is one of them is admin then search by visisbletoAdmin:true and the normal userID
        const sender = await userModel.findOne({ _id: senderId });
        if (receiverId == 'admin') {
            receiverId = await userModel.findOne({ role: 'admin' });
        }
        const receiver = await userModel.findOne({ _id: receiverId });

        const senderRole = sender.role;
        const receiverRole = receiver.role;

        const isChatVisibleToAdmins = (senderRole == 'admin' || receiverRole == 'admin')

        if (isChatVisibleToAdmins) {
            const normalUser = (sender.role == 'admin') ? receiver : sender;
            let chat = await Chat.findOne({ $or: [{ user1: normalUser._id }, { user2: normalUser._id }], visisbleToAdmin: true });
            if (chat) { return chat._id };

            chat = await Chat.create({ user1: senderId, user2: receiverId, visisbleToAdmin: isChatVisibleToAdmins });
            return chat._id
        }
        else {
            let chat = await Chat.findOne({
                $or: [{ $and: [{ user1: senderId }, { user2: receiverId }] },
                { $and: [{ user1: receiverId }, { user2: senderId }] }]
            })
            if (chat) { return chat._id }

            chat = await Chat.create({ user1: senderId, user2: receiverId, visisbleToAdmin: isChatVisibleToAdmins });
            return chat._id

        }
    }


)



const GetUserChats = errorWrapper(
    async (userId) => {
        const user = await userModel.findById(userId);
        let chats = null;
        if (user.role == 'admin') {

            chats = await Chat.find({ visisbleToAdmin: true }).sort({ lastMessage: -1 });
        }
        else {
            chats = await Chat.find({ $or: [{ user1: userId }, { user2: userId }] }).sort({ lastMessage: -1 });

        }
        const results = [];
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            let otherUserId = userId == chat.user1 ? chat.user2 : chat.user1;
            const otherUser = await userModel.findById(otherUserId);
            const otherUserRole = otherUser.role;
            otherUserId = (otherUserRole == 'admin') ? 'admin' : otherUserId;
            const isOnline = (otherUser.isActive || otherUserId == 'admin') ? true : false;
            const result = {
                lastMessage: chat.lastMessage, email: otherUser.email, otherUserId: otherUserId, chatId: chats[i].id
                , isOnline: isOnline
            };

            results.push(result);
        }

        return results;
    }
)



const UpdateLastMessageDate = errorWrapper(
    async (chatId) => {
        const result = Chat.findByIdAndUpdate(chatId, { lastMessage: Date.now() });
    }
)



const checkUserChatOwnerShip = errorWrapper(
    async (userId, chatId) => {

        const chat = await Chat.findById(chatId);
        const user = await userModel.findById(userId);
        if (!chat) { return false };
        const result =
            (chat.user1 == userId
                || chat.user2 == userId
                || (user.role == 'admin'
                    && chat.visisbleToAdmin))
                ? true : false;
        return result;
    }
);


export { GetChatId, GetUserChats, UpdateLastMessageDate, checkUserChatOwnerShip }