import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import cors from "cors";

const port = 5000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        creadentials: true
    }
});  // So we have created a circuit 

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    creadentials: true
}))

// io middleware
const user = true
io.use((socket, next) => {
    if(user) next();
}) 

io.on("connection", (socket) => {   // Individual socket
    console.log("User connected");
    console.log("id :-", socket.id);   // every socket has an id

    socket.emit("welcome", `Welcome to the server ${socket.id}`);  // message go to the client side when listen

    socket.broadcast.emit("broadcast", `${socket.id} joined the server`);

    socket.on("message", (data) => {
        console.log(data);
        // io.emit("recieve-message", data);  // This message will send everyone and also including me
        // socket.broadcast.emit("recieve-message", data);  // This message will send everyone but except me

        // io.to(data.room).emit("single-message", data);  // This message will send the specific room user
        // OR both will work as same io.to() / socket.to()
        socket.to(data.room).emit("single-message", data);  // This message will send the specific room user
    })

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log("User joined the room", room)
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} is disconnected`);
    })

});
 
app.get("/", (req, res) => {
    res.send("<h1>Server Running Successfully !</h1>")
})

server.listen(port || 5000, () => {
    console.log(`Server is running on ${port}`);
});