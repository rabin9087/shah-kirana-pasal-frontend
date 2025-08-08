import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-toastify';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';

// Table options for image upload
const TABLE_OPTIONS = [
    { value: 'products', label: 'Products' },
    { value: 'categories', label: 'Categories' },
    { value: 'brands', label: 'Brands' },
    { value: 'users', label: 'Users' },
    { value: 'banners', label: 'Banners' },
    { value: 'combo-offers', label: 'Combo Offers' },
    { value: 'blog-posts', label: 'Blog Posts' },
    { value: 'gallery', label: 'Gallery' },
];

interface ImageUploadProps {
    onImageUploaded?: (imageUrl: string, tableName: string) => void;
    maxSizeMB?: number;
    acceptedFormats?: string[];
    defaultTable?: string;
    multiple?: boolean;
}

interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    optimizedBlob?: Blob;
    uploadProgress: number;
    status: 'pending' | 'optimizing' | 'uploading' | 'completed' | 'error';
    url?: string;
    error?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageUploaded,
    maxSizeMB = 5,
    acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
    defaultTable = 'products',
    multiple = false
}) => {
    const [selectedTable, setSelectedTable] = useState(defaultTable);
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Image optimization function
    const optimizeImage = useCallback(async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate optimal dimensions (max 1200px width/height)
                const maxDimension = 1200;
                let { width, height } = img;

                if (width > height) {
                    if (width > maxDimension) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    }
                } else {
                    if (height > maxDimension) {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to optimize image'));
                        }
                    },
                    'image/webp', // Convert to WebP for better compression
                    0.8 // 80% quality
                );
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }, []);

    // Simulate upload to server (replace with your actual upload logic)
    const uploadToServer = useCallback(async (blob: Blob, tableName: string, fileName: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            // Simulate upload progress
            const formData = new FormData();
            formData.append('image', blob, fileName);
            formData.append('table', tableName);

            // Replace this with your actual upload API call
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    const mockUrl = `https://example.com/images/${tableName}/${Date.now()}-${fileName}`;
                    resolve(mockUrl);
                } else {
                    reject(new Error('Upload failed'));
                }
            }, 2000);
        });
    }, []);

    // Process uploaded files
    const processFiles = useCallback(async (files: FileList) => {
        const fileArray = Array.from(files);

        // Validate files
        const validFiles = fileArray.filter(file => {
            if (!acceptedFormats.includes(file.type)) {
                toast.error(`${file.name}: Invalid format. Accepted: ${acceptedFormats.join(', ')}`);
                return false;
            }
            if (file.size > maxSizeMB * 1024 * 1024) {
                toast.error(`${file.name}: File too large. Max size: ${maxSizeMB}MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Create image objects
        const newImages: UploadedImage[] = validFiles.map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            uploadProgress: 0,
            status: 'pending'
        }));

        setImages(prev => [...prev, ...newImages]);

        // Process each image
        for (const imageData of newImages) {
            try {
                // Update status to optimizing
                setImages(prev => prev.map(img =>
                    img.id === imageData.id ? { ...img, status: 'optimizing' } : img
                ));

                // Optimize image
                const optimizedBlob = await optimizeImage(imageData.file);

                setImages(prev => prev.map(img =>
                    img.id === imageData.id ? { ...img, optimizedBlob, status: 'uploading' } : img
                ));

                // Upload to server
                const uploadedUrl = await uploadToServer(optimizedBlob, selectedTable, imageData.file.name);

                setImages(prev => prev.map(img =>
                    img.id === imageData.id ? {
                        ...img,
                        url: uploadedUrl,
                        status: 'completed',
                        uploadProgress: 100
                    } : img
                ));

                // Callback
                onImageUploaded?.(uploadedUrl, selectedTable);
                toast.success(`${imageData.file.name} uploaded successfully!`);

            } catch (error) {
                setImages(prev => prev.map(img =>
                    img.id === imageData.id ? {
                        ...img,
                        status: 'error',
                        error: error instanceof Error ? error.message : 'Upload failed'
                    } : img
                ));
                toast.error(`Failed to upload ${imageData.file.name}`);
            }
        }
    }, [acceptedFormats, maxSizeMB, selectedTable, optimizeImage, uploadToServer, onImageUploaded]);

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            processFiles(files);
        }
        e.target.value = ''; // Reset input
    };

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files) {
            processFiles(files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    // Remove image
    const removeImage = (id: string) => {
        setImages(prev => {
            const updated = prev.filter(img => img.id !== id);
            // Cleanup preview URLs
            const imageToRemove = prev.find(img => img.id === id);
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            return updated;
        });
    };

    // Clear all images
    const clearAll = () => {
        images.forEach(img => URL.revokeObjectURL(img.preview));
        setImages([]);
    };

    // Get file size in readable format
    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Table Selection */}
            <div>
                <Label htmlFor="table-select">Upload to Table</Label>
                <Select value={selectedTable} onValueChange={setSelectedTable}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                        {TABLE_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Upload Zone */}
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <div className="flex flex-col items-center space-y-4">
                    <Upload className="w-12 h-12 text-gray-400" />
                    <div>
                        <p className="text-lg font-medium">Drop images here or click to browse</p>
                        <p className="text-sm text-gray-500">
                            Supports: {acceptedFormats.map(format => format.split('/')[1]).join(', ')} • Max {maxSizeMB}MB
                        </p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                    >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Choose Images
                    </Button>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    accept={acceptedFormats.join(',')}
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Images ({images.length})</h3>
                        <Button variant="outline" size="sm" onClick={clearAll}>
                            Clear All
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {images.map(image => (
                            <div key={image.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-start space-x-4">
                                    {/* Image Preview */}
                                    <div className="relative">
                                        <img
                                            src={image.preview}
                                            alt={image.file.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => removeImage(image.id)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Image Info */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-sm">{image.file.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatFileSize(image.file.size)} • {selectedTable}
                                                </p>
                                            </div>

                                            {/* Status Icon */}
                                            <div className="flex items-center space-x-1">
                                                {image.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                {image.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                                                {['pending', 'optimizing', 'uploading'].includes(image.status) && (
                                                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        {['optimizing', 'uploading'].includes(image.status) && (
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-xs">
                                                    <span className="capitalize">{image.status}...</span>
                                                    <span>{image.uploadProgress}%</span>
                                                </div>
                                                <Progress value={image.uploadProgress} className="h-2" />
                                            </div>
                                        )}

                                        {/* URL for completed uploads */}
                                        {image.status === 'completed' && image.url && (
                                            <div className="p-2 bg-green-50 rounded border">
                                                <p className="text-xs text-green-700 font-mono break-all">{image.url}</p>
                                            </div>
                                        )}

                                        {/* Error message */}
                                        {image.status === 'error' && image.error && (
                                            <div className="p-2 bg-red-50 rounded border">
                                                <p className="text-xs text-red-700">{image.error}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;