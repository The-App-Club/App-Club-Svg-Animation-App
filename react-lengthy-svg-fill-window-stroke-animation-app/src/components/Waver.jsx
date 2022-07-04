import {cx, css} from '@emotion/css';
import styled from '@emotion/styled';
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

const Waver = () => {
  const strokesDomRef = useMemo(() => {
    return [...Array(4).keys()].map((n) => {
      return createRef();
    });
  }, []);

  const tl = useMemo(() => {
    return TweenRex({
      onFinish: function () {
        tl.restart();
      },
    });
  }, []);

  useEffect(() => {
    const strokeDomList = strokesDomRef.map((strokeDomRef) => {
      return strokeDomRef.current;
    });

    const targets = Lengthy(strokeDomList);

    const tweens = targets.map((target) => {
      target.el.style.strokeDasharray = target.length;
      return {
        duration: 3000,
        subscribe: tweenrex.interpolate({
          targets: target.el,
          strokeWidth: [2, 4, 2],
          strokeDashoffset: [target.length, -target.length],
        }),
      };
    });
    tl.add(tweens, {stagger: 500});
    tl.restart();
  }, []);

  return (
    <svg
      viewBox="0 0 50 22"
      className={css`
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        margin: auto;

        .stripe {
          stroke-width: 2;
          stroke-linecap: round;
        }
      `}
    >
      <defs>
        <path id="p" d="M -2 2 Q 12 11 26 2 T 54 2" fill="none" />
      </defs>
      <use
        ref={strokesDomRef[0]}
        className="stripe"
        href="#p"
        stroke="#3C3B5C"
        y="4"
      />
      <use
        ref={strokesDomRef[0]}
        className="stripe"
        href="#p"
        stroke="#3C3B5C"
        y="4"
      />
      <use
        ref={strokesDomRef[1]}
        className="stripe"
        href="#p"
        stroke="#D53939"
        y="8"
      />
      <use
        ref={strokesDomRef[2]}
        className="stripe"
        href="#p"
        stroke="#FFB563"
        y="12"
      />
      <use
        ref={strokesDomRef[3]}
        className="stripe"
        href="#p"
        stroke="#7B3C59"
        y="16"
      />
    </svg>
  );
};

export {Waver};
