import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import {css} from '@emotion/css';
import {useRef, useEffect, useState, useCallback} from 'react';
import {Slider} from '@mui/material';
import {transform, motion} from 'framer-motion';
import * as d3 from 'd3';
import {default as Snap} from 'snapsvg';
import gsap from 'gsap';
import {samples, interpolate, formatHex} from 'culori';

const App = () => {
  const svgDomRef = useRef(null);
  const imageDomRef = useRef(null);
  const [center, setCenter] = useState([170 / 4, 200 / 4]);
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      `}
    >
      <motion.svg
        ref={svgDomRef}
        width="170"
        height="200"
        drag
        dragConstraints={{
          top: -125,
          right: 125,
          bottom: 125,
          left: -125,
        }}
        dragTransition={{bounceStiffness: 600, bounceDamping: 20}}
        dragElastic={0.5}
        onMouseMove={(e) => {
          const dom = svgDomRef.current;
          const {top, left, width, height} = dom.getBoundingClientRect();
          const x = transform([0, width], [0, 100])(e.clientX - left);
          const y = transform([0, height], [0, 100])(e.clientY - top);
          setCenter([x, y]);
        }}
      >
        <defs>
          <filter id="filter">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <mask id="mask">
            <ellipse
              cx={`${center[0]}%`}
              cy={`${center[1]}%`}
              rx="35%"
              ry="35%"
              fill="white"
              filter="url(#filter)"
            ></ellipse>
          </mask>
        </defs>
        <image
          ref={imageDomRef}
          href="https://media.giphy.com/media/4ilFRqgbzbx4c/giphy.gif"
          width="170"
          height="200"
          mask="url(#mask)"
        ></image>
      </motion.svg>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
