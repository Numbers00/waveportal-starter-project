import { ethers } from 'ethers';
import * as d3 from 'd3';
import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import './App.css';

export default function App() {
  const [runConfetti, setRunConfetti] = useState(false);

  const upperContainer = useRef(null);
  const wordCloudContainer = useRef(null);
  const defaultContainer = useRef(null);
  const waveBtn = useRef(null);

  const { wWidth, wHeight } = useWindowSize();

  const wave = () => {
    setRunConfetti(true);

    defaultContainer.current.classList.add('waved');
    waveBtn.current.classList.add('waved');
    waveBtn.current.disabled = true;
  }

  let wordCount = [];
  const cryptosText = 'bitcoin,ethereum,litecoin,cardano,harmony,harmony,ethereum,harmony,bitcoin,ethereum,harmony,xrp,xrp,harmony';
  const inputWords = cryptosText.split(/,/g);
  inputWords.forEach(word => {
    const lowerCased = word.trim().toLowerCase();
    Object.keys(wordCount).includes(lowerCased)
      ? wordCount[lowerCased]++
      : wordCount[lowerCased] = 1;
  });
  const wordEntries = Object.entries(wordCount);
  const wordCloudData = wordEntries.map(entry => {
    return {
      text: entry[0],
      value: entry[1] * 100
    }
  });

  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

  return (
    <div className='main-container'>
      <Confetti
        width={wWidth}
        height={wHeight}
        numberOfPieces={2400}
        recycle={false}
        run={runConfetti}
        tweenDuration={35000}
      />
      <div className='upper-container' ref={upperContainer}>
        <div className='word-cloud-container' ref={wordCloudContainer}>
          <WordCloud
            data={wordCloudData}
            width={1200}
            height={1200}
            font="Segoe UI"
            fontWeight="bold"
            fontSize={(word) => Math.log2(word.value) * 5}
            spiral="rectangular"
            // rotate={() => ~~(Math.random() * 2) * 90}
            rotate={0}
            padding={5}
            random={Math.random}
            fill={(d, i) => schemeCategory10ScaleOrdinal(i)}
            onWordClick={(event, d) => {
              console.log(`onWordClick: ${d.text}`);
            }}
            onWordMouseOver={(event, d) => {
              console.log(`onWordMouseOver: ${d.text}`);
            }}
            onWordMouseOut={(event, d) => {
              console.log(`onWordMouseOut: ${d.text}`);
            }}
          />
        </div>
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
