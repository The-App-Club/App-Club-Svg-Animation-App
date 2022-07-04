import {createRoot} from 'react-dom/client';
import {useCallback, useEffect, useRef, useState} from 'react';
import {css} from '@emotion/css';
import './styles/index.scss';
// import data from './assets/data.json';
// import {generateBezierCurve} from './plugins/generateBezierCurve';
// const points = data.map((item)=>{return [item.x,item.y]})
// console.log(generateBezierCurve({points}));


const App = () => {
  return null;
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
