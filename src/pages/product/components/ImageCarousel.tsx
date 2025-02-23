import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

interface ImageCarouselProps {
    images?: { url: string; alt: string }[];
    thumbnail?: string;
    selectedImage?: string | null;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images = [], thumbnail, selectedImage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const newIndex = images.findIndex((image) => image.url === selectedImage);
        if (newIndex !== -1) {
            setCurrentIndex(newIndex);
        }
    }, [selectedImage, images]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrev,
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    return (
        <div className="relative w-full max-w-2xl mx-auto overflow-hidden" {...handlers}>
            <div className="flex items-center justify-between absolute top-1/2 w-full transform -translate-y-1/2 px-4">
                <button
                    className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-700"
                    onClick={handlePrev}
                >
                    &#8592;
                </button>
                <button
                    className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-700"
                    onClick={handleNext}
                >
                    &#8594;
                </button>
            </div>
            <div className="flex justify-center">
                <img
                    src={images[currentIndex]?.url || thumbnail}
                    alt={images[currentIndex]?.alt}
                    className="w-80 h-auto md:h-96  rounded-md shadow-md"
                />
            </div>
            <div className="flex justify-center mt-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-2 mx-1 rounded-full ${currentIndex === index ? "bg-blue-500" : "bg-gray-300"}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
