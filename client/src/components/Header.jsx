import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className=' flex justify-between items-center mx-auto max-w-6xl p-3'>
            <h1 className='flex flex-wrap font-bold text-sm sm:text-xl '>
                <span className='text-green-700'>JoyBoy</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
            <form className='bg-slate-100 rounded-lg p-3'>
                <input type="text" placeholder='Search...' className='bg-transparent border-none outline-none'/>
            </form>
            <ul className='flex gap-4 text-slate-700 font-medium'>
                <Link to='/'>
                    <li className='hidden sm:inline hover:underline'>Home</li>
                </Link>
                <Link to='/about'>
                    <li className='hidden sm:inline hover:underline'>About</li>
                </Link>
                <Link to='/sign-in'>
                    <li className=' hover:underline'>Sign In</li>
                </Link>
                
            </ul>
        </div>
    </header>
  )
}
