import { Link } from 'react-router-dom';
import { useState  , useEffect} from 'react';
import {Swiper , SwiperSlide} from 'swiper/react';
import SwiperCore  from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import Listingitem from '../components/Listingitem'; 


export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);


  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
          const res  = await fetch('/api/listing/get?offer=true&limit=4');
          const data = await res.json();
          setOfferListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchRentListings = async () => {
      try {
          const res  = await fetch('/api/listing/get?type=rent&limit=4');
          const data = await res.json();
          setRentListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    const fetchSaleListings = async () => {
      try {
          const res  = await fetch('/api/listing/get?type=sale&limit=4');
          const data = await res.json();
          setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
  },[])



  return (
    <div>
      {/* {top} */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            Find Your Dream   
              <span className='text-slate-500'>
              {' '}Home
            </span><br />
            with ease... 
        </h1>
        <div className='text-gray-400 text-xs sm:text-sm '>
          FYDH is the best place to find your next perfect place to live. 
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link to={"/search"} className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' >
          <button>Lets get started...</button>
        </Link>
      </div>
      {/* {swiper} */}
      <Swiper navigation>

        {
          offerListings && offerListings.length > 0 && offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
               <img src={listing.imageUrls[0]} alt=""  className="w-full h-96 object-cover" />
              </SwiperSlide>
          )
          )
        }
      </Swiper>
      {/* listing result for offer , Rent and Sale */}
        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
          {
            offerListings && offerListings.length > 0 && (
              <div>
                <div className='my-2'>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent Offers :</h2>
                  <Link className='text-sm text-blue-600 hover:underline' to={'/search?offer=true&'}>
                    Show more Offers...
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>

                {
                  offerListings.map((listing) => (
                    <Listingitem key={listing._id} listing={listing}></Listingitem>
                  ))
                }
                </div>
              </div>
            )
          }
          {
            rentListings && rentListings.length > 0 && (
              <div>
                <div className='my-2'>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent :</h2>
                  <Link className='text-sm text-blue-600 hover:underline' to={'/search?offer=true&'}>
                    Show more Offers...
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>

                {
                  rentListings.map((listing) => (
                    <Listingitem key={listing._id} listing={listing}></Listingitem>
                  ))
                }
                </div>
              </div>
            )
          }
          {
          saleListings && saleListings.length > 0 && (
              <div>
                <div className='my-2'>
                  <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale :</h2>
                  <Link className='text-sm text-blue-600 hover:underline' to={'/search?offer=true&'}>
                    Show more Offers...
                  </Link>
                </div>
                <div className='flex flex-wrap gap-4'>

                {
                  saleListings.map((listing) => (
                    <Listingitem key={listing._id} listing={listing}></Listingitem>
                  ))
                }
                </div>
              </div>
            )
          }

        </div>

    </div>
  )
}
