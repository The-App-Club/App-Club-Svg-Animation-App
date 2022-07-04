import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import {useEffect, useRef} from 'react';
import Wave from 'react-wavify';
import * as d3 from 'd3';
import {transform} from 'framer-motion';
import {samples, interpolate, formatHex} from 'culori';
import easing from 'bezier-easing';

import lip1 from './assets/lip1.png';
import lip2 from './assets/lip2.png';
import lip3 from './assets/lip3.png';

import '@fontsource/inter';
import './styles/index.scss';

const App = () => {
  const reqId = useRef(null);
  const pathDomRef1 = useRef(null);
  const animateMotionDomRef1 = useRef(null);
  const pathDomRef2 = useRef(null);
  const animateMotionDomRef2 = useRef(null);
  const pathDomRef3 = useRef(null);
  const animateMotionDomRef3 = useRef(null);
  const lastUpdateRef = useRef(new Date());
  const waveCount = 10;
  const waveInfoList = samples(waveCount)
    .map(easing(0, 0, 0.18, 0.19))
    .map(transform([0, 1], [0.2, 0.8]))
    .map((t) => {
      return {color: d3.interpolateBlues(t), t};
    });
  // const waveInfoList = samples(waveCount)
  //   .map(easing(0, 0, 0.18, 0.19))
  //   .map(transform([0, 1], [0.2, 0.8]))
  //   .map((t) => {
  //     return {
  //       color: interpolate(
  //         [
  //           '#2F5D62',
  //           '#5E8B7E',
  //           '#A7C4BC',
  //           '#DFEEEA',
  //           '#A7C4BC',
  //           '#5E8B7E',
  //           '#2F5D62',
  //         ],
  //         'yiq'
  //       )(t),
  //       t,
  //     };
  //   })
  //   .map(({color, t}) => {
  //     return {
  //       color: formatHex(color),
  //       t,
  //     };
  //   });
  const buildPath = ({points, containerWidth, containerHeight}) => {
    let d = `M ${points[0].x} ${points[0].y}`;
    const initial = {
      x: (points[1].x - points[0].x) / 2,
      y: points[1].y - points[0].y + points[0].y + (points[1].y - points[0].y),
    };
    const cubic = (a, b) => ` C ${a.x} ${a.y} ${a.x} ${a.y} ${b.x} ${b.y}`;
    d += cubic(initial, points[1]);
    let point = initial;
    for (let i = 1; i < points.length - 1; i++) {
      point = {
        x: points[i].x - point.x + points[i].x,
        y: points[i].y - point.y + points[i].y,
      };
      d += cubic(point, points[i + 1]);
    }
    return {path: d};
  };
  const calculateWavePoints = ({
    points,
    speed,
    amplitude,
    height,
    containerWidth,
    step,
  }) => {
    const resultList = [];
    for (let i = 0; i <= Math.max(points, 1); i++) {
      const scale = 100;
      const x = (i / points) * containerWidth;
      const seed = (step + (i + (i % points))) * speed * scale;
      const height = Math.sin(seed / scale) * amplitude;
      const y = Math.sin(seed / scale) * height + height;
      resultList.push({x, y});
    }
    return {points: resultList};
  };

  useEffect(() => {
    let elapsedTime = 0;
    let step = 0;
    const scale = 1000;
    const pathDom1 = pathDomRef1.current;
    const animateMotionDom1 = animateMotionDomRef1.current;
    const pathDom2 = pathDomRef2.current;
    const animateMotionDom2 = animateMotionDomRef2.current;
    const pathDom3 = pathDomRef3.current;
    const animateMotionDom3 = animateMotionDomRef3.current;
    (function animate(t) {
      const now = new Date();
      elapsedTime += now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      const {points: points1} = calculateWavePoints({
        points: 4,
        speed: 0.45,
        amplitude: 30,
        height: 60,
        containerWidth: window.innerWidth,
        step,
      });
      const {path: path1} = buildPath({
        points: points1,
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight,
      });
      pathDom1.setAttribute('d', path1);
      animateMotionDom1.setAttribute('path', path1);
      const {points: points2} = calculateWavePoints({
        points: 6,
        speed: 0.45,
        amplitude: 40,
        height: 60,
        containerWidth: window.innerWidth,
        step,
      });
      const {path: path2} = buildPath({
        points: points2,
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight,
      });
      pathDom2.setAttribute('d', path2);
      animateMotionDom2.setAttribute('path', path2);
      const {points: points3} = calculateWavePoints({
        points: 8,
        speed: 0.45,
        amplitude: 20,
        height: 60,
        containerWidth: window.innerWidth,
        step,
      });
      const {path: path3} = buildPath({
        points: points3,
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight,
      });
      pathDom3.setAttribute('d', path3);
      animateMotionDom3.setAttribute('path', path3);
      step = (elapsedTime * Math.PI) / scale;
      reqId.current = window.requestAnimationFrame(animate);
    })();
    return () => {
      window.cancelAnimationFrame(reqId.current);
    };
  }, []);

  return (
    <div>
      <header>Hello</header>
      <main>
        <article>
          <section>
            <div
              className={css`
                position: relative;
                min-height: 100vh;
                width: 100%;
              `}
            >
              <div
                className={css`
                  height: ${100}vh;
                  position: absolute;
                  bottom: -30vh;
                  z-index: ${waveCount + 1};
                  width: 100%;
                  display: inline-block;
                `}
              >
                <svg
                  className={css`
                    display: block;
                    height: 100%;
                    width: 100%;
                  `}
                >
                  <g transform="translate(0,100)">
                    <path
                      ref={pathDomRef3}
                      fill={'none'}
                      // stroke={'black'}
                      // strokeWidth={2}
                      d={``}
                    />
                    <image href={lip1} width="100">
                      <animateMotion
                        ref={animateMotionDomRef3}
                        dur="6s"
                        repeatCount="indefinite"
                        path={``}
                      />
                    </image>
                    {/* <circle r="10" fill="pink">
                      <animateMotion
                        ref={animateMotionDomRef3}
                        dur="6s"
                        repeatCount="indefinite"
                        path={``}
                      />
                    </circle> */}
                  </g>
                </svg>
              </div>

              <div
                className={css`
                  height: ${100}vh;
                  position: absolute;
                  bottom: -50vh;
                  z-index: ${waveCount + 1};
                  width: 100%;
                  display: inline-block;
                `}
              >
                <svg
                  className={css`
                    display: block;
                    height: 100%;
                    width: 100%;
                  `}
                >
                  <g transform="translate(0,100)">
                    <path
                      ref={pathDomRef2}
                      fill={'none'}
                      // stroke={'black'}
                      // strokeWidth={2}
                      d={``}
                    />
                    <image href={lip2} width="100">
                      <animateMotion
                        ref={animateMotionDomRef2}
                        dur="10s"
                        repeatCount="indefinite"
                        path={``}
                      />
                    </image>
                    {/* <circle r="10" fill="orange">
                      <animateMotion
                        ref={animateMotionDomRef2}
                        dur="10s"
                        repeatCount="1"
                        path={``}
                      />
                    </circle> */}
                  </g>
                </svg>
              </div>

              <div
                className={css`
                  height: ${100}vh;
                  position: absolute;
                  bottom: -70vh;
                  z-index: ${waveCount + 1};
                  width: 100%;
                  display: inline-block;
                `}
              >
                <svg
                  className={css`
                    display: block;
                    height: 100%;
                    width: 100%;
                  `}
                >
                  <g transform="translate(0,100)">
                    <path
                      ref={pathDomRef1}
                      fill={'none'}
                      // stroke={'black'}
                      // strokeWidth={2}
                      d={``}
                    />
                    <image href={lip3} width="100">
                      <animateMotion
                        ref={animateMotionDomRef1}
                        dur="8s"
                        repeatCount="indefinite"
                        path={``}
                      />
                    </image>
                    {/* <circle r="10" fill="red">
                      <animateMotion
                        ref={animateMotionDomRef1}
                        dur="8s"
                        repeatCount="indefinite"
                        path={``}
                      />
                    </circle> */}
                  </g>
                </svg>
              </div>
              {waveInfoList.map(({color, t}, index) => {
                return (
                  <Wave
                    key={index}
                    className={css`
                      height: ${100 * t}vh;
                      position: absolute;
                      bottom: 0;
                      z-index: ${waveCount - index};
                    `}
                    fill={color}
                    paused={false}
                    options={{
                      height: 60,
                      amplitude: 30,
                      speed: 0.45 * (1 - t),
                      points: 4 + index,
                    }}
                  />
                );
              })}
            </div>
          </section>
        </article>
      </main>
      <footer>Bye</footer>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
