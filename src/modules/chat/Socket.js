import { GetUserId, AddOnlineUser, RemoveOnlineUser, GetSocketId, GetUserRole } from '../../../service/chat/SocketService.js'
import { server } from '../../../index.js'
import { validateToken } from '../../../service/chat/TokenServices.js'
import { Server } from 'socket.io'
import { CreateMessage, GetChatMessages, specifyMessageSender, setMessageSender } from '../../../service/chat/MessageService.js'

import { GetUserChats } from '../../../service/chat/ChatService.js'

import { userModel } from '../../../db/models/user.model.js'
export const startChatServer = () => {
    const io = new Server(server, { cors: { allowedHeaders: '*', credentials: false, origin: '*' } });
    io.on('connect', (socket) => {

        /////////////////////////////////////////////////
        console.log(socket.id, 'connected')

        socket.on('join-chat', async (token) => {
            const { userId } = await validateToken(token);
            await AddOnlineUser(socket.id, userId)

            const userRole = await GetUserRole(userId);
            if (userRole == 'admin') { socket.join('admins') };

            const chats = await GetUserChats(userId);
            io.to(socket.id).emit('get-chats', chats);
        }
        );

        ////////////////////////////

        socket.on('contact-us',
            async (message) => {
                const senderId = await GetUserId(socket.id);
                const senderRole = await GetUserRole(senderId);
                if (senderRole == 'admin') { return; }
                const receiverId = await userModel.findOne({ role: 'admin' });
                CreateMessage(senderId, receiverId, message)
                    .then((message) => {

                        io.to('admins').emit('message', message)
                        specifyMessageSender(message, senderId, senderRole);
                        io.to(socket.id).emit('message', message)


                    })
                    .catch((err) => { console.log(err) });

            }
        )

        ////////////////////////////////////////////

        socket.on('disconnect', async () => {
            console.log(socket.id, 'disconnected')
            await RemoveOnlineUser(socket.id)
        }
        );

        ////////////////////////////////////////////////

        socket.on('message',
            async (receiverId, message) => {
                const senderId = await GetUserId(socket.id);

                const senderRole = await GetUserRole(senderId);

                const isFromOrTAdmins = (receiverId == 'admin' || (senderRole == 'admin'));
                const receiverSocketId = await GetSocketId(receiverId);

                CreateMessage(senderId, receiverId, message)
                    .then((message) => {
                        if (isFromOrTAdmins) {
                            if (senderRole == 'admin') {
                                setMessageSender(message, true);
                                io.to('admins').emit('message', message);
                                setMessageSender(message, false)
                                io.to(receiverSocketId).emit('message', message);
                            }
                            else {
                                setMessageSender(message, true);
                                io.to(socket.id).emit('message', message);
                                setMessageSender(message, false);
                                io.to('admins').emit('message', message);

                            }
                        }
                        else {
                            setMessageSender(message, true);
                            io.to(socket.id).emit('message', message)
                            setMessageSender(message, false);
                            io.to(receiverSocketId).emit('message', message)
                        }

                    })
                    .catch((err) => { console.log(err) });

            }

        );


        ///////////////////////////////////////////////

        //////////////////////////////////////////////
        socket.on('get-messages',
            async (chatId, pageNum) => {
                const userId = await GetUserId(socket.id);
                const userRole = await GetUserRole(userId)
                const messages = await GetChatMessages(userId, userRole, chatId, pageNum);
                if (messages) {
                    io.to(socket.id).emit('get-messages', messages);
                }
            }
        );
        ////////////////////////////////////////////


        //////////////////////////////////

    });

}
