import {createRoot} from 'react-dom/client';
import {useEffect, useState, useRef, useMemo, useCallback, useId} from 'react';
import {cx, css} from '@emotion/css';
import {Slider} from '@mui/material';
import {Morph} from './components/Morph';

import '@fontsource/inter';
import './styles/index.scss';

const App = () => {
  const breakPoint = `(max-width: 768px)`;
  const [tik, setTik] = useState(null);
  const [size, setSize] = useState(
    window.matchMedia(breakPoint).matches ? 300 : 500
  );

  const handleChange = (e) => {
    setSize(e.target.value);
  };

  const handleResize = useCallback(() => {
    setSize(window.matchMedia(breakPoint).matches ? 300 : 500);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={css`
          position: fixed;
          top: 3rem;
          left: 3rem;
          width: 100%;
          max-width: 20rem;
          margin: 0 auto;
          @media (max-width: 768px) {
            padding: 3rem 0;
            position: initial;
            top: initial;
            left: initial;
            left: initial;
          }
        `}
      >
        <Slider
          min={300}
          max={800}
          step={1}
          value={size}
          aria-label="Default"
          valueLabelDisplay="auto"
          onChange={handleChange}
        />
      </div>
      <Morph size={size} />
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
