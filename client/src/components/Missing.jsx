import React from 'react'
import missing from '../assets/notfound.png'

export default function Missing() {
  return (
    <div className='flex justify-center my-8'>
        <img src={missing} alt="" className=''/>
    </div>
  )
}
