import {cx, css} from '@emotion/css';
import styled from '@emotion/styled';
import {Slider} from '@mui/material';
import {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useId,
  createRef,
} from 'react';
import {samples} from 'culori';
import {default as Lengthy} from 'lengthy-svg';
import {default as chroma} from 'chroma-js';

const Waver = ({colorList, count = 10, delay}) => {
  const [size, setSize] = useState(300);

  const handleResize = (e) => {
    setSize(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const id = useId();
  const svgDomRef = useRef(null);
  const pathDomRef = useRef(null);

  const stripesDomRef = useMemo(() => {
    return [...Array(10).keys()].map((n) => {
      return createRef();
    });
  }, []);

  const tl = useMemo(() => {
    return TweenRex({
      onFinish: () => {
        tl.restart();
      },
    });
  }, []);
  useEffect(() => {
    const stripeDomList = stripesDomRef.map((stripeDomRef) => {
      return stripeDomRef.current;
    });
    const targets = Lengthy(stripeDomList);
    const tweens = targets.map((target) => {
      target.el.style.strokeDasharray = target.length;
      return {
        duration: 3000,
        subscribe: tweenrex.interpolate({
          targets: target.el,
          strokeWidth: [2, 3, 4, 3, 2],
          strokeDashoffset: [target.length, -target.length],
        }),
      };
    });
    tl.add(tweens, {stagger: delay});
    tl.restart();
  }, [delay]);

  return (
    <svg
      width={size}
      viewBox="0 0 100 100"
      className={css`
        display: block;
        border: 1px solid;
      `}
    >
      <defs>
        <path id="p" d="M 0 0 Q 25 20 50 0 T 100 0" fill="none" />
      </defs>
      {samples(count).map((t, index) => {
        const strokeColor = chroma.scale(colorList).mode('lab')(t).toString();
        return (
          <use
            ref={stripesDomRef[index]}
            key={index}
            className={css`
              stroke-width: 2;
              stroke-linecap: round;
            `}
            href="#p"
            stroke={strokeColor}
            y={`${t * 100}%`}
          />
        );
      })}
    </svg>
  );
};

export {Waver};
