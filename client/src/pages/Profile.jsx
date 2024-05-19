import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/userSlice';

export default function Profile() {
  
  const dispatch = useDispatch()

  const {currentUser} = useSelector(state=>state.user)
  const fileRef = useRef()
  const [file,setFile] = useState(undefined)
  const [formData,setFormData] = useState({})
  const [filePerc,setFilePerc] = useState(0)
  const [fileUploadError,setFileUploadError] = useState(false)
  const {loading,error} = useSelector(state=>state.user)

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

      dispatch(updateUserSuccess(data))

    }

    catch(error){
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDelete = async ()=>{

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

      dispatch(deleteUserSuccess(data))
    }

    catch(error){
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignOut = async ()=>{

    try{
      dispatch(signOutUserStart())

      const res = await fetch('/api/auth/signout')

      const data = await res.json()

      if(data.success == false){
        dispatch(signOutUserFailure(data.error))
      }

      dispatch(signOutUserSuccess(data))

    }

    catch(error){
      dispatch(signOutUserFailure(error.message))
    }
  }

  

const handleShow = ()=>{
  const pass = document.getElementById('password')
  if(pass.type == 'password'){
    pass.type = 'text'
  }
  else{
    pass.type = 'password'
  }
}
  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept='images/*' onChange={(e)=>setFile(e.target.files[0])}/>

      <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='rounded-full w-24 h-24 object-cover self-center cursor-pointer' alt="profile" />
      <p className='text-center'>
        {fileUploadError ?
        ( <span className='text-red-500 text-sm text-center font-medium'>Only Image format less than 2 mb is allowed</span> )
        :
        filePerc > 0 && filePerc < 100 ?
        ( <span className='text-green-500 text-sm text-center font-medium'>{`Uploading ${filePerc}%`}</span> )
        :
        filePerc === 100 ?
        ( <span className='text-green-500 text-sm text-center font-medium'>Image uploaded successfully</span> ) :
          ""
        }
      </p>
        <input id='username' type="text" className='border rounded-lg p-3' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <input id='email' type="email" className='border rounded-lg p-3' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <input id='password' type="password" className='border rounded-lg p-3' placeholder='password' onChange={handleChange}/>
        <div className='flex gap-2'>
        <input type="checkbox" id='showPassword' onClick={handleShow} style={{accentColor:'rgb(51,65,85)'}}/>
        <label htmlFor="showPassword" className='text-sm text-slate-700 font-medium'>Show password</label>
        </div>
        <button disabled={loading} className='bg-slate-700 rounded-lg p-3 text-white uppercase font-semibold hover:opacity-90 disabled:opacity-80'>{loading ? 'Loading...' : 'Update'}</button>
      </form>
      {error && <p className='text-red-700 font-medium mt-3'>{error}</p>}
      <div className='flex justify-between mt-5'>
        <p onClick={handleDelete} className='text-red-700 cursor-pointer font-semibold hover:underline'>Delete account</p>
        <p onClick={handleSignOut} className='text-red-700 cursor-pointer font-semibold hover:underline'>Sign Out</p>
      </div>
    </div>
  )
}
