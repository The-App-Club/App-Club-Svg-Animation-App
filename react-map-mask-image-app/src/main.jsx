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
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import {Home} from './pages/Home';
import {Focus} from './pages/Focus';

const App = () => {
  const location = useLocation();
  return (
    <Routes location={location.pathname}>
      <Route path="/" element={<Home />} />
      <Route path="detail" element={<Focus />} />
    </Routes>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
