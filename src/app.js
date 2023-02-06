import express from 'express'
import handlebars from 'express-handlebars'
import { __dirname } from './utils.js'
import {Server} from 'socket.io'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

//motor de plantilla
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname+'/views')

//ruta raiz
app.get('/', (req,res)=>{
    res.render('socket')
})

const httpServer = app.listen(2022,()=>{
    console.log('Listening to port 2022')
})

const SocketServer = new Server(httpServer)
const menssages = []

SocketServer.on('connection',socket=>{
    console.log(`user connected ${socket.id}`)

    socket.on('disconnect',()=>{
        console.log('user disconnected')
    })

    socket.on('nuevoUsuario', usuario=>{
        socket.broadcast.emit('broadcast',usuario)
    })

    socket.on('mensaje',info=>{
        menssages.push(info)
        SocketServer.emit('chat',menssages)
    })
})