import {createRoot} from 'react-dom/client';
import {cx, css} from '@emotion/css';
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useId,
  createRef,
} from 'react';
import '@fontsource/inter';
import './styles/index.scss';
import {Moni} from './components/Moni';
import {Circle} from './components/Circle';
import {Rect} from './components/Rect';

const App = () => {
  return <Rect />;
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
