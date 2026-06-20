import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';

/**
 * Premium UploadZone component for drag-and-drop resume uploading.
 *
 * @param {Object} props
 * @param {Function} props.onFileSelect - Callback when file is successfully uploaded/dropped
 * @param {Function} props.onFileRemove - Callback when file is cleared
 * @param {Array<string>} [props.acceptedTypes=['.pdf', '.docx', '.txt']] - Accepted file extension list
 * @param {number} [props.maxSizeMB=5] - Maximum allowed file size in Megabytes
 */
export default function UploadZone({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['.pdf', '.docx', '.txt'],
  maxSizeMB = 5,
  className = ''
}) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;

    // Validate size
    const sizeLimit = maxSizeMB * 1024 * 1024;
    if (selectedFile.size > sizeLimit) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }

    // Validate extension
    const fileName = selectedFile.name.toLowerCase();
    const isAccepted = acceptedTypes.some(type => fileName.endsWith(type));
    if (!isAccepted) {
      setError(`Unsupported format. Please upload ${acceptedTypes.join(', ')}.`);
      return false;
    }

    setError('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        if (onFileSelect) onFileSelect(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        if (onFileSelect) onFileSelect(selectedFile);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
    if (onFileRemove) onFileRemove();
  };

  const triggerInput = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.join(',')}
        onChange={handleChange}
      />

      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerInput}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
            dragActive
              ? 'border-brand-indigo bg-brand-indigo/5 shadow-lg shadow-brand-indigo/10'
              : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
          }`}
        >
          {/* Animated Glow in drag active state */}
          {dragActive && (
            <div className="absolute inset-0 bg-brand-indigo/5 animate-pulse pointer-events-none" />
          )}

          {/* SVG Animated Upload Icon */}
          <div className={`p-4 rounded-full mb-4 bg-white/5 border border-white/10 transition-transform duration-300 ${
            dragActive ? 'scale-110 text-brand-indigo' : 'group-hover:scale-105 group-hover:text-brand-indigo text-gray-400'
          }`}>
            <UploadCloud size={32} />
          </div>

          <h4 className="text-white font-heading font-medium text-base mb-1.5">
            Drag and drop your resume here
          </h4>
          
          <p className="text-xs text-gray-400 max-w-sm mb-4 leading-relaxed">
            or <span className="text-brand-indigo font-semibold group-hover:underline">browse files</span> from your computer
          </p>

          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {acceptedTypes.map((type) => (
              <span
                key={type}
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-400"
              >
                {type.replace('.', '')}
              </span>
            ))}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 border border-red-500/20 px-3.5 py-1.5 rounded-lg animate-bounce">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>
      ) : (
        /* File Selected State */
        <div className="glass-panel border-brand-indigo/30 rounded-2xl p-5 flex items-center justify-between animate-fade-in-up">
          <div className="flex items-center gap-3.5 overflow-hidden">
            <div className="p-3 rounded-xl bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo">
              <FileText size={24} />
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-white text-sm font-semibold truncate max-w-md">{file.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-gray-400 font-medium">{formatBytes(file.size)}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <span className="text-[10px] text-brand-emerald font-semibold flex items-center gap-0.5">
                  <CheckCircle size={10} /> Ready for analysis
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
            icon={X}
            className="p-2 border border-white/5 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
