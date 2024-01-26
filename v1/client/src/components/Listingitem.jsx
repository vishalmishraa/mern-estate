
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {/*eslint-disable-line*/
  return (
    <div className=' bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] '>
      <Link to={`/listing/${listing._id}`/*eslint-disable-line*/}>
        <img
          src={
            listing.imageUrls[0] ||/*eslint-disable-line*/
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt='listing cover'
          className='h-[320px]  sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
        />
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='truncate text-lg font-semibold text-slate-700'>
            {listing.title /*eslint-disable-line*/}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn className='h-4 w-4 text-green-700' />
            <p className='text-sm text-gray-600 truncate w-full'>
              {listing.address /*eslint-disable-line*/}
            </p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-2'>
            {listing.description /*eslint-disable-line*/}
          </p>
          <p className='text-slate-500 mt-2 font-semibold flex items-center'>
            ₹{ /*eslint-disable-line*/ listing.offer ? (+listing.regularPrice - +listing.discountedPrice).toLocaleString('hi-IN') : listing.regularPrice.toLocaleString('hi-IN')}

            {
             listing.type === 'rent' ? ' / month' : ''/*eslint-disable-line*/
            }
            {listing.offer && (/*eslint-disable-line*/
                <span className="text-xs text-red-900 flex">( Regular price: ₹{ /*eslint-disable-line*/ listing.regularPrice.toLocaleString('hi-IN')})</span>
            )}
        </p>
          <div className='text-slate-700 flex gap-4'>
            <div className='font-bold text-xs'>
              {listing.bedrooms > 1/*eslint-disable-line*/
                ? `${listing.bedrooms /*eslint-disable-line*/} beds `
                : `${listing.bedrooms} bed ` /*eslint-disable-line*/}
            </div>
            <div className='font-bold text-xs'>
              {listing.bathrooms > 1/*eslint-disable-line*/
                ? `${listing.bathrooms/*eslint-disable-line*/} baths `
                : `${listing.bathrooms/*eslint-disable-line*/} bath `}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
