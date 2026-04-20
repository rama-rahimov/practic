export const chat = (socket) => {
    console.log('socket connection', socket.guestId, socket.user);
    socket.emit('vpered', socket.id);
    socket.on('msg', (msg) => {
        console.log({ msg });
        socket.emit('take_msg', msg);
    });
    socket.on('disconnect', () => {
        console.log('socket disconnect', socket.id);
    })
}