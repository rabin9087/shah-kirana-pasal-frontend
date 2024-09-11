 export const convertToBase64 = (image: Blob, setImage: (image: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        return reader.readAsDataURL(image);
 };
    
 export const base64ToFile = (base64: string, fileName: string): File => {
        const [header, data] = base64.split(',');
        const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';

        // Decode base64 string
        const byteString = atob(data);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: mime });
        return new File([blob], fileName, { type: mime });
    };