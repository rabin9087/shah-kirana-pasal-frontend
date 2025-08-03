import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    // "https://cricket-gear-images.s3.us-east-1.amazonaws.com/1742355517336_profile_IMG_9907.jpeg",
    // "https://cricket-gear-images.s3.us-east-1.amazonaws.com/1742355517336_profile_IMG_9907.jpeg",
    // "https://cricket-gear-images.s3.us-east-1.amazonaws.com/1742355517336_profile_IMG_9907.jpeg",
    "https://atparramatta.com/sites/discoverparra/files/styles/global_image_style/public/2022-07/A09I7494_NikkiTo.jpg?itok=T_G_9yyo",
    "https://sydneyroad.com.au/wp-content/uploads/2024/04/Lunar-Mart-02.jpg",
    "https://greengoodnessco.com.au/files/wp-content/uploads/2018/08/wholefoods.jpg",
];

export default function WoolworthsStyleCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 3000, stopOnInteraction: false }),
    ]);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    const scrollPrev = React.useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = React.useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    React.useEffect(() => {
        if (emblaApi) {
            setSelectedIndex(emblaApi.selectedScrollSnap());
            emblaApi.on("select", () => setSelectedIndex(emblaApi.selectedScrollSnap()));
        }
    }, [emblaApi]);

    return (
        <div className="relative w-full max-w-6xl mx-auto bg-white shadow rounded-lg overflow-hidden">
            <div ref={emblaRef} className="overflow-hidden">
                <div className="flex ">
                    {images.map((img, index) => (
                        <div key={index} className="flex-shrink-0 w-full">
                            <img
                                src={img}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-[400px] object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Left Arrow */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Right Arrow */}
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
                <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all ${selectedIndex === i ? "bg-green-600 scale-110" : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
