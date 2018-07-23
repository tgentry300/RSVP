const express = require('express')
// const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/test')

const port = 3000

const app = express()

const publicPath = '/public'

app.set('view engine', 'pug')
app.set("views", path.join(__dirname, "views"));

app.use(express.static(publicPath));
app.use(express.urlencoded())

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function(){
    console.log("we're connected")

    
})

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/reply', (req, res) => {
    console.log(req.body)
    res.render('reply')
})


app.listen(port)