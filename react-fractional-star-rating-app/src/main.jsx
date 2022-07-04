import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import {css} from '@emotion/css';
import {useState} from 'react';
import {Slider} from '@mui/material';
import {Rating} from './components/Rating';

const App = () => {
  const [progress, setProgress] = useState(2.5);

  const handleChange = (e) => {
    setProgress(Number(e.target.value));
  };

  return (
    <>
      <div
        className={css`
          max-width: 30rem;
          margin: 0 auto;
          width: 100%;
          padding: 3rem;
        `}
      >
        <Slider
          min={0}
          max={5}
          value={progress}
          step={0.1}
          onChange={handleChange}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </div>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          width: 100%;
        `}
      >
        <h2>{progress}</h2>
        <Rating value={progress} max={5} />
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
