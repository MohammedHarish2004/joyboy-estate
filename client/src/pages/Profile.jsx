import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  
  const {currentUser} = useSelector(state=>state.user)

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
      <img src={currentUser.avatar} className='rounded-full w-24 h-24 object-cover self-center cursor-pointer' alt="profile" />
        <input type="text" className='border rounded-lg p-3' placeholder='username' />
        <input type="email" className='border rounded-lg p-3' placeholder='email' />
        <input type="password" className='border rounded-lg p-3' placeholder='password' />
        <button className='bg-slate-700 rounded-lg p-3 text-white uppercase font-semibold hover:opacity-90 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <p className='text-red-700 cursor-pointer font-semibold hover:underline'>Delete account</p>
        <p className='text-red-700 cursor-pointer font-semibold hover:underline'>Sign Out</p>
      </div>
    </div>
  )
}
