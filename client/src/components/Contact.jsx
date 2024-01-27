
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({Listing}) {//eslint-disable-line
    const [landlord , setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/get/${Listing.userRef}`);//eslint-disable-line
                const data = await res.json();
                if(data.success === false){
                    return;
                }
                setLandlord(data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchLandlord();
    }, [Listing.userRef])//eslint-disable-line


    const onChange = (e) => {
        setMessage(e.target.value);
    }


  return (
    <div>
            {
                landlord && (
                    <div className="flex flex-col gap-2">
                        <p>
                            Contact {' '}
                            <span className="font-semibold">
                                    {landlord.username} 
                            </span>
                            {' '} for {' '}
                                <span className="font-semibold">
                                    {
                                        //eslint-disable-next-line
                                        Listing.title.toLowerCase()
                                    } 
                                    </span>
                                    
                        </p>
                        <textarea 
                            className="w-full border p-3 rounded-lg"
                            name="message" 
                            id="message" 
                            placeholder="Enter your message here..."
                            value={message} 
                            onChange={onChange} 
                            rows="2">
                        </textarea>
                        <Link
                             to={ `mailto:${landlord.email}?subject=Regarding ${Listing.name /* eslint-disable-line */ }&body=${message}`}
                             className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                        >
                        Send Message</Link>
                        
                    </div>
                )
            }
    </div>
  )
}
