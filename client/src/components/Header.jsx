import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Header() {
    const {currentUser} = useSelector(state=>state.user)

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className=' flex gap-1 justify-between items-center mx-auto max-w-6xl p-3'>
            <h1 className='flex flex-wrap font-bold text-sm sm:text-xl '>
                <span className='text-green-700'>JoyBoy</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
            <form className='bg-slate-100 rounded-lg p-2  sm:p-3 '>
                <input type="text" placeholder='Search...' className='bg-transparent border-none outline-none'/>
            </form>
            <ul className='flex justify-center items-center gap-4 text-slate-700 font-medium'>
                <Link to='/'>
                    <li className='hidden sm:inline hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline hover:underline'>About</li>
                </Link>
                <Link to='/profile'>
                {currentUser ?
                <img src={currentUser.avatar} className='rounded-full  w-8 h-8  object-cover' alt="" />
                :
                    <li className='hover:underline'>Sign In</li>

                }
                </Link>
                
            </ul>
        </div>
    </header>
  )
}
