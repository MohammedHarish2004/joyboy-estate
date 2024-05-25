import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
export default function Contact({listings}) {

    const [landlord,setLandLord] = useState(null)
    const [message,setMessage] = useState(null)

    useEffect(()=>{
        const fetchLandLord = async ()=>{

           try {
            const res = await fetch(`/api/user/${listings.userRef}`)
            const data = await res.json()

            if(data.success == false){
                return
            }

            setLandLord(data)
           } catch (error) {
            console.log(error);
           }
        }

        fetchLandLord()
    },[listings.userRef])

    const onChange = ()=>{

    }

    return (
    <>
    {landlord && 
        <div className='flex flex-col gap-2'>
            <p>Contact: <span className='font-semibold'>{landlord.username}</span> for 
                <span className='font-semibold'> {listings.name.toLowerCase()}</span>
            </p>
            <textarea  id="message" rows='2' value={message} placeholder='Enter the message...' onChange={onChange} className='w-full p-3 border rounded-lg'></textarea>
            <Link to={`mailto:${landlord.email}?subject=Regarding ${listings.name}&body=${message}`} className='bg-slate-700 p-3 text-center uppercase hover:opacity-95 rounded-lg text-white'>
                Send Message
            </Link>
        </div>
    }
    </>
  )
}
