import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import {css} from '@emotion/css';
import sea from './assets/sea.jpg';
import seamap from './assets/sea-map.png';

const App = () => {
  return (
    <>
      <div
        className={css`
          position: absolute;
          top: 0;
          left: 0;
          height: 356px;
          width: 634px;
          background-image: url(${sea});
          background-size: cover;
          .water {
            position: absolute;
            background-image: url(${seamap});
            background-size: cover;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            filter: url('#turbulence');
          }
        `}
      >
        <div className="water"></div>
      </div>

      <svg>
        <filter id="turbulence" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            id="sea-filter"
            numOctaves="3"
            seed="2"
            baseFrequency="0.02 0.05"
          ></feTurbulence>
          <feDisplacementMap scale="20" in="SourceGraphic"></feDisplacementMap>
          <animate
            href="#sea-filter"
            attributeName="baseFrequency"
            dur="60s"
            keyTimes="0;0.5;1"
            values="0.02 0.06;0.04 0.08;0.02 0.06"
            repeatCount="indefinite"
          />
        </filter>
      </svg>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
