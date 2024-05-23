import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper,SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'

export default function Listing() {

    SwiperCore.use([Navigation, Autoplay])

    const params = useParams()
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    
    useEffect(()=>{
        const fetchListing = async()=>{
            
           try {
                setLoading(true)
                const listing = params.listingId
                const res = await  fetch(`/api/listing/get/${listing}`)
                const data = await res.json()
                if(data.success == false){
                    setLoading(false)
                    setError(true)
                    return
                }
                setError(false)
                setLoading(false)
                setListings(data)

           } catch (error) {
            setError(true)
            setLoading(false)
           }
        }
        fetchListing()
    },[params.listingId])
  
    return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>{loading}</p>}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}

        {listings && !error && !loading &&
        (
            <>
            <Swiper navigation autoplay={{delay:3000}} loop>
                {listings.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                        {/* <div className='h-[500px]' style={{background:`url(${url}) center no-repeat`, backgroundSize:'cover'}}>

                        </div> */}

                        <img src={url} className='h-[500px] w-full' style={{objectFit:'cover'}} alt="" />
                    </SwiperSlide>
                ))}
            </Swiper>
            </>
        )
        }

    </main>
  )
}
