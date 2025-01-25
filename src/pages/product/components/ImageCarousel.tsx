import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";

interface ImageCarouselProps {
    images?: { url: string; alt: string }[] | undefined;
    thumbnail?: string
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images = [], thumbnail }) => {

    // if (images.length === 0 || images.map(({url}) => (url === ""))) {
    //     return <div>No images to display</div>;
    // }

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrev,
        preventScrollOnSwipe: true,
        trackMouse: true, // Allow swiping with mouse
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
            {(images.length !== 0 && images.map(({ url }) => (url !== ""))) && <div className="flex justify-center">
                <img
                    src={images[currentIndex]?.url}
                    alt={images[currentIndex]?.alt}
                    className="w-full h-auto rounded-md shadow-md"
                />
            </div>}
            {(images.length !== 0 || images.map(({ url }) => (url !== ""))) && <div className="flex justify-center">
                {
                    images.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 w-2 mx-1 rounded-full my-2 ${currentIndex === index ? "bg-blue-500" : "bg-gray-300"
                                }`}
                        ></div>
                    ))
                }
            </div>}
            {(images.length === 0 || images.length === 1 && images.map(({ url }) => (url === "")) && thumbnail !== "") && <div>
                { <img
                    src={thumbnail}
                    alt={thumbnail}
                    className="w-full h-auto rounded-md shadow-md"
                />
                }
            </div>}
        </div>
    );
};

export default ImageCarousel;
