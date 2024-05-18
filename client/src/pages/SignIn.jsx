import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInFailure, signInStart, signInSuccess } from '../redux/userSlice'

export default function SignIn() {

  const [formData,setFormData] = useState({})
  
  const {loading,error} = useSelector(state=>state.user)

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
       dispatch(signInFailure(data.error))
        return
      }

     dispatch(signInSuccess())
      navigate('/')
    }

    catch(error){
      setLoading(false)
      setError(error.message);
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="text" id='username' placeholder='username' className='border p-3 rounded-lg focus:outline-none' onChange={handleChange}/>
        <input type="password" id='password' placeholder='password' className='border p-3 rounded-lg focus:outline-none' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-90'>{loading ? 'Loading...' : 'Sign In'}</button>
      </form>
      <div className='flex gap-4 mt-5 font-medium'>
        <p>Dont have an account?</p>
        <Link to='/sign-up'>
          <p className='text-blue-700 hover:underline'>Sign Up</p>
        </Link>
      </div>
      {error && <p className='text-red-700'>{error}</p>}
    </div>
  )
}
