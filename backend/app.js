const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const path = require('path')

const errorMiddleware = require('./middlewares/errors');

// Setting up config file
if(process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

app.use(express.json());
app.use(cookieParser());



//Import all routes
const announcements = require('./routes/announcement');
const auth = require('./routes/auth');
const conversation = require('./routes/conversation');
const message = require('./routes/message');
const request = require('./routes/request');
const audit = require('./routes/audit');
const announcementType = require('./routes/announcementType')
const course = require('./routes/course')
const form = require('./routes/form')

app.use('/api/v1', announcements)
app.use('/api/v1', auth)
app.use('/api/v1', conversation)
app.use('/api/v1', message)
app.use('/api/v1', request)
app.use('/api/v1', audit)
app.use('/api/v1', announcementType)
app.use('/api/v1', course)
app.use('/api/v1', form)

if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

// Middleware to handle errors
app.use(errorMiddleware);


//socket
const http = require('http')

const socketio = require('socket.io')

var cors = require('cors')
app.use(cors())


const server = http.createServer(app)

const io = socketio(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"],
        credentials: true // ip add of frontend
    }
})

server.listen(process.env.SOCKET_PORT, () => console.log(`Socket connected to port: ${process.env.SOCKET_PORT}`))

//socket code
let users = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
    console.log('a user connected', socket.id)

    //take userID and socketId from user
    socket.on('addUser', (userId) => {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        try {
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text
            });
        } catch (err) {
            console.log('user is offline')
        }
    });

    //on disconnection
    socket.on('disconnect', () => {
        console.log('a user disconnected', socket.id)
        removeUser(socket.id)
        io.emit("getUsers", users);
    })
})

module.exports = app