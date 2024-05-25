import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

export default function ListingCard({listing}) {
  return (
   
   <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[270px] mx-3 my-3 '>
    <Link to={`/listing/${listing._id}`} className=''>
        <img src={listing.imageUrls[0]} alt={listing.name} className='h-[300px] sm:h-[200px] w-full object-cover hover:scale-105 transition-scale duration-300 '/>

        <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='text-lg font-semibold text-slate-700 truncate '>{listing.name}</p>

            <div className='flex items-center gap-2 '>
                <MdLocationOn className='h-8 w-8 text-green-700'/>
                <p className='text-slate-700 text-sm truncate'>{listing.address}</p>
            </div>

            <p className='line-clamp-2 text-sm text-gray-600'>{listing.description}</p>

            <p className='text-slate-500 mt-2 font-semibold flex items-center'>
            $
            { 
                listing.offer ?  listing.discountedPrice.toLocaleString('eng-US') : 
                listing.regularPrice.toLocaleString('eng-US')
            }
            {listing.type === 'rent' && ' / month'}

            </p>            

           <div className='flex gap-4 text-slate-700'>
                <div className='font-bold text-sm flex gap-2 '>
                    <p>{listing.bedrooms > 1 ? `${listing.bedrooms}beds` : `${listing.bedrooms}bed` }</p>
                </div>
                <div className='font-bold text-sm flex gap-2 '>
                    <p>{listing.bathrooms > 1 ? `${listing.bathrooms}baths` : `${listing.bathrooms}bath` }</p>
                </div>
           </div>


        </div>
    </Link>
   </div>

  )
}
