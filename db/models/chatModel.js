import mongoose from 'mongoose';
const {Schema} = mongoose; 


const chatScehma = new Schema({
    user1: { type: Schema.Types.ObjectId, ref: 'users' },
    user2: { type: Schema.Types.ObjectId, ref: 'users' },
    timeStamp: { type: Schema.Types.Date, default: Date.now() },
    lastMessage: { type: Schema.Types.Date, default: Date.now() },
    visisbleToAdmin: { type: Boolean, default: false }
})

chatScehma.index({ user1: 1 })
chatScehma.index({ user2: 1 })
chatScehma.index({ timeStamp: -1 })
chatScehma.index({ lastMessage: -1 })


export const Chat = mongoose.model('chats', chatScehma);

