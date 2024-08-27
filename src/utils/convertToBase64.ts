 export const convertToBase64 = (image: Blob, setImage: (image: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        return reader.readAsDataURL(image);
    };