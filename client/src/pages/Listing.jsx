import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper,SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
import { useSelector } from 'react-redux'
import Contact from '../components/Contact'
export default function Listing() {

    SwiperCore.use([Navigation, Autoplay])

    const params = useParams()
    const {currentUser} = useSelector(state=>state.user)
    const [listings,setListings] = useState(null)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    
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
        {loading && <div className='loader mx-auto mt-52'></div>}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong</p>}

        {listings && !error && !loading &&
        (
            <>
            <Swiper navigation autoplay={{delay:4000}} loop>
                {listings.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                        <img src={url} className='h-[230px] sm:h-[350px] md:h-[400px] lg:h-[500px]  w-full ' style={{objectFit:'cover'}} alt="" />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
            </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                <p className='text-2xl font-semibold'>
                {listings.name} - ${' '}
                {listings.offer 
                    ? listings.discountedPrice
                    : listings.regularPrice}
                {listings.type === 'rent' && ' / month'}
                </p>
                <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                <FaMapMarkerAlt className='text-green-700' />
                {listings.address}
                </p>

            <div className='flex flex-col gap-4'>
              <div className='flex gap-4 p-1'>
                <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                    {listings.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listings.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ${+listings.regularPrice - +listings.discountedPrice} OFF
                </p>
              )}

              </div>
                <p className='text-slate-800'>
                <span className='font-semibold text-black'>Description - </span>
                {listings.description}
                </p>
            </div>

            <div>
            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listings.bedrooms > 1
                  ? `${listings.bedrooms} beds `
                  : `${listings.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listings.bathrooms > 1
                  ? `${listings.bathrooms} baths `
                  : `${listings.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listings.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listings.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>
            </div>

            {
              currentUser && currentUser._id !== listings.userRef && !contact &&

              <button onClick={()=>setContact(true)} className='bg-slate-700 font-medium text-white rounded-lg p-3 uppercase'>Contact Landlord</button>
            }

            {
              contact &&
              <Contact listings={listings} />
            }
        </div>
            </>
        )
        }

    </main>
  )
}
