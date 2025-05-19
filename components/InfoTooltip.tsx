"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslation } from '@/app/i18n/translations';
import type { Language } from '@/types/map';

interface InfoTooltipProps {
  info?: {
    pl: string;
    en: string;
  };
  language: Language;
  isVisible: boolean;
  onToggleVisibility: (visible: boolean) => void;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  info, 
  language, 
  isVisible, 
  onToggleVisibility 
}) => {
  // Position tooltip in the bottom right corner by default
  const [position, setPosition] = useState({ x: 20, y: 20 });
  
  // Adjust position when container size changes
  useEffect(() => {
    if (tooltipRef.current && tooltipRef.current.parentElement) {
      const updatePosition = () => {
        const parentRect = tooltipRef.current?.parentElement?.getBoundingClientRect();
        const tooltipRect = tooltipRef.current?.getBoundingClientRect();
        
        if (parentRect && tooltipRect) {
          // Make sure tooltip is fully visible
          const maxX = parentRect.width - tooltipRect.width;
          const maxY = parentRect.height - tooltipRect.height;
          
          setPosition(prev => ({
            x: Math.max(0, Math.min(maxX, prev.x)),
            y: Math.max(0, Math.min(maxY, prev.y))
          }));
        }
      };
      
      // Update position on resize
      window.addEventListener('resize', updatePosition);
      // Initial position update
      updatePosition();
      
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isVisible]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tooltipRef.current) {
      e.preventDefault();
      const rect = tooltipRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (tooltipRef.current && e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = tooltipRef.current.getBoundingClientRect();
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && tooltipRef.current) {
      const parentRect = tooltipRef.current.parentElement?.getBoundingClientRect();
      if (parentRect) {
        const maxX = parentRect.width - tooltipRef.current.offsetWidth;
        const maxY = parentRect.height - tooltipRef.current.offsetHeight;
        
        const newX = Math.max(0, Math.min(maxX, e.clientX - parentRect.left - dragOffset.x));
        const newY = Math.max(0, Math.min(maxY, e.clientY - parentRect.top - dragOffset.y));
        
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && tooltipRef.current && e.touches.length === 1) {
      const touch = e.touches[0];
      const parentRect = tooltipRef.current.parentElement?.getBoundingClientRect();
      if (parentRect) {
        const maxX = parentRect.width - tooltipRef.current.offsetWidth;
        const maxY = parentRect.height - tooltipRef.current.offsetHeight;
        
        const newX = Math.max(0, Math.min(maxX, touch.clientX - parentRect.left - dragOffset.x));
        const newY = Math.max(0, Math.min(maxY, touch.clientY - parentRect.top - dragOffset.y));
        
        setPosition({ x: newX, y: newY });
        e.preventDefault(); // Prevent scrolling while dragging
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging]);

  if (!isVisible) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-16 right-4 z-10 h-10 w-10 rounded-full bg-brown-100/90 dark:bg-brown-700/90 hover:bg-brown-200 dark:hover:bg-brown-600 text-brown-900 dark:text-brown-100 shadow-md border border-brown-200 dark:border-brown-600 animate-pulse"
        onClick={() => onToggleVisibility(true)}
        title={getTranslation('additionalInfo', language)}
      >
        <Info className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div 
      ref={tooltipRef}
      className="absolute z-20 max-w-md w-[calc(100%-40px)] sm:w-auto"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: isDragging ? 'none' : 'box-shadow 0.2s ease-in-out'
      }}
    >
      <Card className={`border border-brown-200 dark:border-brown-600 bg-brown-50/95 dark:bg-brown-800/95 backdrop-blur-sm ${isDragging ? 'shadow-xl' : 'shadow-lg'}`}>
        <div 
          className="p-3 cursor-grab active:cursor-grabbing flex justify-between items-center border-b border-brown-200 dark:border-brown-600"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-brown-500 dark:text-brown-300" />
            <h3 className="text-sm font-medium text-brown-900 dark:text-brown-100 select-none">
              {getTranslation('additionalInfo', language)}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-brown-200 dark:hover:bg-brown-700"
            onClick={() => onToggleVisibility(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardContent className="p-4 overflow-auto max-h-[300px] sm:max-h-[200px] md:max-h-[300px]">
          {info ? (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-brown-900 dark:text-brown-100 leading-relaxed text-sm">
                {info[language]}
              </p>
            </div>
          ) : (
            <div className="text-brown-500 dark:text-brown-400 italic text-sm">
              {getTranslation('noInfo', language)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoTooltip;