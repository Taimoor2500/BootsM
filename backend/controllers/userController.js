const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req,res) => {

   const {name,email,password} = req.body

   //validations
   if(!name || !email || !password){
    res.status(400)
    throw new Error("Fill all fields")
   }

   if(password.length < 6){
    res.status(400)
    throw new Error("password should be upto atleast 6 characters")
    
   }

   //checking for existing mails
  const  userExists = await User.findOne({email})
  if(userExists)
  {
    res.status(400)
    throw new Error("Email already in use")
  }

//hash pass  (encryption)

const salt = await bcrypt.genSalt(11); //salt for hash

const hashedPassword = await bcrypt.hash(password,salt);



  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword

  })
  if(user) // retireve info
  {// new user create 201 status code
    const{_id,name,email,photo,phone,bio}= user //not password
    res.status(201).json({ 
        _id,
        name,
        email,
        photo,
        phone,
        bio
    })
  }else{
    res.status(400)
    throw new Error("Invalid user data")
  }

   
});

module.exports = {
    registerUser
}