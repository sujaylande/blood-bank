const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://bloodbank:bloodbank@cluster0.hk8qafu.mongodb.net/?retryWrites=true&w=majority");

// connection object:
const connection = mongoose.connection;

connection.on("connected", ()=>{
    console.log("Mongo db Connected");
})

connection.on("error", ()=>{
    console.log("Mongo db connection error", err);
})


