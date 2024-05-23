import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/userSlice';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Swal from 'sweetalert2';
import {Link} from 'react-router-dom'


export default function Profile() {
  
  const dispatch = useDispatch()

  const {currentUser} = useSelector(state=>state.user)
  const fileRef = useRef()
  const [file,setFile] = useState(undefined)
  const [formData,setFormData] = useState({})
  const [filePerc,setFilePerc] = useState(0)
  const [fileUploadError,setFileUploadError] = useState(false)
  const {loading,error} = useSelector(state=>state.user)
  const [showListingError,setShowListingError] = useState(false)
  const [userListings,setUserListings] = useState({})
  const ScrollRef = useRef();

  console.log(formData);

  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])

  const handleFileUpload = (file)=>{

    const storage = getStorage(app)
    const newFile = new Date().getTime() + file.name
    const storageRef = ref(storage,newFile)
    const uploadTask = uploadBytesResumable(storageRef,file)

    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setFilePerc(Math.round(progress))
    },
  (error)=>{
    setFileUploadError(error)
  },
  ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
      setFormData({...formData,avatar:downloadURL})
    })

  }
  )
  }

  const handleChange = ((e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  })

  const handleSubmit = async (e)=>{

    e.preventDefault()

    try{

      dispatch(updateUserStart())

      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })

      const data = await res.json()

      if(data.success === false){
        dispatch(updateUserFailure(data.message))
        return
      }

      iziToast.success({
        icon: 'fas fa-check-circle',
        message: '<b>Updated successfully!</b>',
        position: 'topRight',
        timeout:1500
      });
      dispatch(updateUserSuccess(data))

    }

    catch(error){
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDelete = async ()=>{

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete !'
    }).then(async(result)=>{

      if(result.isConfirmed){
        try{
          dispatch(deleteUserStart())
    
          const res = await fetch(`/api/user/delete/${currentUser._id}`,{
            method:"DELETE"
          })
    
          const data = await res.json()
    
          if(data.success == false){
            dispatch(deleteUserFailure(data.error))
            return
          }
          iziToast.success({
            icon: 'fas fa-check-circle',
            message: '<b>Account deleted successfully!</b>',
            position: 'topRight',
            timeout:1500

          });
          dispatch(deleteUserSuccess(data))
        }
    
        catch(error){
          dispatch(deleteUserFailure(error.message))
        }
      }

    })
    
  }

  const handleSignOut = async () => {
  
    Swal.fire({
      title: 'Are you sure want to sign out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, sign out!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(signOutUserStart());
  
          const res = await fetch('/api/auth/signout');
          const data = await res.json();
  
          if (data.success === false) {
            dispatch(signOutUserFailure(data.error));
          } 
            dispatch(signOutUserSuccess(data));
            iziToast.success({
              icon: 'fas fa-check-circle',
              message: '<b>Signed out successfully!</b>',
              position: 'topRight',
              timeout:1500

            });
        } catch (error) {
          dispatch(signOutUserFailure(error.message));
        }
      }
    });
  };
  

const handleShow = ()=>{
  const pass = document.getElementById('password')
  if(pass.type == 'password'){
    pass.type = 'text'
  }
  else{
    pass.type = 'password'
  }
}
  

const  handleShowListings = async ()=>{

  try {
    setShowListingError(false)

    const res = await fetch(`/api/user/listings/${currentUser._id}`)
    
    const data = await res.json()

    if(data.success == false){
      setShowListingError(true)
      return
    }
    setUserListings(data)
    setShowListingError(false)
  } 

  catch (error) {
    setShowListingError(true)
  
  }
}

useEffect(() => {
  if (userListings.length > 0 ) {
    ScrollRef.current.scrollIntoView({behavior: 'smooth'})
  }
}, [userListings])

const handleListingDelete = async(listingId,listingName)=>{

    Swal.fire({
      title: `Are you sure want to delete`,
      html:`<i>${listingName}?</i>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then(async (result) => {
      if (result.isConfirmed) {

      try {
          const res = await fetch(`/api/listing/delete/${listingId}`,{
              method:"DELETE"
            }
          )

          const data = await res.json()

          if(data.success == false){
            return
          }

          setUserListings((prev)=>prev.filter((listing)=> listing._id !== listingId))
      } 
      
      catch (error) {
      console.log(error.message);  
      }
    }
  })
}
  return (
    <div className='p-5 sm:p-4 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-4'>Profile</h1>
      <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept='images/*' onChange={(e)=>setFile(e.target.files[0])}/>

     <div className='flex flex-col mx-auto'>
      <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='rounded-full w-24 h-24 object-cover self-center cursor-pointer' alt="profile" />
        <p className='text-center'>
          {fileUploadError ?
          ( <span className='text-red-500 text-sm text-center font-medium'>Only Image format less than 2 mb is allowed</span> )
          :
          filePerc > 0 && filePerc < 100 ?
            <div className="progress-container ">
              <div className="progress-bar " style={{ width: `${filePerc}%` }} ></div>
            </div>
          :
          filePerc === 100 ?
          ( <span className='text-green-500 text-sm text-center font-medium'>Image uploaded successfully</span> ) :
            ""
          }
        </p>
     </div>
        <input id='username' type="text" className='border rounded-lg p-3' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <input id='email' type="email" className='border rounded-lg p-3' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <input id='password' type="password" className='border rounded-lg p-3' placeholder='password' onChange={handleChange}/>
        <div className='flex gap-2'>
        <input type="checkbox" id='showPassword' className='cursor-pointer' onClick={handleShow} style={{accentColor:'rgb(51,65,85)'}}/>
        <label htmlFor="showPassword" className='text-sm text-slate-700 font-medium cursor-pointer'>Show password</label>
        </div>
        <button disabled={loading} className='bg-slate-700 rounded-lg p-3 text-white uppercase font-semibold hover:opacity-90 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95 font-semibold' to='/create-listing'>
          Create Listing
        </Link>
      </form>

      {error && <p className='text-red-700 font-medium mt-3'>{error}</p>}
      <div className='flex justify-between mt-5'>
        <p onClick={handleDelete} className='text-red-700 cursor-pointer font-semibold hover:underline'>Delete account</p>
        <p onClick={handleSignOut} className='text-red-700 cursor-pointer font-semibold hover:underline'>Sign Out</p>
      </div>

      <button onClick={handleShowListings} className='text-green-700 cursor-pointer font-semibold hover:underline w-full' >Show listings</button>

      <p className='text-red-700 font-medium'>{showListingError ? 'Error showing lists' : ''}</p> 

      {userListings && userListings.length > 0 && 

        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-6 text-2xl font-semibold' ref={ScrollRef}>Your Listings</h1>
          
        {userListings.map((listing)=>
        <div key={listing._id} className='flex justify-between items-center border rounded-lg my-4 gap-4 p-4'>
         <Link to={`/listing/${listing._id}`}>
          <img src={listing.imageUrls[0]} alt="listing image" className='w-16 h-16 object-contain' />
         </Link>
         <Link className='text-slate-700 font-semibold hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
          <p className='text-slate-700'>{listing.name}</p>
         </Link>

         <div className='flex flex-col items-center gap-4'>
          <p onClick={()=>handleListingDelete(listing._id,listing.name)} className='text-red-700 font-medium uppercase hover:underline cursor-pointer'>Delete</p>
          <p className='text-green-700 font-medium uppercase'>Edit</p>
         </div>
        </div>
      )}

        </div>
      
      }         
    </div>

    
  )
}
