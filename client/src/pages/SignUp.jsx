import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" id='username' placeholder='username' className='border p-3 rounded-lg focus:outline-none'/>
        <input type="text" id='email' placeholder='email' className='border p-3 rounded-lg focus:outline-none'/>
        <input type="text" id='password' placeholder='password' className='border p-3 rounded-lg focus:outline-none'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-90'>Sign Up</button>
      </form>
      <div className='flex gap-4 mt-5 font-medium'>
        <p>Already have an account?</p>
        <Link to='/sign-in'>
          <p className='text-blue-700 hover:underline'>Sign In</p>
        </Link>
      </div>
    </div>
  )
}
