import React, { useState, useEffect } from 'react';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const photos = [
  'https://via.placeholder.com/800x400/FF0000/FFFFFF?text=Slide+1',
  'https://via.placeholder.com/800x400/00FF00/FFFFFF?text=Slide+2',
  'https://via.placeholder.com/800x400/0000FF/FFFFFF?text=Slide+3',
  'https://via.placeholder.com/800x400/FFFF00/FFFFFF?text=Slide+4',
];

export default function PhotoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex - 1 + photos.length) % photos.length
    );
  }

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex + 1) % photos.length
    );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 3000); // 3초마다 슬라이드 전환

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        onClick={handlePrevClick}
      >
        <SlArrowLeft size={30} />
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        onClick={handleNextClick}
      >
        <SlArrowRight size={30} />
      </button>
      {photos.map((photo, index) => (
        <img
          key={index}
          src={photo}
          alt={`Slide ${index + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );
}
