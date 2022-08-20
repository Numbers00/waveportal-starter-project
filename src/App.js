import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import { ethers } from 'ethers';
import './App.css';

export default function App() {
  const defaultContainer = useRef(null);
  const waveBtn = useRef(null);

  const wave = () => {
    defaultContainer.current.classList.add('waved');
    waveBtn.current.classList.add('waved');
    waveBtn.current.disabled = true;
  }
  
  return (
    <div className='main-container'>
      <div className='upper-container'>
        <div className='default-container' ref={defaultContainer}>
          <div className='default-container-header'>
          👋 Hey there!
          </div>
          <div className='default-container-bio'>
            I am Numbers00 and I especially like all things web-related. I don't really know what to put here, but connect
            your Ethereum wallet and try waving at me!
          </div>
          <button className='wave-button' ref={waveBtn} onClick={wave}>
            Wave?
          </button>
        </div>
      </div>
    </div>
  );
}
