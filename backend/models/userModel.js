const { default: mongoose } = require("mongoose")

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is necessary"] //field is required
    },
    email:{
        type: String,
        required: [true, "email is necessary"],
        unique:true,
        trim:true,
        match: [ // make sure valid
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid emaial",
        ]
    },
    password:{
        type: String,
        required: [true, "password is necessary"],
        minLength: [6,"cannot be less than 6"],
        maxLength: [30,"cannot be more than 30"] ,// avoid malicious string


    },
    photo:{
        type: String,
        required: [true, "photo is necessary"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"

    },
    phone:{
        type: String,
        default: "+92"

    },
    bio:{
        type: String,
        default: "bio",
        maxLength: [300, "Bio cant be more than 300 characters"]

    }

}, {
    timeStamps: true
} )

// everytime i want to access ill user below


const User = mongoose.model("User",userSchema)
model.exports = User