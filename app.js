const express = require('express')
const path = require('path')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/rsvp')

const port = 3000

const app = express()

const publicPath = '/public'

app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "views"));

app.use(express.static(publicPath));
app.use(express.urlencoded())

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log("we're connected")
})

const rsvpSchema = mongoose.Schema({
    name: String,
    email: String,
    attending: String,
    numGuests: String
})

//get request at root endpoint
app.get('/', (req, res) => {
    res.render('index')
})



//post request to /reply endpoint and saving newGuest to mongodb
app.post('/reply', (req, res) => {
    // console.log(req.body)

    const Response = mongoose.model('Response', rsvpSchema)

    const newGuest = new Response({
        name: req.body.name,
        email: req.body.email,
        attending: req.body.attending,
        numGuests: req.body.numGuests
    })

    newGuest.save((err, newGuest) => {
        if (err) return console.error(err)
    })

    //rendering reply.pug
    res.render('reply')
})

//get request at /guests to show guest list
app.get('/guests', (req, res) => {

    const Response = mongoose.model('Response', rsvpSchema)

    Response.find(function (err, rsvp) {
        if (err) return console.error(err)
            
        // console.log(rsvp)
        // rsvp.forEach(guest => {
        //     // console.log(guest)
        // });
        res.render('guests', {guestlist: rsvp})
    })
})

//listening at port as defined above
app.listen(port)