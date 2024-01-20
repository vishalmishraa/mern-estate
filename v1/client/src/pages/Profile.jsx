import { useRef, useState , useEffect } from 'react'
import {useSelector} from 'react-redux' 
import { getDownloadURL, getStorage , ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';



export default function Profile() {
    const {currentUser} = useSelector(state => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    //eslint-disable-next-line
    const [fileprec, setFileprec] = useState(0);
    //eslint-disable-next-line
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});



    console.log(file);
    useEffect(() => {
        if(file){
            handleFileUpload(file);
        }
        //eslint-disable-next-line
    }, [file]);

    const handleFileUpload = async (file) => {
        const storage = getStorage(app);
        const fileName =new Date().getTime + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);//it is used to upload file to firebase storage 
        uploadTask.on('state_changed', (snapshot) => {
            // Observe state )change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            setFileprec(Math.round(progress));
            
        },
        //eslint-disable-next-line
        (error)=>{
            setFileUploadError(true);
        },
        ()=>{
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setFormData({...formData, avatar:downloadURL});
            });
        }
    )}

    /*
        //FIREBASE STORAGE RULES
        // These rules grant access to a file in your Cloud Storage bucket
        // For more on Cloud Storage
        // https://firebase.google.com/docs/storage/security
        rules_version = '2';

        // Craft rules based on data in your Firestore database
        // allow write: if firestore.get(
        //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
        service firebase.storage {
            match /b/{bucket}/o {
                match /{allPaths=**} {
                    allow read;
                    allow write: if 
      						        request.resource.size < 2 * 1024 * 1024 &&
                                    request.resource.contentType.matches('image/.*')
                }
            }
        }
    
    */

    return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 
        className="text-3xl font-semibold text-center my-7 "
       >profile</h1>
        <form action="" className='flex flex-col gap-4'>
            <input onChange={(e)=>setFile(e.target.files[0])} type="file" name="" id="" ref={fileRef} hidden accept="image/*"/>
            <img onClick={()=> fileRef.current.click()} src={ currentUser.avatar } alt="profile"  className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
            <input  type="text" name="" id="username" placeholder='username' className='border p-3 rounded-lg' />
            <input type="email" name="" id="email" placeholder='email' className='border p-3 rounded-lg' />
            <input type="text" name="" id="password" placeholder='password' className='border p-3 rounded-lg' />
            <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 '>upate</button>
        </form>
        <div className='text-red-700 cursor-pointer flex justify-between mt-5 '>
            <span>Delete Account</span>
            <span>Sign Out</span>
        </div>


    </div>
   
  )
}
