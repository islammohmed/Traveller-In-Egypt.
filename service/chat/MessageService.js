
import { userModel } from '../../db/models/user.model.js'
import { Message } from '../../db/models/messageModel.js'

import { GetChatId, UpdateLastMessageDate, checkUserChatOwnerShip } from '../chat/ChatService.js'
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
const syncErrorWrapper = (Fun) => {
    return  (...args) => {
        try {
            return  Fun(...args)
        }
        catch (error) {
            console.log(error);
            // throw error;
        }
    }
}

const CreateMessage = errorWrapper(
    async (senderId, receiverId, content) => {

        const chatId = await GetChatId(senderId, receiverId);
        const sender = await userModel.findById(senderId);
        if (receiverId == 'admin') {
            const receiver = await userModel.findOne({ role: 'admin' });
            receiverId = receiver._id
        }
        const message = new Message({ sender: senderId, receiver: receiverId, chatId: chatId, message: content, sentByAdmin: (sender.role == 'admin') });
        const result = await message.save();
        await UpdateLastMessageDate(chatId);
        // console.log('result', result)
        
        return result;
    }
)

const GetChatMessages = errorWrapper(
    async (userId, userRole, chatId, pageNum) => {
        const authorized = await checkUserChatOwnerShip(userId, chatId);
        if (!authorized) { return null };
        let messages = await Message.find({ chatId: chatId }).sort({ date: -1 }).skip(--pageNum).limit(pageNum * 10);
        messages = messages.map((m) => {
            return specifyMessageSender(m, userId, userRole);
        })
        return messages;
    }
)


const specifyMessageSender = syncErrorWrapper(

    function (message, userId, userRole) {
        message._doc.sentByMe = false;
        if (message._doc.sender == userId || (userRole == 'admin' && message._doc.sentByAdmin)) { message._doc.sentByMe = true };
        return message;
    }

)

const setMessageSender = syncErrorWrapper (
    function (message,sentByMe){
        message._doc.sentByMe = sentByMe;
    }
)

export { CreateMessage, GetChatMessages ,specifyMessageSender,setMessageSender};




// CreateMessage('65eb1abd1517e6c656a0a7e3', '65eb1ad41517e6c656a0a7e5', 'gg')
//     .then((value) => { console.log('value is ', value) }).catch((err) => { console.log(err) })

