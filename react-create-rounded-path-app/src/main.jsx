import {createRoot} from 'react-dom/client';
import './styles/index.scss';
import * as d3 from 'd3';
import {css} from '@emotion/css';
import {useEffect, useRef, useState, useMemo, useCallback} from 'react';
import tinygradient from 'tinygradient';
import {transform} from 'framer-motion';
import logo from './assets/logo.svg';
import {Slider} from '@mui/material';
import {samples, interpolate, formatHex} from 'culori';
import easing from 'bezier-easing';

const pointList = [
  {x: 20, y: 0},
  {x: 20, y: 50},
  {x: 150, y: 50},
  {x: 150, y: 100},
  {x: 120, y: 120},
  {x: 200, y: 150},
  {x: 200, y: 80},
  {x: 280, y: 80},
  {x: 280, y: 220},
  {x: 120, y: 220},
  {x: 150, y: 180},
  {x: 80, y: 130},
  {x: 20, y: 130},
  {x: 20, y: 280},
  {x: 290, y: 280},
];

const characterSize = 40;
const xyList = pointList.map((point) => {
  return [point.x + 30, point.y + 30, 200]; // ちょいと調節が必要 別でzoom用のリストを用意したほうがいいかも
});
const zoomPairs = d3.pairs(xyList);
const nuts = samples(pointList.length);
const progressPairs = d3.pairs(nuts);

