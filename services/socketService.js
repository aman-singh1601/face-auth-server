const { Server} = require('socket.io');

const io = new Server({
    cors: "*"
});

const userToSocketMap = new Map();
io.on("connection",(socket) => {
    console.log("socket connected");
    socket.on("subscribe" , (email)=> {
        console.log(email);
        socket.join(email);
    })
})
io.listen(6970, () => console.log(`socket running on port ${9001}`));

module.exports = {io, userToSocketMap};