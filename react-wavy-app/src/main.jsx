import {createRoot} from 'react-dom/client';
import {css} from '@emotion/css';
import {useEffect, useRef} from 'react';
import Wave from 'react-wavify';
import * as d3 from 'd3';
import {transform} from 'framer-motion';
import {samples, interpolate, formatHex} from 'culori';
import easing from 'bezier-easing';

import '@fontsource/inter';
import './styles/index.scss';

const App = () => {
  const waveCount = 10;
  // const waveInfoList = samples(waveCount)
  //   .map(easing(0, 0, 0.18, 0.19))
  //   .map(transform([0, 1], [0.2, 0.8]))
  //   .map((t) => {
  //     return {color: d3.interpolateBlues(t), t};
  //   });
  const waveInfoList = samples(waveCount)
    .map(easing(0, 0, 0.18, 0.19))
    .map(transform([0, 1], [0.2, 0.8]))
    .map((t) => {
      return {
        color: interpolate(
          [
            '#2F5D62',
            '#5E8B7E',
            '#A7C4BC',
            '#DFEEEA',
            '#A7C4BC',
            '#5E8B7E',
            '#2F5D62',
          ],
          'yiq'
        )(t),
        t,
      };
    })
    .map(({color, t}) => {
      return {
        color: formatHex(color),
        t,
      };
    });

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
              {waveInfoList.map(({color, t}, index) => {
                return (
                  <Wave
                    key={index}
                    className={css`
                      height: ${100 * t}vh;
                      position: absolute;
                      bottom: 0;
                      z-index: ${waveCount - index};
                      svg {
                      }
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
