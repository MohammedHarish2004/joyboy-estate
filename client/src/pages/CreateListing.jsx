import React, { useState } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { useSelector } from 'react-redux'
import {useNavigate} from 'react-router-dom'
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export default function CreateListing() {

    const [files,setFiles] = useState([])
    const {currentUser} = useSelector(state=>state.user)
    const[imageUploadError,setImageUploadError] = useState(false)
    const [upload, setUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate()
    const [formData,setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountedPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    })

    console.log(formData);
    
    // We are using promises for uploading multiple images
    
    const handleImageSubmit = ()=>{
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUpload(true)
            const promises = [];

            for(let i=0;i< files.length ; i++){
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises).then((urls)=>{
                setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)})
                setImageUploadError(false)
                setUpload(false)


            }).catch((err)=>{
                setImageUploadError('Image upload failed (2 mb max per image)')
                setUpload(false)
            })
        }
        else{
            setImageUploadError('You can only upload 6 images per listing')
            setUpload(false)
        }
    }

    const storeImage = async(file)=>{
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage,fileName)

            const uploadTask = uploadBytesResumable(storageRef,file)

            uploadTask.on('state_changed',
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress);
            },
                (error)=>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL)
                    });
                }
            )
        });
    }

    const imageRemove = (index)=>{
        setFormData({
            ...formData,
            imageUrls:formData.imageUrls.filter((_,i)=> i !== index)
        })
    }

   const handleChange = (e)=>{

    if(e.target.id === 'sale' || e.target.id === 'rent' ){
        setFormData({
            ...formData,
            type:e.target.id
        })
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
        setFormData({
            ...formData,
            [e.target.id]:e.target.checked
        })
    }

    if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
    }

   }

   const handleSubmit = async (e)=>{
    e.preventDefault()

     try {
        if(formData.imageUrls.length < 1) return setError('You must upload atleast one image')
        if(+formData.regularPrice < +formData.discountedPrice) return setError('Discount price must be lower than regular price')

        setLoading(true)
        setError(false)

        const res = await fetch('/api/listing/create',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                ...formData,
                userRef:currentUser._id
            })
        })

        const data = await res.json()

        if(data.success == false){
            setError(data.message)
            setLoading(false)
            return
        }

        iziToast.success({
            icon: 'fas fa-check-circle',
            message: '<b>Listing created successfully!</b>',
            position: 'topRight',
            timeout:2000
      
          });
        navigate(`/listing/${data._id}`)
        setError(false)
        setLoading(false)

     } catch (error) {
        setError(true)
        setLoading(false)
     }
   }

    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4' onSubmit={handleSubmit}>
            <div className='p-3 flex flex-col gap-6 flex-1'>
                <input type="text" className='border p-3 rounded-lg' placeholder='Name' 
                id='name' maxLength='62' minLength='10' required onChange={handleChange} value={formData.name}/>

                <textarea type="text" className='border p-3 rounded-lg' placeholder='Description' 
                id='description' required onChange={handleChange} value={formData.description}/>

                <input type="text" className='border p-3 rounded-lg' placeholder='Address'
                 id='address' maxLength='62' minLength='10' required onChange={handleChange} value={formData.address}/>

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="sale" className='w-5' onChange={handleChange} checked={formData.type === 'sale'}/>
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="rent" className='w-5'onChange={handleChange} checked={formData.type === 'rent'}/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={formData.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={formData.furnished}/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={formData.offer}/>
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='bedrooms'min='1' max='10' required className='p-2 border rounded-lg' onChange={handleChange} value={formData.bedrooms}/>
                        <span>Beds</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='bathrooms'min='' max='10' required className='p-2 border rounded-lg' onChange={handleChange} value={formData.bathrooms}/>
                        <span>Baths</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type="number" id='regularPrice'min='50' max='1000000' required className='p-2 border rounded-lg'  onChange={handleChange} value={formData.regularPrice} />
                        <div className='flex flex-col items-center'>
                            <span>Regular Price</span>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                  {formData.offer &&
                      <div className='flex items-center gap-2'>
                        <input type="number" id='discountedPrice'min='0' max='1000000' required className='p-2 border rounded-lg' onChange={handleChange} value={formData.discountedPrice}/>
                        <div className='flex flex-col items-center'>
                            <span>Discounted Price</span>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                      </div>
                  }
                </div>
            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images:</p>
                <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                
                <div className='flex gap-4'>
                    <input type="file" className='p-2 border border-gray-300 rounded w-full shadow-sm' onChange={(e)=>setFiles(e.target.files)} id='images' accept='image/*' multiple />
                    <button disabled={upload} type='button' onClick={handleImageSubmit} className='p-2 text-green-600 border border-green-600 rounded uppercase hover:bg-green-600 hover:text-white disabled:opacity-80'>{upload ? 'Uploading...' : 'Upload'}</button>
                </div>
                {upload && (
                    <div className="progress-container ">
                    <div className="progress-bar " style={{ width: `${progress}%` }} ></div>
                    </div>
                )}

                <p className='text-red-700 font-medium text-sm'>{imageUploadError && imageUploadError}</p>

                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url,index)=>(
                        <div key={url} className='flex justify-between p-3 border items-center'>
                            <img src={url}  alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                            <button type='button' onClick={()=>imageRemove(index)} className='p-3 text-red-700 font-medium rounded-lg uppercase hover:opacity-75'>Delete</button>
                        </div>
                    ))
                }
                <p className='text-red-700 font-medium text-sm'>{error && error}</p>

            <button disabled={loading || upload} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-3'>{loading ? 'Creating...' : 'Create listing'}</button>

            </div>
        </form>
    </main>
  )
}
