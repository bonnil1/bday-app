import React from 'react'
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const Birthday = ({ isLoggedIn, submitted, found, friend, deleted, click, usernames, friendaddress, getUser }) => {

    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const [map, setMap] = useState(null);
    const [isInfoWindowOpen, setIsInfoWindowOpen] = useState(false);
    const [address, setAddress] = useState(friendaddress);

    console.log(found)

    useEffect(() => {
        const fetchGeocodeData = async () => {
            if (friendaddress) {
              try {
                //console.log(friendaddress)
                const geocodeResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(friendaddress)}&key=${API_KEY}`);
                const data = await geocodeResponse.json();
                //console.log(data)
    
                if (data.status === 'OK') {
                const lat = data.results[0].geometry.location.lat;
                const lng = data.results[0].geometry.location.lng;
    
                //console.log('Latitude:', lat);
                //console.log('Longitude:', lng);
    
                setMap({
                    lat: lat,
                    lng: lng,
                });

                setAddress(friendaddress)

                } else {
                console.error('Geocode error:', data.status);
                }
              } catch (error) {
                console.error('Error fetching geocode data:', error);
              }
            }
          };
      
        fetchGeocodeData();
        
    }, [friendaddress]); 

    const toggleInfoWindow = () => {
        setIsInfoWindowOpen(prevState => !prevState);
      };

    return (
        <div>
        {isLoggedIn ? 
            <div className='flex items-center justify-center'>
            <div className='flex flex-col items-center w-full'>
                <h1 className='text-2xl sm:text-4xl font-bold mt-5 mx-auto'>Welcome to CV Girls' Birthdays!</h1>
                <div className='flex flex-col w-11/12 items-center'>
                    <div className="flex w-full">
                        {/* Get Usernames Section */}
                        {click === true ? (
                            <div className="w-1/3 sm:w-1/6" style={{ color: `${friend.color}`}}>
                                <h3 className='text-sm sm:text-lg font-semibold underline-offset-4 mt-8'>Registered Users:</h3>
                                {usernames.map((username, index) => (
                                    <li key={index} onClick={() => getUser(username)} className='list-decimal text-sm sm:text-lg hover:underline'>{username}</li>
                                ))}
                            </div>
                        ) : null}

                        {/* Submitted and Found Section */}
                        <div className='w-5/6 flex flex-col items-center ml-5 mr-5'>
                            {submitted && (
                            <>
                                {found === true ? (
                                <>
                                    <h3 className={`mt-5 text-md sm:text-lg mx-auto`} style={{ color: `${friend.color}` }}>
                                    {friend.name}'s birthday is {friend.birthday}!
                                    </h3>
                                    <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5'>
                                    <div>
                                        <img className='w-full mx-auto' src={`http://localhost:4000/${friend.photo}`} alt="Friend's photo"></img>
                                    </div>
                                    <div>
                                        <LoadScript googleMapsApiKey={API_KEY}> 
                                        {map && (
                                            <GoogleMap
                                            mapContainerStyle={{
                                                width: '100%',  
                                                height: '400px'
                                            }}
                                            center={map}
                                            zoom={15}
                                            >
                                            <Marker position={map} onClick={toggleInfoWindow}>
                                                {isInfoWindowOpen && (
                                                <InfoWindow position={map}>
                                                    <div>{address}</div>
                                                </InfoWindow>
                                                )}
                                            </Marker>
                                            </GoogleMap>    
                                        )}
                                        </LoadScript>
                                    </div>
                                    </div>
                                </>
                                ) : (
                                <h3 className='mt-5'>That is not a CV friend. 😕</h3>
                                )}
                            </>
                            )}

                            {/* Deleted User Message */}
                            {deleted && (
                            <h3 className='text-center text-red-500 mt-3'>User: {friend.username} deleted.</h3>
                            )}
                        </div>
                    </div>

                    {/*
                    <div className='mt-5 flex flex-col justify-center items-center'>
                        {submitted && (
                        <LoadScript googleMapsApiKey={API_KEY}> 
                            <GoogleMap
                                mapContainerStyle={{
                                    width: '100%',  
                                    height: '400px' 
                                  }}
                                center={map}
                                zoom={15}
                            >
                            {found && (
                                <Marker position={map} onClick={toggleInfoWindow}>
                                    {isInfoWindowOpen && (
                                    <InfoWindow position={map}>
                                        <div>{address}</div>
                                    </InfoWindow>
                                    )}
                                </Marker>
                            )}
                            </GoogleMap>    
                        </LoadScript>
                        )}
                    </div>
                    */}
                </div>
            </div>
            </div>
        : 
            <div>
            <h1 className='text-3xl sm:text-6xl font-bold text-center mt-10'>Welcome to CV Girls' Birthdays!</h1>
            <h3 className='text-xl text-center mt-32'>Sign up / Log in to view birthday information.</h3>
            </div>
        }
        </div>
    )
}

export default Birthday
