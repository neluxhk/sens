// src/hooks/useFormChanges.ts
import { useState, useRef, useEffect } from 'react';

export const useFormChanges = (formData: any) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const previousDataRef = useRef<any>();
  
  useEffect(() => {
    if (previousDataRef.current && 
        JSON.stringify(previousDataRef.current) !== JSON.stringify(formData)) {
      setHasUnsavedChanges(true);
    }
    previousDataRef.current = formData;
  }, [formData]);
  
  const resetChanges = () => setHasUnsavedChanges(false);
  
  return { hasUnsavedChanges, resetChanges };
};