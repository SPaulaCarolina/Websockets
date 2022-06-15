const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const { engine } = require('express-handlebars')
const Container = require('./class')

const app = express()
const httpServer = http.createServer(app);
const io = new Server(httpServer)

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
}))

app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/public', express.static(__dirname + '/public'))

const products =[
    {name: "Vela aromática", category: "Deco&home", price: 200, img: "https://media.istockphoto.com/vectors/aromatic-candle-vector-sketch-drawn-illustration-in-engraving-style-vector-id1302457530?s=612x612"},
    {name: "Espejo circular", category: "Deco&home", price: 1500, img: "https://cdn1.iconfinder.com/data/icons/prettycons-furniture-and-households-vol-1-flat/58/60-Mirror-furniture_room_appliance_household-256.png"},
    {name: "Almohadones decorativos",category:"Deco&home", price: 1000, img: "https://cdn2.iconfinder.com/data/icons/interior-homedecor-vol-1-outline/512/chusions_chusion_pillow_fabric-256.png"},
    {name: "Lampara de escritorio", category: "Iluminacion", price: 2500, img: "https://cdn1.iconfinder.com/data/icons/interior-homedecor-vol-2/512/table_lamp_light_desk-256.png"}
]

const productsDB =  new Container('products.json')
const messagesDB = new Container('messages.json')

app.get('/', (req, res) => {
    res.render('index', {products} )
})
app.get('/messages', (req, res) => {
    res.render('chat', {
        messages: messagesDB.getAll()
    })
})

app.get('/products', (req, res) => {
    res.render('products', {
        products: products,
        listExist: false
    } )
})

app.post('/products', (req, res) => {
    products.push(req.body)
    productsDB.save(req.body)
    res.render('products.hbs', {products})
})

io.on('connection', socket => {
    socket.on('add', data => {
        products.push(data)
        io.sockets.emit('show', products)
    })
    socket.on('chat-in', data => {
        const dateString = new Date().toLocaleString()
        const dataOut = {
            msg: data.msg, 
            username: data.username,
            date: dateString
        }
        messagesDB.save(dataOut)
        io.sockets.emit('chat-out', 'OK')
    })
});

const server = httpServer.listen(8080, () => { console.log( "Server listening..." ) })
server.on('error', e => { console.log( "Error on server", e ) })