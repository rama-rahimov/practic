import socketService from "./socketService.js";

export const chat = (socket, io) => {
    socket.on('msg', async (msg) => {
        await socketService.handlerMessage(socket, msg, (roomId)=> {
            io.to(roomId).emit('take_msg', msg);
        });
    });
    socket.on("join_room",(roomId) => {
        socket.join(roomId);
    });
    socket.on('disconnect', () => {
        console.log('socket disconnect', socket.id);
    })
}