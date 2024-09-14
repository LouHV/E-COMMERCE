const { Server } = require('socket.io');
const io = new Server({ cors: "http://localhost:3000" });

let onlineUsers = [];
io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on('addNewUser', (userId) => {
        if (!onlineUsers.some(user => user.userId === userId)) {
            onlineUsers.push({
                userId,
                socketId: socket.id,
            });
        }
        io.emit('getOnlineUsers', onlineUsers);
    });

    // add message
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(
            (user) => user.userId === message.recipientId
        );

        if (user) {
            io.to(user.socketId).emit("getMessage", message); // Use user.socketId
        }
    });

    socket.on('disconnect', () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
    });
});

io.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});
