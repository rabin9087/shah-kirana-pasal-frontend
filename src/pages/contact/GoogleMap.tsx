import { APIProvider, Map } from '@vis.gl/react-google-maps';
const GOOGLE_API_KEY = import.meta.env.GOOGLE_API

export const GoogleMap = () => (
    <APIProvider apiKey={GOOGLE_API_KEY}>
        <Map
            style={{ width: '100vw', height: '100vh' }}
            defaultCenter={{ lat: 22.54992, lng: 0 }}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
        />
    </APIProvider>
);


