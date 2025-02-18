import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1); // Navigate to the previous page
    const goHome = () => navigate('/'); // Navigate to the home page

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
                Oops! The page you're looking for doesn't exist.
            </p>
            <div className="space-x-4">
                <button
                    onClick={goBack}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go Back
                </button>
                <button
                    onClick={goHome}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Home Page
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
