 export const convertToBase64 = (image: Blob, setImage: (image: string) => void) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        return reader.readAsDataURL(image);
 };
    
 export const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
 };

 import imageCompression from 'browser-image-compression';

export const compressImage = async(base64String: string, fileName: string): Promise<File>  =>  {
  // Convert base64 to Blob
  const res = await fetch(base64String);
  const blob = await res.blob();
  const originalFile = new File([blob], fileName, { type: blob.type });

  // Compress image
  const options = {
    maxSizeMB: 0.5, // Target < 500KB
    maxWidthOrHeight: 800, // Resize if needed
    useWebWorker: true,
  };
  return await imageCompression(originalFile, options);
}

