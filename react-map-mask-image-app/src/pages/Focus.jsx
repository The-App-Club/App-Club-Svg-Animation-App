import {css} from '@emotion/css';
import {Link, useLocation} from 'react-router-dom';
import {Layout} from '../layouts/default';
import {useEffect, useRef, useState} from 'react';
import {Spacer} from '../components/Spacer';
const Focus = ({}) => {
  const svgDomRef = useRef(null);
  const imageDomRef = useRef(null);
  const {state} = useLocation();

  useEffect(() => {
    const svgDom = svgDomRef.current;
    const elem = svgDom.firstElementChild;
    const {x, y, width, height} = elem.getBBox();
    const {xMin, xMax, yMin, yMax} = [...svgDom.children].reduce(
      (acc, elem) => {
        const {x, y, width, height} = elem.getBBox();
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

    svgDom.setAttribute('viewBox', viewbox);
  }, []);

  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      {[...Array(2)].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <div
        className={css`
          display: flex;
          align-items: center;
          gap: 1rem;
        `}
      >
        <h2>{`Focus`}</h2>
        <Link to={'/'}>home</Link>
      </div>
      {[...Array(1)].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <Layout>
        <div
          className={css`
            display: flex;
            justify-content: center;
            align-items: center;
            @media (max-width: 768px) {
              flex-direction: column;
            }
            gap: 1rem;
            max-width: 1200px;
            width: 100%;
            border: 1vmin solid rgba(174, 226, 238, 1);
            border-image-slice: 1;
            border-image-source: linear-gradient(
              90deg,
              #eeddae 52%,
              #fad27c 100%
            );
            padding: 2rem;
          `}
        >
          <div
            className={css`
              width: 100%;
              height: 50vmin;
            `}
          >
            <svg
              ref={svgDomRef}
              width={'100%'}
              height={'100%'}
              preserveAspectRatio="xMidYMid meet"
            >
              <g>
                <path stroke={'black'} strokeWidth={1} d={state.path} />
              </g>
            </svg>
          </div>
          <div
            className={css`
              display: flex;
              align-items: center;
              flex-direction: column;
              gap: 1rem;
            `}
          >
            <p>{state.description}</p>
            <div
              className={css`
                max-width: 60%;
                width: 100%;
              `}
            >
              <img
                className={css`
                  max-width: 100%;
                  width: 100%;
                  display: block;
                `}
                src={state.imageURL}
                alt={``}
              />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export {Focus};
