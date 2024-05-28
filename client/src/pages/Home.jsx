import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { Swiper,SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import HomeCard from '../components/HomeCard'

export default function Home() {

  SwiperCore.use([Navigation, Autoplay])

  const [offerListings,setOfferListings] = useState([])
  const [rentListings,setRentListings] = useState([])
  const [saleListings,setSaleListings] = useState([])

  console.log(offerListings);
  useEffect(()=>{
    
    const fetchOfferListings = async ()=>{

      try {

        const res = await fetch('/api/listing/get?offer=true&limit=4')

        const data = await res.json()

        setOfferListings(data)
        fetchRentListings()
        
      } 
      catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings()
    const fetchRentListings = async ()=>{

      try {
      
        const res = await fetch('/api/listing/get?type=rent&limit=4')

        const data = await res.json()

        setRentListings(data)
        fetchSaleListings()
        
        
      } 
      
      catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async ()=>{

      try {
      
        const res = await fetch('/api/listing/get?type=sale&limit=4')

        const data = await res.json()

        setSaleListings(data)
      } 
      
      catch (error) {
        console.log(error);
      }
    }
  },[])
  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 py-14 sm:py-28  px-3 max-w-6xl mx-auto'>
        
        <h1 className='text-slate-700 font-bold text-3xl md:text-4xl lg:text-6xl '>
          Find your next <span className='text-slate-500'>perfect</span> 
          <br />
          place with ease
        </h1>

        <div className='text-gray-400 text-sm sm:text-lg'>
          Joyboy Estate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={'/search'} className='text-sm sm:text-lg text-blue-800 font-bold hover:underline'>
          Lets get started
        </Link>
      </div>

      {/* swiper */}

      <Swiper navigation autoplay={{delay:4000}} loop>
      {
        offerListings && offerListings.length > 0 && 
        offerListings.map((listing)=>(

                  <SwiperSlide key={listing._id}>
                    <img src={listing.imageUrls[0]} className='h-[230px] sm:h-[350px] md:h-[400px] lg:h-[500px]  w-full ' style={{objectFit:'cover'}} alt="listing image" />
                  </SwiperSlide>    
    
        ))
      }
      </Swiper>


      {/* listing results for offer , sale , and rent*/}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

        {
          offerListings && offerListings.length > 0 && (
            <div className=''>
                <div className='my-3'>
                  <h1 className='text-2xl font-semibold text-slate-600 '>Recent Offers</h1>
                  <Link to={'/search?offer=true'} className='text-sm font-medium text-blue-800 hover:underline'>
                    Show more offers
                  </Link>
                </div>

                <div className='flex flex-wrap'>
                  {
                    offerListings.map((listing)=>(
                      <HomeCard key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
            </div>
          )
        }

      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

        {
          rentListings && rentListings.length > 0 && (
            <div className=''>
                <div className='my-3'>
                  <h1 className='text-2xl font-semibold text-slate-600 '>Recent Rent</h1>
                  <Link to={'/search?type=rent'} className='text-sm font-medium text-blue-800 hover:underline'>
                    Recent places for rent
                  </Link>
                </div>

                <div className='flex flex-wrap'>
                  {
                    rentListings.map((listing)=>(
                      <HomeCard key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
            </div>
          )
        }

      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

        {
          saleListings && saleListings.length > 0 && (
            <div className=''>
                <div className='my-3'>
                  <h1 className='text-2xl font-semibold text-slate-600 '>Recent Sale</h1>
                  <Link to={'/search?type=sale'} className='text-sm font-medium text-blue-800 hover:underline'>
                  Recent places for sale
                  </Link>
                </div>

                <div className='flex flex-wrap'>
                  {
                    saleListings.map((listing)=>(
                      <HomeCard key={listing._id} listing={listing}/>
                    ))
                  }
                </div>
            </div>
          )
        }

      </div>
    </div>
  )
}
