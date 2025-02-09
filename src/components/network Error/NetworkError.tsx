import React from "react";

interface NetworkErrorProps {
    message?: string;
    onRetry?: () => void;
}

const NetworkError: React.FC<NetworkErrorProps> = ({ message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-2xl font-semibold text-red-500">Oops! Something went wrong.</h2>
            <p className="text-gray-600 mt-2">{message || "Please check your network connection and try again."}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Retry
                </button>
            )}
        </div>
    );
};

export default NetworkError;
