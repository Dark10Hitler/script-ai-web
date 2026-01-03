import { useState, useEffect } from 'react';

const placeholders = [
  "Describe a TikTok viral hook about crypto...",
  "Write a 60-second YouTube Short script for a cooking channel...",
  "Create a persuasive sales pitch for a fitness app...",
  "Generate a storytelling script about overcoming failure...",
  "Write a trending Instagram Reel script about productivity hacks...",
  "Create a hook for a dropshipping product video...",
  "Write a motivational morning routine script...",
  "Generate a script about passive income strategies...",
];

export const useRotatingPlaceholder = (interval = 4000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % placeholders.length);
        setIsVisible(true);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { placeholder: placeholders[currentIndex], isVisible };
};
