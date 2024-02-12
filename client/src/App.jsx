import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute, { UserLogedIn } from './components/PrivateRoute'
import {
  Home,
  SignIn,
  About,
  Profile,
  SignUp,
  Header,
  UserLogedIn,
  CreateListing,
  UpdateListing,
  Listing,
  Search
} from './pages/index.js';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/home' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />

        <Route element={<UserLogedIn />}>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Route>


        <Route element={<PrivateRoute></PrivateRoute>} >
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />}></Route>
          <Route path='/update-listing/:listingId' element={<UpdateListing />}></Route>
        </Route>


      </Routes>
    </BrowserRouter>
  )
}
