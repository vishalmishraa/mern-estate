import {useSelector} from 'react-redux' 

export default function Profile() {
    const {currentUser} = useSelector(state => state.user)

    return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 
        className="text-3xl font-semibold text-center my-7 "
       >profile</h1>
        <form action="" className='flex flex-col gap-4'>
            <img src={ currentUser.avatar } alt="profile"  className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
            <input type="text" name="" id="username" placeholder='username' className='border p-3 rounded-lg' />
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
