import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link,useNavigate } from 'react-router-dom'
import {
  FaSearch,
} from 'react-icons/fa';

export default function Header() {
    const {currentUser} = useSelector(state=>state.user)

    const [searchTerm,setSearchTerm] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (e)=>{
        e.preventDefault()

        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('searchTerm',searchTerm)

        const searchQuery = urlParams.toString()

        navigate(`/search?${searchQuery}`)

     
    }

    useEffect(()=>{
      const urlParams = new URLSearchParams(location.search)
      const searchTermFromUrl = urlParams.get('searchTerm')

      if(searchTermFromUrl){
        setSearchTerm(searchTermFromUrl)
      }
    },[location.search])

  return (
    <header className='bg-slate-200 shadow-md'>
        <div className=' flex gap-1 justify-between items-center mx-auto max-w-6xl p-3'>
          <Link to='/'>
            <h1 className='flex flex-wrap font-medium text-sm sm:text-xl '>
                <span className='text-green-600'>JoyBoy</span>
                <span className='text-slate-700'>Estate</span>
            </h1>
          </Link>
            <form onSubmit={handleSubmit}  className='bg-slate-100 rounded-lg p-2  sm:p-3 flex items-center justify-center'>
                <input onChange={(e)=>setSearchTerm(e.target.value)} value={searchTerm} type="text" placeholder='Search...' className='bg-transparent border-none outline-none'/>
                <button >
                  <FaSearch />
                </button>
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
