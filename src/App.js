import { ethers } from 'ethers';
import Form from 'react-bootstrap/Form';
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
  const [cryptosValue, setCryptosValue] = useState('');

  const confetti = useRef(null);
  const upperContainer = useRef(null);
  const wordCloudContainer = useRef(null);
  const defaultContainerHeader = useRef(null);
  const defaultContainer = useRef(null);
  const defaultContainerText = useRef(null);
  const waveBtn = useRef(null);
  const cryptosInput = useRef(null);

  const { wWidth, wHeight } = useWindowSize();

  const wave = () => {
    setRunConfetti(true);

    defaultContainer.current.classList.add('waved');
    defaultContainerHeader.current.textContent = '👋 Just a bit more!'
    defaultContainerText.current.textContent = `
      Hey there! Can I ask you to write down the cryptocurrencies
      you use in the text input below? Separate them by commas!
    `;

    waveBtn.current.classList.add('waved');
    waveBtn.current.disabled = true;
    setTimeout(() => {
      waveBtn.current.style.display = 'none';
      cryptosInput.current.classList.remove('d-none');
    }, 333);
    cryptosInput.current.disabled = true;
    setTimeout(() => {
      cryptosInput.current.disabled = false;
      cryptosInput.current.focus();

      confetti.current.remove();
    }, 3000);
  }

  const handleCryptosSubmit = () => {
    if (cryptosValue.length > 0) {
      setCryptosValue('');
      cryptosInput.current.classList.add('d-none');
      defaultContainer.current.classList.add('answered');
      wordCloudContainer.current.style.display = 'block';

      defaultContainer.current.classList.remove('waved');
      defaultContainerHeader.current.textContent = '👋 Thanks for answering!'
      defaultContainerText.current.textContent = `
        Thanks for answering! See the word cloud above to see which answer's most popular,
        scroll to navigate it
      `;
    }
  }

  // code adapted from and thanks to https://htmldom.dev/drag-to-scroll/
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  const mouseDownHandler = (e) => {
    wordCloudContainer.current.style.cursor = 'grabbing';
    wordCloudContainer.current.style.userSelect = 'none';

    pos = {
        // The current scroll
        left: wordCloudContainer.current.scrollLeft,
        top: wordCloudContainer.current.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  useEffect(() => {
    wordCloudContainer.current.addEventListener('mousedown', mouseDownHandler);
  }, []);

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;

    // Scroll the element
    wordCloudContainer.current.scrollTop = pos.top - dy;
    wordCloudContainer.current.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    wordCloudContainer.current.style.cursor = 'grab';
    wordCloudContainer.current.style.removeProperty('user-select');
  };

  let wordCount = [];
  const cryptosText = 'bitcoin,ethereum,bnb,xrp,cardano,solana,dogecoin,polkadot,shiba inu,avalanche,polygon,tron,uniswap,unus sed leo,ethereum classic,litecoin,ftx token,chainlink,near protocol,cronos,cosmos,stellar,monero,bitcoin cash,flow,algorand,vechain,filecoin,internet computer,apecoin,decentraland,the sandbox,tezos,eos,hedera,quant,elrond,theta network,axie infinity,aave,chiliz,okb,bitcoin sv,zcash';
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
        ref={confetti}
        width={wWidth}
        height={wHeight}
        numberOfPieces={2000}
        gravity={0.6}
        recycle={false}
        run={runConfetti}
        tweenDuration={10000}
      />
      <div className='upper-container' ref={upperContainer}>
        <div className='word-cloud-container' ref={wordCloudContainer}>
          <WordCloud
            data={wordCloudData}
            width={wWidth}
            height={wHeight}
            font="Segoe UI"
            fontWeight="bold"
            fontSize={(word) => Math.log2(word.value) * 5}
            spiral="rectangular"
            rotate={() => ~~(Math.random() * 2) * 90}
            // rotate={0}
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
          <div ref={defaultContainerHeader} className='default-container-header'>
            👋 Hey there!
          </div>
          <div ref={defaultContainerText} className='default-container-text'>
            I am Numbers00 and I especially like all things web-related. I don't really know what to put here, but connect
            your Ethereum wallet and try waving at me!
          </div>
          <button className='wave-button' ref={waveBtn} onClick={wave}>
            Wave?
          </button>
          <Form.Control
            ref={cryptosInput}
            value={cryptosValue}
            onChange={(e) => setCryptosValue(e.target.value)}
            onKeyUp={(e) => e.key === 'Enter' ? handleCryptosSubmit() : null}
            type='text'
            className='cryptos-input d-none'
            placeholder='bitcoin, ethereum, litecoin, solana, harmony'
          />
        </div>
      </div>
    </div>
  );
}
