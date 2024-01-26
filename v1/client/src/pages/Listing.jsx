import { useEffect , useState } from "react"
import { useParams } from "react-router-dom";
import {Swiper , SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper'; 
import {Navigation} from 'swiper/modules';
import 'swiper/swiper-bundle.css' 
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';

export default function Listing() {
    //useing swiper for image slider
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);    
            } catch (error) {
               setError(true); 
               setLoading(false);
            }        
        }
        fetchListing();
    },[params.listingId]);


  return (
    <main>
        {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
        {error && <p className="text-center my-7 text-2xl">Something went wrong...</p>}

        {listing && !loading && !error && (
            <>
            {console.log(listing)}
                <Swiper navigation>
                    {listing.imageUrls.map((url)=>(
                        <SwiperSlide key={url}>
                            <div>
                            <img src={url} alt={listing.title} className="w-full h-96 object-cover"/>

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Creating button for copy listing page url */}
                <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                    <FaShare
                    className='text-slate-500'
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => {
                        setCopied(false);
                        }, 2000);
                    }}
                    />
                </div>
                {copied && (
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                    Link copied!
                    </p>
                )}
                {/* copy button function complete */}

                {/* Listing details */}
                <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                    <p className='text-2xl font-semibold'>
                        {listing.title} - ₹{' '}
                        {listing.offer
                            ? (+listing.regularPrice - +listing.discountedPrice).toLocaleString('hi-IN')
                            : listing.regularPrice.toLocaleString('hi-IN')}
                        {listing.type === 'rent' && ' / month '}

                        {listing.offer && (
                            <span className="text-sm flex">( Regular price: ₹{listing.regularPrice.toLocaleString('hi-IN')})</span>
                        )}
                    </p>
                    <p className='flex items-center  gap-2 text-slate-600  text-sm'>
                        <FaMapMarkerAlt className='text-green-700' />
                        {listing.address}
                    </p>
                    <div className="flex gap-4 mb-2 mt-1">
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {listing.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            discount : ₹{(listing.discountedPrice).toLocaleString('hi-IN')}
                            </p>
                        )}
                    </div>

                <ul className=" flex flex-wrap items-center gap-4 sm:gap-6 text-green-700 font-semibold text-sm">
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaBed className="text-lg "/>
                        {listing.bedrooms>1 ? `${listing.bedrooms} Bedrs` : `${listing.bedrooms} Bed`}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaBath className="text-lg "/>
                        {listing.bedrooms>1 ? `${listing.bedrooms} Bedrs` : `${listing.bedrooms} Bed`}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaParking className="text-lg "/>
                        {listing.parking ? `Parking Spot` : `No Parking`}
                    </li>
                    <li className="flex items-center gap-1 whitespace-nowrap">
                        <FaChair className="text-lg "/>
                        {listing.furnished ? `Furnished` : `Not Furnished`}
                    </li>
                </ul>
                <p className="text-slate-800">
                    <span className="font-semibold text-black ">
                         Description - {' '}
                    </span>
                    {listing.description}
                </p>
                </div>  
            </>
        )}

    </main>
  )
}
