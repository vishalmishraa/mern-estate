import React from 'react'//eslint-disable-line
import { getAuth , GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { app } from '../firebase';
import {useNavigate} from 'react-router-dom';

export default function Oauth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async() => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);  

            const res  = await fetch('/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email , photo: result.user.photoURL})
            });
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/home');
        } catch (error) {
            console.log(error.message);
        }
    }

  return (
    <button 
        type='button' 
        onClick={handleGoogleClick}
        className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>
            Continue whith google
    </button>
  )
}
