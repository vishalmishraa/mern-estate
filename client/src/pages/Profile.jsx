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
            signOutUserFailure,
       } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';



export default function Profile() {
    const {currentUser , error , loading} = useSelector(state => state.user);
    const fileRef = useRef(null);
    const [file, setFile] = useState({
        name:''
    });
    //eslint-disable-next-line
    const [fileprec, setFileprec] = useState(0);
    //eslint-disable-next-line
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess , setUpdateSuccess] = useState(false);
    const [showListingsError , setShowListingsError] = useState(false);
    const [userListings , setUserListings] = useState({});    
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
        if(file.name !== ''){
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
        );

        }

    }

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

    const showListings = async()=>{
        try {
            setShowListingsError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id || currentUser.data._id}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json'
                },
            });
            const data = await res.json();  
            if(data.success==false){
                setShowListingsError(true);
                return;
            }
            console.log(data);
            setUserListings(data);
            setShowListingsError(false);
            
        } catch (error) {
            setShowListingsError(true);
        }
    }

    const handleListingDelete = async(id)=>{
        try {
            const res = await fetch(`/api/listing/delete/${id}`,{
                method:'DELETE',
                headers:{
                    'Content-Type':'application/json'
                },
            });
            const data = await res.json();
            if(data.success==false){
                console.log(data.message);
                return;
            }
            setUserListings(userListings.filter((listing)=> listing._id !== id));
        } catch (error) {
            console.log(error.message);
        }
    }


    return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 
        className="text-3xl font-semibold text-center my-7 "
       >Your Profile</h1>
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
                disabled
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

           <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={'/create-listing'}>
                Create Listing
           </Link>
        </form>
        {
                updateSuccess && (
                    <span className='text-green-700 pt-3 mb-0 pb-0 flex justify-center'>Profile Updated Successfully</span>  
                )

            }

            {
                error && (
                    <span className='text-red-700 flex justify-center'>{error ? error : ''}</span>
                )
            }
        <div className='text-red-700 cursor-pointer flex justify-between mt-5 '>
            <span onClick={handleDeleteUser}>Delete Account</span>
            <span  onClick={handleSignOut}>Sign Out</span>
        </div>

        <button onClick={showListings} className='text-green-700 w-full p-2  rounded-lg uppercase'>Show Listings</button>
            <p>
                {
                    showListingsError && (
                        <span className='text-red-700 mt-5'>Error Showing Listings</span>
                    )
                }
            </p>
     
                {   userListings && 
                    userListings.length > 0 &&

                    <div className='flex flex-col gap-4'>
                        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>

                    {    userListings.map((listing)=>(
                            <div key={listing._id} 
                                className="border rounded-lg p-3 flex justify-between items-center  gap-4"    
                            >
                                <Link to={`/listing/${listing._id}`}>
                                    <img src={listing.imageUrls[0]} 
                                        className="h-16 w-16 object-contain "
                                    alt="" />
                                </Link>
                                <Link 
                                    className='"text-slate-700 font-semibold flex-1 truncate'
                                    to={`/listing/${listing._id}`}>
                                    <p >
                                    {listing.title}
                                    </p>
                                </Link>
    
                                <div className='flex flex-col item-center'>
                                    <button onClick = {()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                                    <Link to={`/update-listing/${listing._id}`}>
                                    <button className='text-green-700 uppercase'>Edit</button>
                                    </Link>
                                </div>
                            </div>
                        )) }

                    </div>
                    
                }
        
    </div>
   
  )
}
