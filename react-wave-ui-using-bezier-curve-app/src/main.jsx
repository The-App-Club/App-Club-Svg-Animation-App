import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import {css} from '@emotion/css';
import {useRef, useEffect, useState, useCallback} from 'react';
import {Slider} from '@mui/material';
import {transform} from 'framer-motion';
import * as d3 from 'd3';
import gsap from 'gsap';
import {samples, interpolate, formatHex} from 'culori';
import easing from 'bezier-easing';
import bezierSpline from '@freder/bezier-spline';
import 'array-each-slice';
import {Wave} from './components/Wave';

const App = () => {
  const [progress, setProgress] = useState(0);
  const svgDomRef = useRef(null);

  const handleChange = (e) => {
    setProgress(e.target.value);
  };

  return (
    <div
      className={css`
        position: relative;
        width: 100%;
        height: 100vh;
      `}
    >
      <Wave
        width={100}
        height={100}
        segmentCount={10}
        layerCount={33}
        variance={0.75}
      />
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
