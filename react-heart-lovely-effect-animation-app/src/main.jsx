import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import {cx, css} from '@emotion/css';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  createRef,
} from 'react';
import {Button} from '@mui/material';
import {motion, transform, useAnimation} from 'framer-motion';
import * as d3 from 'd3';
import gsap from 'gsap';
import {samples, interpolate, formatHex} from 'culori';
import {BsFillHeartFill} from 'react-icons/bs';
// <BsFillHeartFill size={40} />
import {default as chance} from 'chance';

const variants = {
  initial: {opacity: 1, y: 0, scale: 1},
  animate: {opacity: 1, y: -10, scale: 1.3},
};

const App = ({
  path = `M 23.6 2 C 20.237 2 17.342 4.736 16.001 7.594 C 14.659 4.736 12 2 8.4 2 C 3.763 2 0 5.764 0 10.401 C 0 19.834 9.516 22.307 16.001 31.633 C 22.131 22.365 32 19.533 32 10.401 C 32 5.764 28.237 2 23.6 2 Z`,
}) => {
  const [tik, setTik] = useState(null);
  const svgDomRef = useRef(null);
  const pathDomRef = useRef(null);

  const controls = useAnimation();

  const createParticleInfo = ({x, y, t}) => {
    return {
      cx: x + 3,
      cy: y + 3,
      r: 0.5,
      fill: d3.interpolateWarm(transform([0, 1], [0.2, 0.8])(t)),
      opacity: 0,
    };
  };

  const circleInfoList = useMemo(() => {
    const pathDom = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    pathDom.setAttribute('d', path);
    const totalLength = pathDom.getTotalLength();
    return samples(10).map((t) => {
      const currentLength = transform([0, 1], [0, totalLength])(t);
      const {x, y} = pathDom.getPointAtLength(currentLength);
      return createParticleInfo({x, y, t});
    });
  }, [path]);

  const circleDomRefs = useMemo(() => {
    return circleInfoList.map((circleInfo) => {
      return createRef();
    });
  }, [circleInfoList]);

  const tl = useMemo(() => {
    return gsap.timeline({
      paused: true,
      onComplete: () => {
        tl.seek(0);
        tl.pause();
        controls.start('initial');
      },
    });
  }, []);

  useEffect(() => {
    if (!tik) {
      return;
    }
    tl.play();
    controls.start('animate');
  }, [tik]);

  useEffect(() => {
    const circleDomList = circleDomRefs.map((circleDomRef) => {
      return circleDomRef.current;
    });
    tl.to(circleDomList, {
      duration: 0.2,
      ease: 'power4',
      opacity: 0,
      x: (i) => {
        return (
          circleInfoList[i].cx - 4 + chance().integer({min: -10, max: -5}) / 10
        );
      },
      y: (i) => {
        return (
          circleInfoList[i].cy - 4 + chance().integer({min: -10, max: -5}) / 10
        );
      },
      scale: 0.01,
    })
      .to(circleDomList, {
        duration: 0.2,
        ease: 'sine.in',
        opacity: 1,
        x: (i) => {
          return (
            circleInfoList[i].cx -
            4 +
            chance().integer({min: -10, max: 10}) / 10
          );
        },
        y: (i) => {
          return (
            circleInfoList[i].cy -
            4 +
            chance().integer({min: -10, max: 10}) / 10
          );
        },
        scale: 0.2,
        stagger: 0.1,
      })
      .to(circleDomList, {
        duration: 0.2,
        ease: 'sine.out',
        opacity: 0,
        x: (i) => {
          return circleInfoList[i].cx - 4;
        },
        y: (i) => {
          return circleInfoList[i].cy - 4;
        },
        scale: 0.01,
        stagger: 0.1,
      });
  }, []);

  const handleClick = (e) => {
    setTik(new Date());
  };

  return (
    <>
      <Button variant={'outlined'} onClick={handleClick}>
        Do
      </Button>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        `}
      >
        <motion.svg
          ref={svgDomRef}
          width="80"
          height="80"
          viewBox="0 0 40 40"
          preserveAspectRatio="none"
          onClick={handleClick}
          className={css`
            :hover {
              cursor: pointer;
            }
          `}
          whileHover={{scale: 1.1}}
          animate={controls}
          variants={variants}
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              {samples(10)
                .map((n) => {
                  return {t: n};
                })
                .map((info) => {
                  return {
                    t: info.t,
                    color: interpolate([
                      '#F47C7C',
                      '#F24A72',
                      '#FF5D5D',
                      '#E78EA9',
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
                      stopOpacity={0.9}
                    />
                  );
                })}
            </linearGradient>
          </defs>
          <g transform="translate(3 3)">
            <path
              id="heart"
              ref={pathDomRef}
              d={path}
              fill={`url(#gradient)`}
            />
          </g>
          {circleInfoList.map((circleInfo, index) => {
            return (
              <use
                ref={circleDomRefs[index]}
                key={index}
                href="#heart"
                opacity={circleInfo.opacity}
                transform={`translate(${circleInfo.cx - 4} ${
                  circleInfo.cy - 4
                }) scale(0.3)`}
              />
            );
          })}
        </motion.svg>
      </div>
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
