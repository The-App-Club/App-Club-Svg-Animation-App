import {cx, css} from '@emotion/css';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  createRef,
  useId,
} from 'react';
import {Button} from '@mui/material';
import {motion, transform, useAnimation} from 'framer-motion';
import * as d3 from 'd3';
import gsap from 'gsap';
import {samples, interpolate, formatHex} from 'culori';
import SVGPathCommander from 'svg-path-commander';

const Reaction = ({path = ``}) => {
  const id = useId();
  const [tik, setTik] = useState(null);
  const [animating, setAnimating] = useState(false);
  const svgDomRef = useRef(null);
  const pathDomRef = useRef(null);
  const miniPathDomRef = useRef(null);
  const innerDomRef = useRef(null);
  const outerDomRef = useRef(null);

  const innerPath = useMemo(() => {
    return new SVGPathCommander(path).transform({scale: 0.6}).toString();
  }, [path]);

  const outerPath = useMemo(() => {
    return new SVGPathCommander(path).transform({scale: 1}).toString();
  }, [path]);

  const createParticleInfo = ({x, y, t}) => {
    return {
      cx: x + 4,
      cy: y + 4,
      r: 0.5,
      fill: d3.interpolateWarm(transform([0, 1], [0.2, 0.8])(t)),
      opacity: 0,
      t,
      scale: 0.1,
    };
  };

  const outerItemInfoList = useMemo(() => {
    const pathDom = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    pathDom.setAttribute('d', outerPath);
    const totalLength = pathDom.getTotalLength();
    return samples(10).map((t) => {
      const currentLength = transform([0, 1], [0, totalLength])(t);
      const {x, y} = pathDom.getPointAtLength(currentLength);
      return createParticleInfo({x, y, t});
    });
  }, [outerPath]);

  const innerItemInfoList = useMemo(() => {
    const pathDom = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    pathDom.setAttribute('d', innerPath);
    const totalLength = pathDom.getTotalLength();
    return samples(10).map((t) => {
      const currentLength = transform([0, 1], [0, totalLength])(t);
      const {x, y} = pathDom.getPointAtLength(currentLength);
      return createParticleInfo({x, y, t});
    });
  }, [innerPath]);

  const itemDomRefs = useMemo(() => {
    return innerItemInfoList.map((circleInfo) => {
      return createRef();
    });
  }, [innerItemInfoList]);

  const tl = useMemo(() => {
    return gsap.timeline({
      paused: true,
      onComplete: () => {
        tl.seek(0);
        tl.pause();
        setAnimating(false);
      },
    });
  }, []);

  useEffect(() => {
    if (!tik) {
      return;
    }
    if (animating) {
      return;
    }
    tl.play();
    setAnimating(true);
  }, [tik]);

  useEffect(() => {
    const pathDom = pathDomRef.current;
    const miniPathDom = miniPathDomRef.current;
    const itemDomList = itemDomRefs.map((itemDomRef) => {
      return itemDomRef.current;
    });
    tl.set(itemDomList, {
      opacity: 0,
      x: (i) => {
        return innerItemInfoList[i].cx;
      },
      y: (i) => {
        return innerItemInfoList[i].cy;
      },
      scale: 0.1,
    })
      .set(miniPathDom, {
        fill: 'none',
      })
      .to(pathDom, {
        duration: 0.6,
        ease: 'power4',
        scale: 1.15,
        transformOrigin: `center center`,
      })
      .set(miniPathDom, {
        fill: 'url(#mini-gradient)',
      })
      .to(itemDomList, {
        duration: 0.4,
        ease: 'power4',
        opacity: 1,
        x: (i) => {
          return outerItemInfoList[i].cx - 2;
        },
        y: (i) => {
          return outerItemInfoList[i].cy - 4;
        },
        scale: 0.2,
        stagger: 0.1,
      })
      .to(itemDomList, {
        duration: 0.2,
        ease: 'sine.out',
        opacity: 0,
        x: (i) => {
          return innerItemInfoList[i].cx;
        },
        y: (i) => {
          return innerItemInfoList[i].cy;
        },
        scale: 0.1,
        stagger: 0.1,
      })
      .set(miniPathDom, {
        fill: 'none',
      })
      .to(pathDom, {
        duration: 0.4,
        ease: 'power4',
        scale: 1,
        transformOrigin: `center center`,
      });
  }, []);

  const handleClick = (e) => {
    setTik(new Date());
  };

  return (
    <motion.svg
      ref={svgDomRef}
      width="300"
      height="300"
      viewBox="0 0 40 40"
      preserveAspectRatio="none"
      onClick={handleClick}
      className={css`
        /* border: 1px solid; */
        :hover {
          cursor: pointer;
        }
      `}
    >
      <filter id="shadow" x1="0%" y1="0%" x2="0%" y2="0%">
        <feDropShadow
          dx="3"
          dy="3"
          stdDeviation="1"
          floodColor="#F24A72"
          floodOpacity="1"
        />
      </filter>
      <defs>
        <linearGradient id="mini-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          {samples(10)
            .map((n) => {
              return {t: n};
            })
            .map((info) => {
              return {
                t: info.t,
                color: interpolate([
                  '#B5EAEA',
                  '#EDF6E5',
                  '#FFBCBC',
                  '#F38BA0',
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
                  stopOpacity={1}
                />
              );
            })}
        </linearGradient>
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
                  stopOpacity={1}
                />
              );
            })}
        </linearGradient>
      </defs>
      <g transform="translate(4 4)">
        <path
          id={`mini-item-${id}`}
          ref={miniPathDomRef}
          d={path}
          fill={`url(#mini-gradient)`}
        />
      </g>
      <g transform="translate(4 4)">
        <path id="item" ref={pathDomRef} d={path} fill={`url(#gradient)`} />
      </g>
      <g transform="translate(4 4)">
        <path id="inneritem" ref={innerDomRef} d={innerPath} fill={`none`} />
      </g>
      <g transform="translate(4 4)">
        <path id="outeritem" ref={outerDomRef} d={outerPath} fill={`none`} />
      </g>
      {innerItemInfoList.map((circleInfo, index) => {
        return (
          <use
            ref={itemDomRefs[index]}
            key={index}
            href={`#mini-item-${id}`}
            opacity={circleInfo.opacity}
            transform={`translate(${circleInfo.cx} ${circleInfo.cy}) scale(${circleInfo.scale})`}
            filter="url(#shadow)"
          />
        );
      })}
    </motion.svg>
  );
};

export {Reaction};
