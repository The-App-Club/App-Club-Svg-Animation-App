import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles/index.scss';
import {css} from '@emotion/css';
import SVGPathCommander from 'svg-path-commander';
import {Button} from '@mui/material';
import gsap, {Power1, Power2, Power3, Linear} from 'gsap';
import {samples, interpolate, formatHex} from 'culori';

const paths = {
  step1: `M 44 23 C 69 8 112 9 113 21 S 80 48 105 87 S 37 95 31 81 S 30 29 44 23 Z`,
  step2: `M 44 23 C 69 8 112 9 114 32 S 135 62 102 76 S 43 97 40 81 S 30 29 44 23 Z`,
  step3: `M 44 23 C 69 8 88 7 112 38 S 116 81 102 76 S 21 94 30 63 S 35 33 44 23 Z`,
  step4: `M 44 23 C 69 8 112 9 113 21 S 80 48 105 87 S 37 95 56 73 S 30 29 44 23 Z`,
  step5: `M 44 23 C 75 44 112 9 120 31 S 136 69 99 59 S 37 95 34 77 S 30 15 44 23 Z`,
};

const App = () => {
  const [playing, setPlaying] = useState(false);
  const [tik, setTik] = useState(null);
  const pathDomRef = useRef(null);
  const tl = useMemo(() => {
    return gsap.timeline({
      paused: true,
      onReverseComplete: () => {
        tl.timeScale(0.25);
        tl.play(0);
      },
      onComplete: () => {
        tl.timeScale(0.5);
        tl.reverse(0);
      },
    });
  }, []);

  const handleDo = useCallback((e) => {
    setTik(new Date());
  }, []);

  useEffect(() => {
    const pathDom = pathDomRef.current;
    tl.timeScale(0.5);
    tl.set(pathDom, {
      attr: {d: paths.step1},
      onComplete: () => {
        console.log('step1');
      },
    })
      .to(pathDom, {
        duration: 0.8,
        ease: Linear.easeOut,
        attr: {d: paths.step2},
        onComplete: () => {
          console.log('step2');
        },
      })
      .to(pathDom, {
        duration: 0.8,
        ease: Linear.easeOut,
        attr: {d: paths.step3},
        onComplete: () => {
          console.log('step3');
        },
      })
      .to(pathDom, {
        duration: 0.8,
        ease: Linear.easeOut,
        attr: {d: paths.step4},
        onComplete: () => {
          console.log('step4');
        },
      })
      .to(pathDom, {
        duration: 0.8,
        ease: Linear.easeOut,
        attr: {d: paths.step5},
        onComplete: () => {
          console.log('step5');
        },
      });
    tl.play();
  }, []);

  useEffect(() => {
    if (!tik) {
      return;
    }
    if (tl.paused()) {
      tl.play();
    } else {
      tl.pause();
    }
  }, [tik]);

  return (
    <>
      <Button variant={'outlined'} onClick={handleDo}>
        Do
      </Button>
      <div
        className={css`
          position: relative;
          width: 100%;
          height: 100vh;
          svg {
            width: 100%;
            height: 100%;
            display: block;
          }
          image {
            width: 100%;
          }
        `}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 150 150"
          preserveAspectRatio="xMidYMid meet"
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
                      '#F4BFBF',
                      '#FFD9C0',
                      '#FAF0D7',
                      '#8CC0DE',
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
          <g>
            <path
              id="morphPath"
              fill="url(#gradient)"
              ref={pathDomRef}
              d={paths.step1}
              className={css`
                stroke-linejoin: round;
              `}
            />
            <g transform="scale(0.4)">
              <use href="#morphPath" x={-100} y={200} />
            </g>
            <g transform="scale(0.7)">
              <use href="#morphPath" x={-100} y={0} />
            </g>
            <g transform="scale(0.4)">
              <use href="#morphPath" x={250} y={250} />
            </g>
            <g transform="scale(1.2)">
              <use href="#morphPath" x={100} y={0} />
            </g>
          </g>
        </svg>
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
