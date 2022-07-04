import {cx, css} from '@emotion/css';
import {useEffect, useState, useRef, useMemo, useCallback, useId} from 'react';
import * as d3 from 'd3';
import {interpolate} from 'flubber';

const Morph = ({size}) => {
  const id = useId();
  const svgDomRef = useRef(null);
  const pathDomRef = useRef(null);

  const paths = {
    step1: `M 17.352 24.122 C 31.685 -5.294 116.95 15.677 85.721 37.603 C 66.299 51.239 71.047 71.079 70.08 80.846 C 68.017 101.68 29.658 88.662 19.736 69.653 C 13.019 56.787 11.17 36.808 17.352 24.122 Z`,
    step2: `M 40.185 33.49 C 48.118 21.773 59.756 22.799 75.15 38.316 C 86.578 49.835 78.14 65.96 62.042 77.212 C 48.267 86.841 29.623 79.343 21.566 64.069 C 16.111 53.731 33.832 42.873 40.185 33.49 Z`,
    step3: `M 20.164 23.213 C 28.097 11.496 44.54 -0.692 59.934 14.825 C 71.362 26.344 78.14 65.96 62.042 77.212 C 48.267 86.841 29.623 79.343 21.566 64.069 C 16.111 53.731 13.811 32.596 20.164 23.213 Z`,
    step4: `M 17.352 24.122 C 31.685 -5.294 116.95 15.677 85.721 37.603 C 66.299 51.239 71.047 71.079 70.08 80.846 C 68.017 101.68 29.658 88.662 19.736 69.653 C 13.019 56.787 11.17 36.808 17.352 24.122 Z`,
  };

  const pathList = useMemo(() => {
    return Object.entries(paths).map((item) => {
      return item[1];
    });
  }, []);

  useEffect(() => {
    const pathList = Object.entries(paths).map((item) => {
      return item[1];
    });
    const pairs = d3.pairs(pathList);
    const pathDom = pathDomRef.current;
    const doMorph = ({pathDom, pathList, delay}) => {
      d3.select(pathDom)
        .transition()
        .delay(delay)
        .duration(1700)
        .attrTween('d', function (d) {
          return interpolate(pathList[0][0], pathList[0][1], {
            maxSegmentLength: 1,
          });
        })
        .transition()
        .delay(delay)
        .duration(1000)
        .attrTween('d', function (d) {
          return interpolate(pathList[1][0], pathList[1][1], {
            maxSegmentLength: 1,
          });
        })
        .transition()
        .delay(delay)
        .duration(1800)
        .attrTween('d', function (d) {
          return interpolate(pathList[2][0], pathList[2][1], {
            maxSegmentLength: 1,
          });
        })
        .on('end', function () {
          return doMorph({pathDom, pathList, delay});
        });
    };
    doMorph({pathDom, pathList: pairs, delay: 200});
  }, []);

  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-height: 100vh;
        width: 100%;
        max-width: 30rem;
        margin: 0 auto;
      `}
    >
      <svg
        ref={svgDomRef}
        width={size}
        viewBox="0 0 100 100"
        className={css`
          display: block;
        `}
      >
        <g>
          <clipPath id={`morph-${id}`}>
            <path
              ref={pathDomRef}
              d={paths.step1}
              className={css`
                stroke-linejoin: round;
              `}
            />
          </clipPath>
          <image
            clipPath={`url(#morph-${id})`}
            href={`https://media.giphy.com/media/4ilFRqgbzbx4c/giphy.gif`}
            width={'100%'}
            height={'100%'}
          ></image>
        </g>
      </svg>
    </div>
  );
};

export {Morph};
