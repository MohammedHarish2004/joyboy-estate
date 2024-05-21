  import React, { useState } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import iziToast from 'izitoast';
  import 'izitoast/dist/css/iziToast.min.css';

  export default function SignUp() {

    const [formData,setFormData] = useState({})
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const navigate = useNavigate()

    const handleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })
    }

    const handleSubmit = async(e)=>{

      e.preventDefault();

      try{
        setLoading(true)

        const res = await fetch('/api/auth/signup',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(formData)
        })

        console.log(res);

        const data = await res.json()

        if(data.success === false){
          setLoading(false)
          setError(data.message)
          return
        }

        setLoading(false)
        setError(null)
        iziToast.success({
          icon: 'fas fa-check-circle',
          message: '<b>Signed up successfully!</b>',
          position: 'topRight',
          timeout:1500

        });
        navigate('/sign-in')
      }

      catch(error){
        setLoading(false)
        setError(error.message);
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
        <h1 className='text-3xl font-semibold text-center my-7'>Sign Up</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <input type="text" id='username' placeholder='username' className='border p-3 rounded-lg focus:outline-none' onChange={handleChange}/>
          <input type="email" id='email' placeholder='email' className='border p-3 rounded-lg focus:outline-none' onChange={handleChange}/>
          <input type="password" id='password' placeholder='password' className='border p-3 rounded-lg focus:outline-none' onChange={handleChange}/>
          <div className='flex gap-2'>
            <input type="checkbox" id='showPassword' onClick={handleShow} style={{accentColor:'rgb(51,65,85)'}}/>
            <label htmlFor="showPassword" className='text-sm text-slate-700 font-medium'>Show password</label>
          </div>
          <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-90'>{loading ? 'Loading...' : 'Sign Up'}</button>
        </form>
        <div className='flex gap-4 mt-5 font-medium'>
          <p>Already have an account?</p>
          <Link to='/sign-in'>
            <p className='text-blue-700 hover:underline'>Sign In</p>
          </Link>
        </div>
        {error && <p className='text-red-700 mt-2 font-medium'>{error}</p>}
      </div>
    )
  }
