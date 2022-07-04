import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import {css} from '@emotion/css';
import {generateBezierCurve} from './plugins/generateBezierCurve';
import {useRef, useEffect, useState, useCallback} from 'react';
import {Slider} from '@mui/material';
import {transform} from 'framer-motion';
import * as d3 from 'd3';

const points = [
  [-15, 10],
  [-5, 40],
  [5, 30],
  [10, 10],
  [40, 30],
  [60, 5],
  [90, 25],
  [120, 10],
  [150, 35],
  [200, 10],
  [240, 30],
  [260, 5],
  [290, 35],
  [320, 10],
  [350, 35],
  [400, 10],
  [480, 20],
  [490, 40],
  [530, 20],
];

const App = () => {
  const svgDomRef = useRef(null);
  const birdDomRef = useRef(null);
  const pathDomRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [viewbox, setViewbox] = useState(`0 0 100 100`);

  useEffect(() => {
    const svg = svgDomRef.current;
    const {xMin, xMax, yMin, yMax} = [...svg.children].reduce(
      (acc, el) => {
        const {x, y, width, height} = el.getBBox();
        if (!acc.xMin || x < acc.xMin) {
          acc.xMin = x;
        }
        if (!acc.xMax || x + width > acc.xMax) {
          acc.xMax = x + width;
        }
        if (!acc.yMin || y < acc.yMin) {
          acc.yMin = y;
        }
        if (!acc.yMax || y + height > acc.yMax) {
          acc.yMax = y + height;
        }
        return acc;
      },
      {xMin: Infinity, yMin: Infinity, xMax: -Infinity, yMax: -Infinity}
    );
    const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;
    setViewbox(viewbox);
  }, []);

  const trace = useCallback((t, moveDom, pathDom) => {
    moveDom
      .transition()
      .ease(d3.easeLinear)
      .attrTween('transform', function (d) {
        return () => {
          return seek(t, pathDom.node());
        };
      });
  }, []);

  const seek = useCallback((t, pathDom) => {
    const length = pathDom.getTotalLength();
    const p = pathDom.getPointAtLength(t * length);
    return 'translate(' + (p.x - 0) + ',' + (p.y - 0) + ')';
  }, []);

  // useEffect(() => {
  //   const birdDom = d3.select(birdDomRef.current);
  //   const pathDom = d3.select(pathDomRef.current);
  //   trace(progress, birdDom, pathDom);
  // }, [progress]);

  useEffect(() => {
    const svg = svgDomRef.current;
    const {x, y, width, height} = svg.firstElementChild.getBBox();
    const dx = transform([0, 1], [x, width])(progress);
    const dy = transform([0, 1], [y, height])(progress);
    console.log(`dx, dy`, dx, dy);
    const viewbox = `${dx + 10} ${y - 10} 100 ${height - y + 30}`;
    setViewbox(viewbox);
  }, [progress]);

  const handleChange = (e) => {
    const value = Number(e.target.value);
    setProgress(value);
  };

  return (
    <>
      <div
        className={css`
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 60px;
          z-index: 1;
        `}
      >
        <Slider
          onChange={handleChange}
          min={0}
          max={1}
          defaultValue={0}
          step={0.001}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </div>
      <div
        className={css`
          position: relative;
        `}
      >
        <svg
          ref={svgDomRef}
          viewBox={viewbox}
          className={css`
            display: block;
            width: 100%;
            height: 100vh;
            position: absolute;
            top: 0;
            left: 0;
          `}
        >
          <g>
            <path
              ref={pathDomRef}
              d={`${generateBezierCurve({points})}`}
              stroke={'black'}
              strokeWidth={1}
              fill={'none'}
            ></path>
          </g>
        </svg>
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
