import React from 'react';
import PhotoSlider from '../components/PhotoSlider';

export default function Main() {
  return (
    <div className='w-full h-full'>
      <PhotoSlider />
      <div className='mt-8'>
        <p className='text-center'>다른 콘텐츠...</p>
      </div>
    </div>
  );
}
