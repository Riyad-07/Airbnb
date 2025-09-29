const express = require('express')
const app = express();
const mongoose = require('mongoose');
const path = require('path');


app.use(express.json());
app.use(express.urlencoded({extended: true}));

//------------------------------------------------------------------------------------> Home route
app.get("/", (req, res) => {
    res.send("You are in home page")
})



app.listen(8080, () => {
    console.log("Server is running...........");    
})