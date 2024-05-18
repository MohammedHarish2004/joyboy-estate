import User from "../models/user.model.js"
import bcryptjs from 'bcryptjs'

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