import { useState, useEffect } from "react";

const LocationComponent = ({ setLocation }: { setLocation: (location: { lat: number; lng: number }) => void }) => {
  
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const hasAsked = localStorage.getItem("locationPermission");

        if (hasAsked === "granted") {
            getLocation();
        } else if (hasAsked !== "denied") {
            const userConsent = window.confirm("This site wants to access your location. Allow?");
            if (userConsent) {
                localStorage.setItem("locationPermission", "granted");
                getLocation();
            } else {
                localStorage.setItem("locationPermission", "denied");
                setError("Location access denied by the user.");
            }
        }
    }, []);

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setError(null);
                },
                (error) => {
                    setError(error.message);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="p-4">
            {location ? (
                <></>
            ) : (
                <p className="text-gray-500">Waiting for location...</p>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default LocationComponent;
