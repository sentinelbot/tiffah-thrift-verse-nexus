
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export function useAccessControl() {
  // Track access attempts with timestamps
  const [accessAttempts, setAccessAttempts] = useState<number[]>([]);
  const animatingRef = useRef(false);
  
  // Process an access attempt
  const processAccessAttempt = (accessType: string) => {
    // Get current time
    const now = Date.now();
    
    // Filter only recent attempts (within last 3 seconds)
    const recentAttempts = accessAttempts.filter(time => now - time < 3000);
    
    // Add current attempt
    const newAttempts = [...recentAttempts, now];
    
    // Update attempts
    setAccessAttempts(newAttempts);
    
    // Security measures:
    // 1. Must have exactly 5 attempts
    // 2. All attempts must be within 3 seconds
    // 3. Each attempt must be at least 100ms apart (not automated)
    // 4. Not currently animating
    if (
      newAttempts.length === 5 && 
      (newAttempts[4] - newAttempts[0] < 3000) && 
      newAttempts.every((time, i) => i === 0 || (time - newAttempts[i-1] > 100)) &&
      !animatingRef.current
    ) {
      // Reset attempts
      setAccessAttempts([]);
      return true;
    }
    
    return false;
  };
  
  // Trigger access animation
  const triggerAccessAnimation = (element: HTMLElement | null, onComplete: () => void) => {
    if (!element || animatingRef.current) return;
    
    animatingRef.current = true;
    
    // Simple animation sequence without GSAP
    if (element) {
      // Start animation
      element.style.transition = 'all 0.3s ease-out';
      element.style.color = '#ec4899';
      element.style.textShadow = '0 0 15px rgba(236, 72, 153, 0.7)';
      
      setTimeout(() => {
        // Rotate animation
        element.style.transition = 'all 0.6s ease-in-out';
        element.style.transform = 'rotate(360deg)';
        
        setTimeout(() => {
          // Return to normal
          element.style.transition = 'all 0.3s ease-in';
          element.style.color = '#a3a3a3';
          element.style.textShadow = 'none';
          
          setTimeout(() => {
            // Reset transform
            element.style.transform = 'rotate(0deg)';
            animatingRef.current = false;
            onComplete();
          }, 300);
        }, 600);
      }, 300);
    }
  };
  
  return { processAccessAttempt, triggerAccessAnimation };
}
