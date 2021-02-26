const socketio = require("socket.io")
const {
    addUserToRoom,
    getUsersInRoom,
    getUserBySocket,
    removeUserFromRoom,
    ConnectUser,
  } = require("./utils/users")
  const addMessage = require("./utils/messages")
  const activeUsers = new Set()
const createSocketServer = server =>{
    const io = socketio(server)

    io.on("connection",socket=>{
        console.log(`It's connected ${socket.id}`)

        socket.on("joinRoom",async data =>{
            try {
                const  {username,room} = await addUserToRoom({
                    socketId: socket.id,
                    ...data,
                })
                socket.join(room)

                const messageToRoomMembers = {
                    sender:"Admin",
                    text:`${username} welcome to the Azizi Family`,
                    createdAt:new Date(),
                }
                socket.broadcast.to(room).emit("message",messageToRoomMembers)

                const roomMembers = await getUsersInRoom(room)
                io.to(room).emit("roomData",{room,users:roomMembers})
            } catch (error) {
                console.log(error)
            }
        })
        socket.on("sendMessage",async({room,message})=>{
            const user = await getUserBySocket(room,socket.id)
            const messageContent = {
                test:message,
                sender:user.username,
                room,
            }
            await addMessage(messageContent.sender,room,messageContent.text)

            io.to(room).emit("message",messageContent)
        })
        socket.on("leaveRoom",async({room})=>{
            try {
                const username = await removeUserFromRoom(socket.id,room)
                const messageToRoomMembers = {
                    sender:"Admin",
                    text:`${username} has left the family AZIZI`,
                    
                }
                io.to(room).emit("message",messageToRoomMembers)

                const roomMembers = await getUsersInRoom(room)
                io.to(room).emit('roomData',{room,users:roomMembers})
            } catch (error) {
                console.log(error)
            }
        })
        socket.emit("connectUser", async data=> {
            const {username}= await ConnectUser({
                socketId:socket.id,
                ...data,
            })
            console.log(username)
        });

        socket.on("sendMsg", async (data) => {
            socket.userId = data;
            activeUsers.add(data);
            io.emit("new user", [...activeUsers]);
          });
        
        
    })
}


module.exports = createSocketServer