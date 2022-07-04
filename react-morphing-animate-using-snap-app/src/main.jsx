import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import {css} from '@emotion/css';
import {useRef, useEffect, useState, useCallback} from 'react';
import {Slider} from '@mui/material';
import {transform} from 'framer-motion';
import * as d3 from 'd3';
import {default as Snap} from 'snapsvg';
import gsap from 'gsap';
import {samples, interpolate, formatHex} from 'culori';

const paths = {
  step1: {
    unfilled: 'M 0 0 h 0 c 0 50 0 50 0 100 H 0 V 0 Z',
    inBetween: 'M 0 0 h 33 c -30 54 113 65 0 100 H 0 V 0 Z',
    /*
    M 0 0 h 34 c 73 7 73 94 0 100 H 0 V 0 Z
    M 0 0 h 33 c -30 54 113 65 0 100 H 0 V 0 Z
    M 0 0 h 34 c 112 44 -32 49 0 100 H 0 V 0 Z
    */
    filled: 'M 0 0 h 100 c 0 50 0 50 0 100 H 0 V 0 Z',
  },
  step2: {
    filled: 'M 100 0 H 0 c 0 50 0 50 0 100 h 100 V 50 Z',
    //inBetween: 'M 100 0 H 50 c 20 33 20 67 0 100 h 50 V 0 Z',
    inBetween: 'M 100 0 H 50 c 28 43 4 81 0 100 h 50 V 0 Z',
    unfilled: 'M 100 0 H 100 c 0 50 0 50 0 100 h 0 V 0 Z',
  },
};

const App = () => {
  const svgDomRef = useRef(null);
  const pathDomRef = useRef(null);
  useEffect(() => {
    // const pathDom = pathDomRef.current;
    // gsap
    //   .timeline({
    //     // paused: true,
    //     onComplete: () => {},
    //   })
    //   .set(pathDom, {
    //     attr: {d: paths.step1.unfilled},
    //   })
    //   .to(
    //     pathDom,
    //     {
    //       duration: 0.8,
    //       ease: 'power3.in',
    //       attr: {d: paths.step1.inBetween},
    //     },
    //     0
    //   )
    //   .to(pathDom, {
    //     duration: 0.2,
    //     ease: 'power1',
    //     attr: {d: paths.step1.filled},
    //     onComplete: () => {},
    //   })
    //   .set(pathDom, {
    //     attr: {d: paths.step2.filled},
    //   })

    //   .to(pathDom, {
    //     duration: 0.15,
    //     ease: 'sine.in',
    //     attr: {d: paths.step2.inBetween},
    //   })
    //   .to(pathDom, {
    //     duration: 1,
    //     ease: 'power4',
    //     attr: {d: paths.step2.unfilled},
    //   });
    const pathDom = Snap(pathDomRef.current);
    const f = function () {
      pathDom.animate({d: paths.step2.unfilled}, 500, mina.easeinout, a);
    };
    const e = function () {
      pathDom.animate({d: paths.step2.inBetween}, 600, mina.easeinout, f);
    };
    const d = function () {
      pathDom.animate({d: paths.step2.filled}, 0, mina.easeinout, e);
    };
    const c = function () {
      pathDom.animate({d: paths.step1.filled}, 300, mina.easeinout, d);
    };
    const b = function () {
      pathDom.animate({d: paths.step1.inBetween}, 600, mina.easeinout, c);
    };
    const a = function () {
      pathDom.animate({d: paths.step1.unfilled}, 500, mina.easeinout, b);
    };
    a();
  }, []);

  return (
    <div
      className={css`
        position: relative;
        width: 100%;
        height: 100vh;
        svg {
          width: 100%;
          height: 100vh;
          display: block;
        }
        image {
          width: 100%;
          height: 100%;
        }
      `}
    >
      <svg
        ref={svgDomRef}
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {samples(10)
              .map((n) => {
                return {t: n};
              })
              .map((info) => {
                return {
                  t: info.t,
                  color: interpolate([
                    '#1F4690',
                    '#3A5BA0',
                    '#FFA500',
                    '#FFE5B4',
                  ])(info.t),
                };
              })
              .map((info) => {
                return {...info, color: formatHex(info.color)};
              })
              .map((info, index) => {
                return (
                  <stop
                    key={index}
                    offset={`${info.t * 100}%`}
                    stopColor={info.color}
                    stopOpacity={0.3}
                  />
                );
              })}
          </linearGradient>
        </defs>
        <g fill="url(#gradient)">
          <path
            ref={pathDomRef}
            vectorEffect={'non-scaling-stroke'}
            d={paths.step1.unfilled}
          />
        </g>
      </svg>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
