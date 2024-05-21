import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice'
import OAuth from '../components/OAuth'
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export default function SignIn() {

  const [formData,setFormData] = useState({})
  
  const {loading,error} = useSelector(state=>state.user)

  const [invalidError ,setInvalidError] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      dispatch(signInStart())

      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })

      const data = await res.json()

      if(data.success === false){
       dispatch(signInFailure(data.message))
        return
      }

     dispatch(signInSuccess(data))
     iziToast.success({
      icon: 'fas fa-check-circle',
      message: '<b>Signed in successfully!</b>',
      position: 'topRight',
      timeout:1500

    });
      navigate('/')
    }

    catch(error){
      dispatch(signInFailure(error.message))
    }
  }

  const handleShow = ()=>{
    const pass = document.getElementById('password')
    if(pass.type == 'password'){
      pass.type = 'text'
    }
    else{
      pass.type = 'password'
    }
  }

  


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="text" id='username' placeholder='username' className='border p-3 rounded-lg focus:outline-none' onChange={handleChange}/>
        <input type="password" id='password' placeholder='password' className='border p-3 rounded-lg focus:outline-none' onChange={handleChange}/>
        <div className='flex gap-2'>
        <input type="checkbox" id='showPassword' onClick={handleShow} style={{accentColor:'rgb(51,65,85)'}}/>
          <label htmlFor="showPassword" className='text-sm text-slate-700 font-medium'>Show password</label>
        </div>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-90'>{loading ? 'Loading...' : 'Sign In'}</button>
        <OAuth />
      </form>
      <div className='flex gap-4 mt-5 font-medium'>
        <p>Don t have an account?</p>
        <Link to='/sign-up'>
          <p className='text-blue-700 hover:underline'>Sign Up</p>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-2 font-medium'>{error}</p>}

    </div>
  )
}
