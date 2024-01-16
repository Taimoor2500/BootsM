const { response } = require("express");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// token for each user session
const generateToken =(id) => {

    return jwt.sign({id}, process.env.JWT_SECRET,{expiresIn : "1d"});

}


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
  



  // create user
  const user = await User.create({
    name,
    email,
    password

  })
  //Generate Token
  const token = generateToken(user._id)

  //HTTP cookie

  res.cookie("token",token,{
    path:"/",
    httpOnly: true,
    expiresIn: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true //https
});


  if(user) // retireve info
  {// new user create 201 status code
    const{_id,name,email,photo,phone,bio}= user //not password
    res.status(201).json({ 
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token
    })
  }else{
    res.status(400)
    throw new Error("Invalid user data")
  }

   
});

//Login user
const loginUser =asyncHandler(async (req,res)=>{
  const {email,password} = req.body

  //validating incoming requests
  if(!email || !password)
  {
    res.status(400);
    throw new Error("Please enter email and Password");
  }
  // checking user existence
  const user = await User.findOne({email});

  if(!user)
  {
    res.status(400);
    throw new Error("User not found");
  }

  //if user is valid

  const passwordCheck =  await bcrypt.compare(password,user.password);

  if(user && passwordCheck)
  {
      const{_id,name,email,photo,phone,bio}= user //not password
         res.status(201).json({ 
        _id,
        name,
        email,
        photo,
        phone,
        bio
    });
  }else{
    res.status(400)
    throw new Error("Invalid email or password");
  }
});

module.exports = {
    registerUser,
    loginUser
}