const { Server} = require('socket.io');
const { server}= require('../index');

const io = new Server(server, {
    cors: "https://face-auth-client.vercel.app"
});

const userToSocketMap = new Map();
io.on("connection",(socket) => {
    console.log("socket connected");
    socket.on("subscribe" , (email)=> {
        console.log(email);
        socket.join(email);
    })
})

module.exports = {io, userToSocketMap};