const makeGradient = (step, interpolateColor) => {
  const bezier = easing(0, 0, 0.18, 0.99);
  const result = samples(step)
    .map(bezier)
    .map(transform([0, 1], [0.2, 0.8]))
    .map((t) => {
      return {t, color: interpolateColor(t)};
    })
    .map((info) => {
      return {...info, color: formatHex(info.color)};
    })
    .map((info) => {
      return `${info.color} ${info.t * 100}%`;
    });
  return result.join();
};
const App = () => {
  const width = 300;
  const height = 300;
  const [stepColorList, setStepColorList] = useState([]);
  const [transformer, setTransformer] = useState(`translate(5 5) scale(1)`);
  const zoom = (zoomStart, zoomEnd) => {
    return (t) => {
      const view = d3.interpolateZoom(zoomStart, zoomEnd)(t);
      const k = Math.min(width, height) / view[2]; // scale
      const translate = [width / 2 - view[0] * k, height / 2 - view[1] * k]; // translate
      return `translate(${translate}) scale(${k})`;
    };
  };

  const matcher = (array = [], value) => {
    const result = array.findIndex((item) => {
      return item[0] <= value && value <= item[1];
    });
    return result;
  };

  const svgDomRef = useRef(null);
  const viewDomRef = useRef(null);
  const pathDomRef = useRef(null);
  const characterDomRef = useRef(null);
  const gradient = tinygradient([
    {color: '#54d0ff', pos: 0},
    {color: '#9f92ff', pos: 0.5},
    {color: '#ff7689', pos: 1},
  ]);

  const samples = (path, precision) => {
    const n = path.getTotalLength(),
      t = [0];
    let i = 0;
    const dt = precision;
    while ((i += dt) < n) {
      t.push(i);
    }
    t.push(n);
    return t.map((t) => {
      const p = path.getPointAtLength(t),
        a = [p.x, p.y];
      a.t = t / n;
      return a;
    });
  };

  useEffect(() => {
    const pathDom = pathDomRef.current;
    const infoList = samples(pathDom, 300);
    setStepColorList(
      infoList.map((item) => {
        return {
          color: `${d3.interpolateInferno(
            transform([0, 1], [0.3, 0.7])(item['t'])
          )}`,
          t: item['t'],
        };
        // return {color: `#${gradient.hsvAt(item['t']).toHex()}`, t: item['t']};
      })
    );
  }, []);

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
      {xMin: 0, yMin: 0, xMax: width, yMax: height}
    );

    const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;

    svg.setAttribute('viewBox', viewbox);
  }, []);

  // https://stackoverflow.com/a/52819132/711152
  function createRoundedPathString(pathCoords = [], curveRadius = 3) {
    const path = [];

    // Reset indexes, so there are no gaps
    pathCoords = pathCoords.filter(() => true);

    for (let i = 0; i < pathCoords.length; i++) {
      // 1. Get current coord and the next two (startpoint, cornerpoint, endpoint) to calculate rounded curve
      const c2Index =
        i + 1 > pathCoords.length - 1 ? (i + 1) % pathCoords.length : i + 1;
      const c3Index =
        i + 2 > pathCoords.length - 1 ? (i + 2) % pathCoords.length : i + 2;

      const c1 = pathCoords[i],
        c2 = pathCoords[c2Index],
        c3 = pathCoords[c3Index];

      // 2. For each 3 coords, enter two new path commands: Line to start of curve, bezier curve around corner.

      // Calculate curvePoint c1 -> c2
      const c1c2Distance = Math.sqrt(
        Math.pow(c1.x - c2.x, 2) + Math.pow(c1.y - c2.y, 2)
      );
      const c1c2DistanceRatio = (c1c2Distance - curveRadius) / c1c2Distance;
      const c1c2CurvePoint = [
        ((1 - c1c2DistanceRatio) * c1.x + c1c2DistanceRatio * c2.x).toFixed(1),
        ((1 - c1c2DistanceRatio) * c1.y + c1c2DistanceRatio * c2.y).toFixed(1),
      ];

      // Calculate curvePoint c2 -> c3
      const c2c3Distance = Math.sqrt(
        Math.pow(c2.x - c3.x, 2) + Math.pow(c2.y - c3.y, 2)
      );
      const c2c3DistanceRatio = curveRadius / c2c3Distance;
      const c2c3CurvePoint = [
        ((1 - c2c3DistanceRatio) * c2.x + c2c3DistanceRatio * c3.x).toFixed(1),
        ((1 - c2c3DistanceRatio) * c2.y + c2c3DistanceRatio * c3.y).toFixed(1),
      ];

      // If at last coord of polygon, also save that as starting point
      if (i === pathCoords.length - 1) {
        path.unshift('M' + c2c3CurvePoint.join(','));
      }

      // Line to start of curve (L endcoord)
      path.push('L' + c1c2CurvePoint.join(','));
      // Bezier line around curve (Q controlcoord endcoord)
      path.push('Q' + c2.x + ',' + c2.y + ',' + c2c3CurvePoint.join(','));
    }
    // Logically connect path to starting point again (shouldn't be necessary as path ends there anyway, but seems cleaner)
    path.push('Z');

    return path;
  }

  const ruts = useMemo(() => {
    const list = createRoundedPathString(pointList, 15);
    // Zを含めて閉包しないために切り取り
    return list.slice(0, list.length - 4).join(' ');
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
    // const p = pathDom.getPointAtLength((1 - t) * length);
    return 'translate(' + (p.x - 20) + ',' + (p.y - 20) + ')';
  }, []);

  const handleChange = (e) => {
    const progress = Number(e.target.value);
    const characterDom = d3.select(characterDomRef.current);
    const pathDom = d3.select(pathDomRef.current);
    trace(progress, characterDom, pathDom);

    const matchIndex = matcher(progressPairs, progress);
    const [zoomStart, zoomEnd] = zoomPairs[matchIndex];
    const progressPair = progressPairs[matchIndex];
    const p = transform(progressPair, [0, 1])(progress);
    // console.log(p, zoomStart, zoomEnd)
    if (p === 0 || p === 1) {
      const viewDom = d3.select(viewDomRef.current);
      const t = d3.zoomIdentity.translate(0, 0).scale(1);
      viewDom
        .transition()
        .duration(350)
        .ease(d3.easeLinear)
        .attr('transform', t.toString());
      return;
    }
    const z = zoom(zoomStart, zoomEnd)(p);
    setTransformer(z);
  };

  // return null;
  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
        max-width: 40rem;
        padding: 0 60px;
        min-height: 100vh;
        @media screen and (max-width: 768px) {
          max-width: 100vw;
          padding: 0 5px;
        }
      `}
    >
      <div
        className={css`
          width: 100%;
          padding: 60px;
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
      <svg
        ref={svgDomRef}
        className={css`
          background: linear-gradient(
            45deg,
            ${makeGradient(5, d3.interpolateGnBu)}
          );
          /* background: repeating-linear-gradient(45deg, ${makeGradient(
            5,
            d3.interpolateInferno
          )}); */
          /* background: radial-gradient(${makeGradient(
            5,
            d3.interpolateInferno
          )}); */
          /* background: repeating-radial-gradient(${makeGradient(
            5,
            d3.interpolateInferno
          )}); */
        `}
        width={width}
        height={height}
      >
        <g ref={viewDomRef} transform={transformer}>
          <defs>
            <linearGradient id="Gradient1">
              {stepColorList.map((setStepColor, index) => {
                return (
                  <stop
                    key={index}
                    stopColor={`${setStepColor.color}`}
                    offset={`${setStepColor.t}`}
                  />
                );
              })}
            </linearGradient>
          </defs>
          <g>
            <path
              ref={pathDomRef}
              d={ruts}
              stroke="url(#Gradient1)"
              strokeWidth="6"
              fill="none"
            />
          </g>
          <g ref={characterDomRef}>
            <image
              href={`${logo}`}
              width={characterSize}
              heigth={characterSize}
            ></image>
          </g>
        </g>
      </svg>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
