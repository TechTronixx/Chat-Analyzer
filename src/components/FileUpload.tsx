import { useState } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { validateFile, validateWhatsAppFormat } from '@/utils/fileValidation';
import { ErrorDisplay } from './ErrorDisplay';

interface FileUploadProps {
  onFileLoaded: (messages: string) => void;
}

export const FileUpload = ({ onFileLoaded }: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop();

  const handleFile = async (file: File) => {
    setError(null);
    
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      setError(fileValidation.error!);
      return;
    }

    try {
      const text = await file.text();
      const formatValidation = validateWhatsAppFormat(text);
      
      if (!formatValidation.isValid) {
        setError(formatValidation.error!);
        return;
      }
      
      onFileLoaded(text);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (err) {
      setError('Error reading file');
      toast({
        title: "Error",
        description: "Failed to read the file",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, handleFile)}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-700'
        }`}
      >
        <Upload className={`w-12 h-12 mb-4 transition-colors duration-300 ${
          isDragging ? 'text-blue-500' : 'text-gray-400'
        }`} />
        <p className="text-lg font-medium mb-2">Drop your WhatsApp chat export here</p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="block w-full max-w-xs text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            dark:file:bg-blue-900/20 dark:file:text-blue-400"
        />
      </div>

      {error && <ErrorDisplay error={error} />}
    </motion.div>
  );
};