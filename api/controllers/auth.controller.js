import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { errorHandler } from "../utils/error.js"

export const signUp = async (req,res,next)=>{

  try{
    const {username,email,password} = req.body
    const hashedPassword = bcryptjs.hashSync(password,10) 
    const newUser = new User({username,email,password:hashedPassword})
    await newUser.save()
    res.status(200).json('User created successfully')
  }
  catch(error){
    next(error)
  }

}

export const signIn = async (req,res,next)=>{

  const {username,password} = req.body

  try{
    
  const validUser = await User.findOne({username})
  if(!validUser) return next(errorHandler(201,'Invalid username'))

  const validPassword = bcryptjs.compareSync(password,validUser.password)
  if(!validPassword) return next(errorHandler(201,'Wrong password'))

  const token = jwt.sign({id:validUser._id,},process.env.JWT_SECRET)
  const {password:pass,...rest} = validUser._doc

  res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
  }
  catch(error){
    next(error)
  }

}