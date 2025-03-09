import { useState, useEffect } from "react";

const EverytiimeLocationComponent = () => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const hasAsked = localStorage.getItem("locationPermission");

        if (hasAsked === "granted") {
            watchLocation();
        } else if (hasAsked !== "denied") {
            const userConsent = window.confirm("This site wants to access your location. Allow?");
            if (userConsent) {
                localStorage.setItem("locationPermission", "granted");
                watchLocation();
            } else {
                localStorage.setItem("locationPermission", "denied");
                setError("Location access denied by the user.");
            }
        }

        return () => {
            if (navigator.geolocation) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, []);

    let watchId: number;

    const watchLocation = () => {
        if ("geolocation" in navigator) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setError(null);
                },
                (error) => {
                    setError(error.message);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 1000 }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="p-4">
            {location ? (
                <p className="mt-2">
                    📍 Latitude: {location.lat}, Longitude: {location.lng}
                </p>
            ) : (
                <p className="text-gray-500">Waiting for location...</p>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default EverytiimeLocationComponent;
