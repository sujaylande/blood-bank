const mongoose = require('mongoose');


mongoose.connect("");

// connection object:
const connection = mongoose.connection;

connection.on("connected", ()=>{
    console.log("Mongo db Connected");
})

connection.on("error", ()=>{
    console.log("Mongo db connection error", err);
})


