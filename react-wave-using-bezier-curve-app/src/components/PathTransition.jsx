import {css} from '@emotion/css';
import {useRef, useEffect, useState, useCallback} from 'react';
import * as d3 from 'd3';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {interpolatePath} from 'd3-interpolate-path';
import {transform} from 'framer-motion';
import {samples, interpolate, formatHex} from 'culori';
import easing from 'bezier-easing';
import * as turf from '@turf/turf';

const size = 50;

const makeGradient = (step, interpolateColor) => {
  const bezier = easing(0, 0, 0.18, 0.99);
  const result = samples(step)
    .map(bezier)
    .map(transform([0, 1], [0.1, 0.9]))
    .map((t) => {
      return {t, color: interpolateColor(t)};
    })
    .map((info) => {
      return {...info, color: formatHex(info.color)};
    });
  return result;
};

const makePath = ({coordinates}) => {
  const pathInfoList = [];
  let id = 0;
  let path = `M ${coordinates[0][0] * size},${coordinates[0][1] * size}`;
  for (let i = 1; i < coordinates.length; i++) {
    path = path + ` L ${coordinates[i][0] * size},${coordinates[i][1] * size}`;
  }
  path = path + ` Z`;
  return path;
};

const polygon = turf.polygon([
  [
    [6.043073357781111, 50.128051662794235],
    [6.242751092156993, 49.90222565367873],
    [6.186320428094177, 49.463802802114515],
    [5.897759230176405, 49.44266714130703],
    [5.674051954784829, 49.529483547557504],
    [5.782417433300906, 50.09032786722122],
    [6.043073357781111, 50.128051662794235],
  ],
]);
const original = makePath({coordinates: polygon.geometry.coordinates.flat()});
const smoothed = turf.polygonSmooth(polygon, {iterations: 3});
const morph = makePath({
  coordinates: smoothed.features[0].geometry.coordinates.flat(),
});

const width = 300;
const height = 350;

const data = {
  a: `${original}`,
  b: `${morph}`,
};

const PathTransition = ({tik}) => {
  const svgDomRef = useRef();
  const wrapperRef = useRef();
  const stageDomRef = useRef();
  const pathDomRef = useRef();
  const dimensions = useResizeObserver({ref: wrapperRef});

  const niceMorph = useCallback(({dPath1, dPath2}) => {
    d3.select(pathDomRef.current)
      .transition()
      .delay(300)
      .duration(1000)
      .attrTween('d', function (d) {
        return interpolatePath(dPath1, dPath2);
      })
      .transition()
      .delay(300)
      .duration(1000)
      .attrTween('d', function (d) {
        return interpolatePath(dPath2, dPath1);
      });
  }, []);

  useEffect(() => {
    const {a: dPath1, b: dPath2} = data;
    niceMorph({dPath1, dPath2});
  }, [tik]);

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

  const gradientInfoList = makeGradient(
    5,
    interpolate([
      '#FDFCE5',
      '#FED1EF',
      '#E8F9FD',
      '#FFEDED',
      '#E8F9FD',
      '#F4BFBF',
    ])
  );

  return (
    <div
      ref={wrapperRef}
      className={css`
        width: 100%;
      `}
    >
      <svg
        ref={svgDomRef}
        className={css`
          width: 100%;
          display: block;
          /* border: 1px solid; */
        `}
      >
        <g ref={stageDomRef}>
          <defs>
            <linearGradient id="bebop" x1="0" x2="1" y1="0" y2="1">
              {gradientInfoList.map(({t, color}, index) => {
                return <stop key={index} offset={t} stopColor={color}></stop>;
              })}
            </linearGradient>
          </defs>
          {/* ステージにjustfitさせるため、初期パスコマンドは設定しておく  */}
          <path
            ref={pathDomRef}
            strokeWidth={0.2}
            stroke="transparent"
            fill={`url(#bebop)`}
            d={original}
          />
        </g>
      </svg>
    </div>
  );
};

export {PathTransition};
