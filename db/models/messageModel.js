import mongoose from 'mongoose';
const {Schema} = mongoose; 

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'users' },
    chatId: { type: Schema.Types.ObjectId, ref: 'chats', required: true },
    timeStamp: { type: Schema.Types.Date, default: Date.now() },
    message: { type: Schema.Types.String, required: true, minLength: 1, maxLength: 255, trim: true },
    sentByAdmin: { type: Boolean, default: false }

});

messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1 });
messageSchema.index({ timeStamp: -1 });

export const Message = mongoose.model('messages', messageSchema)

