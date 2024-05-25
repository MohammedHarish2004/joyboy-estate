import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

export default function Search() {

    const [sidebarData,setSidebarData] = useState({
        searchTerm:'',
        type:'all',
        parking:false,
        furnished:false,
        offer:false,
        sort:'created_at',
        order:'desc',
    })

    const [loading,setLoading] = useState(false)
    const [showMore,setShowMore] = useState(false)
    const [listings,setListings] = useState(false)

    useEffect(()=>{
     
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const offerFromUrl = urlParams.get('offer')
        const furnishedFromUrl = urlParams.get('furnished')
        const orderFromUrl = urlParams.get('order')
        const sortFromUrl = urlParams.get('sort')

        if(searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            offerFromUrl ||
            furnishedFromUrl ||
            orderFromUrl ||
            sortFromUrl 
        ){

            setSidebarData({
                searchTerm:searchTermFromUrl || '',
                type:typeFromUrl || 'all' ,
                parking:parkingFromUrl === 'true' ? true : false ,
                furnished:furnishedFromUrl === 'true' ? true : false ,
                offer:offerFromUrl === 'true' ? true : false ,
                order:orderFromUrl || 'created_at',
                sort:sortFromUrl || 'desc' 
            })

        }

        const fetchListings = async ()=>{

            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json()
            if (data.length > 8) {
                setShowMore(true);
              } else {
                setShowMore(false);
              }
              setListings(data);
              setLoading(false);
        }

        fetchListings()
    },[location.search])


    console.log(listings);

    const navigate = useNavigate()

    console.log(sidebarData);

    const handleChange = (e)=>{
        
        if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
            setSidebarData({
                ...sidebarData,
                type:e.target.id
            })
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setSidebarData({
                ...sidebarData,
                [e.target.id]:e.target.checked || e.target.checked === 'true' ? true : false
            })
        }

        if(e.target.id === 'searchTerm'){
            setSidebarData({
                ...sidebarData,
                searchTerm:e.target.value
            })
        }

        if(e.target.id === 'sort_order'){
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'

            setSidebarData({
                ...sidebarData,
                sort,
                order
            })
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault()

        const urlParams = new URLSearchParams()

        urlParams.set('searchTerm',sidebarData.searchTerm)
        urlParams.set('type',sidebarData.type)
        urlParams.set('offer',sidebarData.offer)
        urlParams.set('parking',sidebarData.parking)
        urlParams.set('furnished',sidebarData.furnished)
        urlParams.set('order',sidebarData.order)
        urlParams.set('sort',sidebarData.sort)

        const searchQuery = urlParams.toString()

        navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
          setShowMore(false);
        }
        setListings([...listings, ...data]);
      };

   
  return (
    <div className='flex flex-col  lg:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 lg:min-h-screen'>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2 '>
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input type="text" id="searchTerm" placeholder='Search...' className='border rounded-lg p-3  w-full' value={sidebarData.searchTerm} onChange={handleChange}/>
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='all' className='w-5' onChange={handleChange} checked={sidebarData.type === 'all'}/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-5'  onChange={handleChange} checked={sidebarData.type === 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-5'  onChange={handleChange} checked={sidebarData.type === 'sale'}/>
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='offer' className='w-5'  onChange={handleChange} checked={sidebarData.offer}/>
                        <span>Offer</span>
                    </div>
                  
                </div>

                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Amenities:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='parking' className='w-5'  onChange={handleChange} checked={sidebarData.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='furnished' className='w-5'  onChange={handleChange} checked={sidebarData.furnished}/>
                        <span>Furnished</span>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <label className='font-semibold'>Sort:</label>
                    <div className='flex gap-2'>
                        <select defaultValue={'created_at_desc'} onChange={handleChange} type="checkbox" id='sort_order' className='border rounded-lg p-3'>
                        <option value={'regularPrice_desc'}>Price high to low</option >
                        <option value={'regularPrice_asc'}>Price low to high</option>
                        <option value={'createdAt_desc'}>Latest</option>
                        <option value={'createdAt_asc'}>Oldest</option>
                        </select>
                    </div>
                </div>

                <button className='bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 p-3 font-medium'>Search</button>
            </form>
        </div>

        <div className='flex-1'>
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>

            <div className='flex flex-wrap gap-1'>
                {
                    !loading && listings.length === 0 &&

                    <p className='text-slate-700 text-center text-xl p-4 '>No listings found!</p>
                }

                {
                    loading &&

                    <p className='text-slate-700 text-center text-xl p-4 w-full'>Loading...</p>

                }

                {
                    !loading && listings &&listings.map((listing)=>(
                        <ListingCard key={listing._id} listing={listing} />
                    ))
                }

                {
                    showMore &&

                    <button onClick={()=>onShowMoreClick()} className='text-green-700 font-semibold hover:underline w-full p-7 text-center'>Show more</button>
                }
            </div>
        </div>
    </div>
  )
}
