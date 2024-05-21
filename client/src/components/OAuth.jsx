import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

export default function OAuth() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClick =async()=>{
        try{

            const provider = new GoogleAuthProvider()
            const auth = new getAuth(app)

            const result = await signInWithPopup(auth,provider)

            const res = await fetch('/api/auth/google',{
               method:"POST",
               headers:{
                'Content-Type':'application/json'
               },
               body:JSON.stringify({
                username:result.user.displayName,
                email:result.user.email,
                avatar:result.user.photoURL,
               })
            })


            const data = await res.json()
            iziToast.success({
              icon: 'fas fa-check-circle',
              message: '<b>Signed in successfully!</b>',
              position: 'topRight'
            });
            dispatch(signInSuccess(data))
            navigate('/')
        }
        catch(error){
            console.log('could not sign in with google',error);
        }
    }
  return (
    <button onClick={handleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase'>Continue with google</button>
  )
}
