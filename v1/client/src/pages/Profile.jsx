import { useRef, useState , useEffect } from 'react'
import {useSelector} from 'react-redux' 
import { getDownloadURL, getStorage , ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {    updateUserStart,
            updateUserFailure,
            updateUserSuccess , 
            deleteUserFailure,
            deleteUserStart,
            deleteUserSuccess ,
            signOutUserSuccess,
            signOutUserStart,
            signOutUserFailure
       } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';



export default function Profile() {
    const {currentUser , error , loading} = useSelector(state => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    //eslint-disable-next-line
    const [fileprec, setFileprec] = useState(0);
    //eslint-disable-next-line
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess , setUpdateSuccess] = useState(false);
    const dispatch = useDispatch();



    useEffect(() => {
            handleFileUpload(file);
        //eslint-disable-next-line
    }, [file]);

        
    /*  //FIREBASE STORAGE RULES
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

    const handleChange = async (e)=>{
        setFormData({...formData, [e.target.id]:e.target.value});
    }
  

    const handleSubmit = async (e)=>{
        console.log("submit clicked");
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id || currentUser.data._id}`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData)
            });
            const data = await res.json();  
            if(data.success==false){
                dispatch(updateUserFailure(data));
                return;
            }
            console.log(data);
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    }
    
    const handleDeleteUser = async ()=>{
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id || currentUser.data._id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                },
            });
            const data = await res.json();  
            if(data.success==false){
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignOut = async()=>{
        try {
            dispatch(signOutUserStart());
            const res = await fetch(`/api/user/signout`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                },
            });
            const data = await res.json();  
            if(data.success==false){
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(signOutUserFailure(error.message));
        }
    }

    return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 
        className="text-3xl font-semibold text-center my-7 "
       >profile</h1>
        <form action="" onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input onChange={(e)=>setFile(e.target.files[0])} type="file"  id="avatar" ref={fileRef} hidden accept="image/*"/>
            <img 
                onClick={()=> fileRef.current.click()} 
                src={ formData.avatar ||  currentUser.avatar  || currentUser.data.avatar} 
                alt="profile"  
                className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
            <p className='text-sm self-center'>
                {
                    
                    fileUploadError ? (
                        <span className='text-red-700'> Error Image Upload (Image must be less then 2 MB) </span> 
                    ): fileprec > 0 && fileprec < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${fileprec}%`}</span>
                    ): fileprec === 100 ? (
                        <span className='text-green-700'>Image Uploaded Sucessfully</span>
                    ):(
                        ''
                    )
                }
            </p>
            <input  
                type="text"
                defaultValue={formData.avatar || currentUser.username || currentUser.data.username} 
                name="" 
                id="username" 
                placeholder='username' 
                onChange={handleChange}
                className='border p-3 rounded-lg' 
            />
           
            <input 
                type="email" 
                defaultValue={formData.avatar || currentUser.email || currentUser.data.email } 
                name="" 
                id="email" 
                placeholder='email' 
                onChange={handleChange}
                className='border p-3 rounded-lg' 
            />
            
            <input type="password" 
              
                id="password"
                placeholder='password'
                onChange={handleChange}
                className='border p-3 rounded-lg' 
            />
            
            <button  
                disabled={loading} 
                className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 '
            >
                {loading ? 'Loading...' : 'Update'}
            </button>
        </form>
        <div className='text-red-700 cursor-pointer flex justify-between mt-5 '>
            <span onClick={handleDeleteUser}>Delete Account</span>
            <span  onClick={handleSignOut}>Sign Out</span>
        </div>
        <div className='flex justify-center'>
            <span className='text-red-700'>{error ? error : ''}</span>
            <span span className='text-green-700'>{updateSuccess ? 'User Updated Sucessfully' : ''}</span>
        </div>



    </div>
   
  )
}
