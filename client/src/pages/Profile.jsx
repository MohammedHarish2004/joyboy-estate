import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';

export default function Profile() {
  
  const {currentUser} = useSelector(state=>state.user)
  const fileRef = useRef()
  const [file,setFile] = useState(undefined)
  const [formData,setFormData] = useState({})
  const [filePerc,setFilePerc] = useState(0)
  const [fileUploadError,setFileUploadError] = useState(false)

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

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-semibold my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type="file" ref={fileRef} hidden accept='images/*' onChange={(e)=>setFile(e.target.files[0])}/>

      <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='rounded-full w-24 h-24 object-cover self-center cursor-pointer' alt="profile" />
      <p className='text-center'>
        {fileUploadError ?
        ( <span className='text-red-500 text-sm text-center font-medium'>Image upload error</span> )
        :
        filePerc > 0 && filePerc < 100 ?
        ( <span className='text-green-500 text-sm text-center font-medium'>{`Uploading ${filePerc}%`}</span> )
        :
        filePerc === 100 ?
        ( <span className='text-green-500 text-sm text-center font-medium'>Image uploaded successfully</span> ) :
          ""
        }
      </p>
        <input type="text" className='border rounded-lg p-3' placeholder='username' />
        <input type="email" className='border rounded-lg p-3' placeholder='email' />
        <input type="password" className='border rounded-lg p-3' placeholder='password' />
        <button className='bg-slate-700 rounded-lg p-3 text-white uppercase font-semibold hover:opacity-90 disabled:opacity-80'>Update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <p className='text-red-700 cursor-pointer font-semibold hover:underline'>Delete account</p>
        <p className='text-red-700 cursor-pointer font-semibold hover:underline'>Sign Out</p>
      </div>
    </div>
  )
}
