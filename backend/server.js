const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const  userRoute = require("./routes/userRoute");
const errorHandler = require("./middleWare/errorMiddleWare");


const app = express()

const PORT = process.env.PORT || 5000;

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())


//RouteMiddlewares
app.use("/api/users", userRoute);


//routes
app.get("/",(req,res)=> {
    res.send("Home Page");
})

//Error Middleware
app.use(errorHandler); //refrencing errorhandler

//connecting my db

mongoose.
connect(process.env.MONGO_URI).then( ()=>{

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
})
.catch((err)=> console.log(err))