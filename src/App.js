import { ethers } from 'ethers';
import Form from 'react-bootstrap/Form';
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
import abi from './utils/WavePortal.json';

export default function App() {
  /**
  * Create a variable here that holds the contract address after you deploy!
  */
  const contractAddress = "0x6F7Cd529dF90a2CE3a97aDDc37AE33320E21e7F5";
  /**
   * Create a variable here that references the abi content!
   */
   const contractABI = abi.abi;
  
  const [currentAccount, setCurrentAccount] = useState('');
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

  const checkIfWalletIsConnected = async () => {
    try {
      /*
      * First make sure we have access to window.ethereum
      */
      const { ethereum } = window;
      if (!ethereum) {
        console.log('Make sure you have metamask!');
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setCurrentAccount(account);
      } else {
        console.log('No authorized accounts found');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  /**
  * Implement your connectWallet method here
  */
   const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('You do not have Metamask, you need Metamask to continue');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentAccount) {
      waveBtn.current.classList.remove('disabled');
      waveBtn.current.classList.add('active');
    }
  }, [currentAccount]);

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
  };

  const handleCryptosSubmit = async () => {
    if (cryptosValue.length > 0) {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

          const cryptosSet = [...new Set(cryptosValue.split(',').map(crypto => crypto.trim()))];
          console.log(cryptosSet);
          for (let i = 0; i < cryptosSet.length; i++) {
            const waveTxn = await wavePortalContract.wave(cryptosValue);
            console.log('Mining...', waveTxn.hash);

            await waveTxn.wait();
            console.log('Mined -- ', waveTxn.hash);
          }

          const count = await wavePortalContract.getTotalWaves();
          console.log('Retrieved total wave count...', count.toNumber());

          setCryptosValue('');

          cryptosInput.current.classList.add('d-none');
          defaultContainer.current.classList.add('answered');
          wordCloudContainer.current.style.display = 'block';

          defaultContainer.current.classList.remove('waved');
          defaultContainerHeader.current.textContent = `👋 Thanks! We\'re at ${count.toNumber()} waves now!`;
          defaultContainerText.current.textContent = `
            Thanks for answering! See the word cloud above to see which answer's most popular,
            click and drag to navigate the word cloud!
          `;
        } else {
          console.log('Ethereum object doesn\'t exist!');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

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
  const inputWords = cryptosText.concat(cryptosValue ? `,${cryptosValue}` : '').split(/,/g);
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
          {
            !currentAccount
              ? <button className='connect-button btn-theme1' onClick={connectWallet}>
                  Connect to Metamask
                </button>
              : null
          }
          <button className='wave-button btn-theme1 disabled' ref={waveBtn} onClick={wave}>
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
