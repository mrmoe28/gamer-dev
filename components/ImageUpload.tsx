'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { FaUpload, FaTimes, FaImage, FaSpinner } from 'react-icons/fa';

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export default function ImageUpload({ 
  onImagesChange, 
  maxImages = 10,
  existingImages = []
}: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    const remainingSlots = maxImages - images.length;
    
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    // Validate file types
    const validFiles = filesToUpload.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== filesToUpload.length) {
      setError('Some files were skipped. Only JPEG, PNG, and WebP are allowed.');
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);

    // Upload files one by one to show progress
    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      try {
        // Show progress for this file
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);

        // Update progress to 100%
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      } catch (error) {
        console.error('Upload error:', error);
        setError(`Failed to upload ${file.name}`);
      }
    }

    // Update images state
    const newImages = [...images, ...uploadedUrls];
    setImages(newImages);
    onImagesChange(newImages);

    // Clear progress after a short delay
    setTimeout(() => {
      setUploadProgress({});
    }, 1000);

    setIsUploading(false);
  }, [images, maxImages, onImagesChange]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={openFileDialog}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isUploading
            ? 'border-gray-400 bg-gray-50 cursor-not-allowed'
            : 'border-purple-300 hover:border-purple-400 hover:bg-purple-50/5'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          aria-label="Upload images"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <FaSpinner className="text-4xl text-purple-500 animate-spin" />
          ) : (
            <FaUpload className="text-4xl text-purple-500" />
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isUploading ? 'Uploading...' : 'Drop images here or click to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPEG, PNG, or WebP • Max 5MB per image • Up to {maxImages} images
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="bg-gray-100 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{filename}</span>
                <span className="text-gray-600">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Screenshot ${index + 1}`}
                  width={300}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <FaTimes className="text-sm" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1} / {maxImages}
              </div>
            </div>
          ))}
          
          {/* Add more images button */}
          {images.length < maxImages && (
            <div
              onClick={openFileDialog}
              className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300"
            >
              <div className="text-center">
                <FaImage className="text-3xl text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Add More</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image count */}
      <p className="text-sm text-gray-600 text-right">
        {images.length} / {maxImages} images uploaded
      </p>
    </div>
  );
}