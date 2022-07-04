import {createRoot} from 'react-dom/client';
import {cx, css} from '@emotion/css';
import styled from '@emotion/styled';
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useId,
  createRef,
} from 'react';
import {Waver} from './components/Waver';

import './styles/index.scss';

const App = () => {
  return <Waver />;
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
