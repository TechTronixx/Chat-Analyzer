import { toast } from "@/components/ui/use-toast";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateFile = (file: File | null): ValidationResult => {
  if (!file) {
    toast({
      title: "Error",
      description: "No file selected",
      variant: "destructive"
    });
    return { isValid: false, error: 'Please select a file' };
  }

  if (!file.name.endsWith('.txt')) {
    toast({
      title: "Invalid file type",
      description: "Please upload a WhatsApp chat export (.txt file)",
      variant: "destructive"
    });
    return { isValid: false, error: 'Please upload a .txt file' };
  }

  if (file.size > 5 * 1024 * 1024) {
    toast({
      title: "File too large",
      description: "Please upload a file smaller than 5MB",
      variant: "destructive"
    });
    return { isValid: false, error: 'File size should be less than 5MB' };
  }

  return { isValid: true };
};

export const validateWhatsAppFormat = (text: string): ValidationResult => {
  // Check for common WhatsApp chat patterns
  const messagePattern = /\[\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\]\s+[^:]+:/i;
  const alternativePattern = /\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\s+-\s+[^:]+:/i;

  const lines = text.split('\n').filter(line => line.trim());
  
  // Check first few lines for WhatsApp patterns
  const sampleSize = Math.min(5, lines.length);
  let validLines = 0;

  for (let i = 0; i < sampleSize; i++) {
    if (messagePattern.test(lines[i]) || alternativePattern.test(lines[i])) {
      validLines++;
    }
  }

  // If at least 60% of the sample lines match the pattern, consider it valid
  if (validLines / sampleSize >= 0.6) {
    return { isValid: true };
  }

  toast({
    title: "Invalid format",
    description: "The file doesn't appear to be a WhatsApp chat export. Please make sure you're uploading an exported WhatsApp chat file.",
    variant: "destructive"
  });
  
  return { 
    isValid: false, 
    error: 'The file format doesn\'t match a WhatsApp chat export. Please ensure you\'re uploading a valid WhatsApp chat export file.' 
  };
};