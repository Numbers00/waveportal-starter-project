import { ethers } from 'ethers';
import * as d3 from 'd3';
import WordCloud from 'react-d3-cloud';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import './App.css';

export default function App() {
  const upperContainer = useRef(null);
  const defaultContainer = useRef(null);
  const waveBtn = useRef(null);

  const wave = () => {
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
  console.log(wordCloudData);

  const schemeCategory10ScaleOrdinal = scaleOrdinal(schemeCategory10);

  // console.log(Object.keys(d3Cloud))
  // const drawWordCloud = (text) => {
  //   let wordCount = {};

  //   const inputWords = text.split(/,/g);
  //   inputWords.forEach(word => {
  //     const lowerCased = word.trim().toLowerCase();
  //     Object.keys(wordCount).includes(lowerCased)
  //       ? wordCount.lowerCased++
  //       : wordCount.lowerCased = 1;
  //   });

  //   const w = 0.8 * upperContainer.current.clientWidth;
  //   const h = 0.8 * upperContainer.current.clientHeight;
  //   const fills = d3.schemeCategory10;
  //   const wordEntries = Object.entries(wordCount);

  //   const xScale = d3
  //     .scaleLinear()
  //     .domain([0, d3.max(wordEntries, (d) => d.value)])
  //     .range([0, 100]);
    
  //   const draw = (words) => {
  //     d3
  //       .select(upperContainer.current)
  //       .append('svg')
  //       .attr('width', w)
  //       .attr('height', h)
  //       .append('g')
  //       .selectAll('text')
  //       .data(words)
  //       .enter()
  //       .append('text')
  //       .style('font-size', (d) => `${xScale(d.value)}px`)
  //       .style('font-family', 'Segoe UI')
  //       .style('fill', (d, i) => fills(i))
  //       .attr('text-anchor', 'middle')
  //       .attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
  //       .text((d) => d.key);
  //   };

  //   const wordCloud = d3Cloud
  //     .layout.cloud()
  //     .size([w, h])
  //     .timeInterval(20)
  //     .font('Segoe UI')
  //     .fontSize((d) => `${xScale(d.value)}px`)
  //     .text((d) => d.key)
  //     .rotate(() => ~~(Math.random() * 2) * 90)
  //     .on('end', draw)
  //     .start();

  //   wordCloud.stop();
  // }

  return (
    <div className='main-container'>
      <div className='upper-container' ref={upperContainer}>
        <div className='default-container' ref={defaultContainer}>
            <WordCloud
              data={wordCloudData}
              width={800}
              height={800}
              font="Segoe UI"
              fontWeight="bold"
              fontSize={(word) => Math.log2(word.value) * 5}
              spiral="rectangular"
              rotate={() => ~~(Math.random() * 2) * 90}
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
