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
  file,
  isParsing = false,
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['.pdf', '.docx', '.txt'],
  maxSizeMB = 5,
  className = ''
}) {
  const [dragActive, setDragActive] = useState(false);
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
        if (onFileSelect) onFileSelect(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        if (onFileSelect) onFileSelect(selectedFile);
      }
    }
  };

  const clearFile = () => {
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

      {isParsing ? (
        <div className="border-2 border-dashed border-brand-indigo/35 bg-brand-indigo/[0.03] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-[200px] animate-fade-in-up">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full border-4 border-brand-indigo/20 border-t-brand-indigo animate-spin" />
            <FileText className="absolute text-brand-indigo animate-pulse" size={18} />
          </div>
          <h4 className="text-white font-medium text-sm mb-1">Parsing Resume File...</h4>
          <p className="text-xs text-gray-400 max-w-xs">Extracting textual content and skills vocabulary</p>
        </div>
      ) : !file ? (
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
        /* File Selected State - Visual Document Mockup Card */
        <div className="glass-panel border-brand-indigo/25 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 animate-fade-in-up text-left">
          {/* Document Visual Mockup */}
          <div className="relative w-28 h-36 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-3 overflow-hidden flex-shrink-0 group">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-indigo/20 to-transparent pointer-events-none" />
            
            {/* Header placeholder */}
            <div className="flex gap-2 items-center mb-3">
              <div className="w-5 h-5 rounded-full bg-brand-indigo/30 border border-brand-indigo/40 flex items-center justify-center text-[8px] text-brand-indigo font-bold font-sans">
                {file.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1 flex-grow">
                <div className="h-1.5 w-12 bg-white/20 rounded" />
                <div className="h-1 w-8 bg-white/10 rounded" />
              </div>
            </div>

            {/* Content line placeholders */}
            <div className="space-y-2 mb-3">
              <div className="h-1 w-full bg-white/15 rounded" />
              <div className="h-1 w-5/6 bg-white/15 rounded" />
              <div className="h-1 w-4/5 bg-white/15 rounded" />
            </div>

            {/* Skill badge placeholders */}
            <div className="flex gap-1 flex-wrap">
              <div className="h-2 w-6 bg-brand-indigo/20 rounded border border-brand-indigo/30" />
              <div className="h-2 w-5 bg-brand-blue/20 rounded border border-brand-blue/30" />
              <div className="h-2 w-7 bg-brand-purple/20 rounded border border-brand-purple/30" />
            </div>

            {/* Success floating badge overlay */}
            <div className="absolute right-1 bottom-1 p-1 rounded-full bg-brand-emerald text-white shadow-lg">
              <CheckCircle size={10} />
            </div>
          </div>

          {/* File details */}
          <div className="flex-grow text-center md:text-left space-y-2.5 overflow-hidden w-full">
            <div>
              <p className="text-white text-base font-semibold truncate max-w-xs md:max-w-md leading-snug">
                {file.name}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-1.5">
                <span className="text-[10px] text-gray-400 font-medium bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-lg">
                  {formatBytes(file.size)}
                </span>
                <span className="text-[10px] text-brand-emerald font-semibold flex items-center gap-1">
                  <CheckCircle size={14} className="text-brand-emerald" /> 
                  Ready for analysis
                </span>
              </div>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Your resume file content has been parsed successfully. Click the analysis button below to view matching insights.
            </p>

            <div className="pt-2 flex justify-center md:justify-start">
              <Button
                variant="glass"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                icon={X}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Clear File
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
