import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ImageAsset } from '../types';

interface ImageUploaderProps {
  label: string;
  subLabel: string;
  image: ImageAsset | null;
  onImageChange: (image: ImageAsset | null) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  subLabel,
  image,
  onImageChange,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64 = result.split(',')[1];
      
      onImageChange({
        file,
        previewUrl: result,
        base64
      });
    };
    reader.readAsDataURL(file);
  };

  // Camera Functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      setCameraError(null);
    } catch (err) {
      console.error("Camera access denied:", err);
      setCameraError("Camera access denied. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        
        // Create a file object from data URL
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
            onImageChange({
              file,
              previewUrl: dataUrl,
              base64
            });
            stopCamera();
          });
      }
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled]); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
  };

  return (
    <div className="flex flex-col w-full group">
      <div className="flex justify-between items-baseline mb-1.5">
        <h3 className="text-xs font-semibold text-gray-400">{label}</h3>
        {image && <span className="text-[10px] text-green-400 font-medium">Uploaded</span>}
      </div>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative w-full h-32 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/5' : 'cursor-pointer'}
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
            : image && !isCameraOpen
              ? 'border-white/10 bg-black/40' 
              : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
          }
        `}
      >
        {isCameraOpen ? (
          <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
             <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
             <canvas ref={canvasRef} className="hidden" />
             
             <div className="absolute bottom-2 flex gap-2 z-20">
               <button 
                 onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                 className="px-3 py-1 bg-red-500/80 rounded-full text-white text-[10px] font-bold backdrop-blur"
               >
                 Cancel
               </button>
               <button 
                 onClick={(e) => { e.stopPropagation(); capturePhoto(); }}
                 className="px-4 py-1 bg-white text-black rounded-full text-[10px] font-bold shadow-lg"
               >
                 Capture
               </button>
             </div>
          </div>
        ) : image ? (
          <div className="relative w-full h-full group/image">
            <img 
              src={image.previewUrl} 
              alt="Uploaded" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-colors duration-300 flex items-center justify-center">
               {!disabled && (
                <div className="opacity-0 group-hover/image:opacity-100 transform translate-y-2 group-hover/image:translate-y-0 transition-all duration-300 flex gap-2">
                    <button
                        onClick={handleRemove}
                        className="bg-red-500/90 hover:bg-red-600 text-white p-1.5 rounded-full backdrop-blur-sm shadow-lg border border-white/10"
                        title="Remove"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                    <label className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-full backdrop-blur-sm shadow-lg border border-white/10 cursor-pointer inline-flex" title="Replace">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleInputChange}
                            disabled={disabled}
                        />
                    </label>
                </div>
               )}
            </div>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center w-full h-full px-4 text-center group/label gap-6">
               {/* Upload Button */}
               <label className="flex flex-col items-center cursor-pointer group-hover/label:scale-105 transition-transform">
                 <input 
                   type="file" 
                   className="hidden" 
                   accept="image/*"
                   onChange={handleInputChange}
                   disabled={disabled}
                 />
                 <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-1 shadow-inner hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                   </svg>
                 </div>
                 <span className="text-[10px] text-gray-400 font-medium">Upload</span>
               </label>
               
               <div className="w-[1px] bg-white/10 h-8 self-center"></div>
               
               {/* Camera Button */}
               <button 
                  onClick={(e) => { e.stopPropagation(); startCamera(); }}
                  disabled={disabled}
                  className="flex flex-col items-center hover:scale-105 transition-transform"
               >
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-1 shadow-inner hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">Camera</span>
               </button>
            {cameraError && <div className="absolute -bottom-4 left-0 w-full text-center text-red-400 text-[9px]">{cameraError}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;