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

  //generate token

  const token = generateToken(user._id)
  res.cookie("token",token,{
    path:"/",
    httpOnly: true,
    expiresIn: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true //https
});

  if(user && passwordCheck)
  {
      const{_id,name,email,photo,phone,bio}= user //not password
         res.status(201).json({ 
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        token
    });
  }else{
    res.status(400)
    throw new Error("Invalid email or password");
  }
});

//logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

//get status of login

const loginStatus = asyncHandler(async(req,res)=>
{
  const token = req.cookies.token;
  if(!token)
  {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET)

  if(verified)
  {
    return res.json(true);
  }
  return res.json(false);



})

//change password
const changePassword = asyncHandler(async(req,res)=>
{
  const user = await User.findById(req.user._id);

    const { oldPassword, password } = req.body;

    //validation
    if(!user)
    {
      res.status(400);
      throw new Error("No, user please signup");
    }

    if(!oldPassword || !password)
    {
      res.status(400);
      throw new Error("please add old along with new password");
    }

    //checking if old pass is correct
    const correct = await bcrypt.compare(oldPassword,user.password)

    //saving new password

    if(user && correct)
    {
      user.password = password;
      await user.save();
      res.status(200).send("password changed successfully")
    }
    else{
      res.status(400);
      throw new Error("Enter correct old password");
    }




    
    
  

})



const forgotPassword = asyncHandler (async (req,res)=> {
  res.send("forgot pass");
})

module.exports = {
    registerUser,
    loginUser,
    logout,
    updateUser,
    getUser,
    loginStatus,
    changePassword,
    forgotPassword
}