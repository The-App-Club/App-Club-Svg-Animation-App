import {createRoot} from 'react-dom/client';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {default as Snap} from 'snapsvg';
import {css} from '@emotion/css';
import {transform} from 'framer-motion';
import {tidy, summarize, sum, groupBy, mutate} from '@tidyjs/tidy';
import './styles/index.scss';
import {generatePath} from './plugins/generatePath';
import data from './assets/data.json';

const App = () => {
  const svgDomRef = useRef(null);
  const [resized, setResized] = useState(null);
  const [maxWidth, setMaxWidth] = useState(window.innerWidth);
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 3);

  const handleResize = useCallback(() => {
    setResized(new Date());
    setMaxWidth(window.innerWidth);
    setMaxHeight(window.innerHeight * 3);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resized]);

  const isPortrait = useCallback(({width, height}) => {
    return height > width;
  }, []);

  const getDomain = useCallback((data, key) => {
    const {min, max} = data.reduce(
      (acc, row) => {
        return {
          min: Math.min(acc.min, row[key]),
          max: Math.max(acc.max, row[key]),
        };
      },
      {min: Infinity, max: -Infinity}
    );
    return {min, max};
  }, []);

  const clampnaize = useCallback(({data, maxWidth, maxHeight}) => {
    const {min: minX, max: maxX} = getDomain(data, `x`);
    const {min: minY, max: maxY} = getDomain(data, `y`);
    const clampedPointList = [];
    for (let index = 0; index < data.length; index++) {
      const item = data[index];
      const resultInfo = {
        ...item,
        x: transform(
          [minX, maxX],
          [minX * (maxWidth / (maxX - minX)), maxX * (maxWidth / (maxX - minX))]
        )(item.x).toFixed(2),
        y: transform(
          [minY, maxY],
          [
            minY * (maxHeight / (maxY - minY)),
            maxY * (maxHeight / (maxY - minY)),
          ]
        )(item.y).toFixed(2),
      };
      clampedPointList.push(resultInfo);
    }
    return clampedPointList;
  }, []);

  const clampedPointList = useMemo(() => {
    return clampnaize({
      data,
      maxWidth,
      maxHeight,
    });
  }, [resized, maxWidth, maxHeight]);

  const cowboy = useMemo(() => {
    return tidy(
      clampedPointList,
      groupBy(
        ['group'],
        [mutate({key: (d) => `\${d.group}`})],
        groupBy.object() // <-- specify the export
      )
    );
  }, [clampedPointList]);

  const clampedPath = useMemo(() => {
    return Object.entries(cowboy)
      .map(([k, v]) => {
        let path = `${v[0].command}`;
        path =
          path +
          v
            .map((item) => {
              return `${item.x},${item.y}`;
            })
            .join('');
        return path;
      })
      .join('');
  }, [cowboy]);

  const svgFit = useCallback(({dom, maxWidth, maxHeight}) => {
    const {xMin, xMax, yMin, yMax} = [...dom.children].reduce(
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
      {xMin: Infinity, yMin: Infinity, xMax: -Infinity, yMax: -Infinity}
    );

    const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;

    dom.setAttribute('viewBox', viewbox);
  }, []);

  useEffect(() => {
    const clampedSvgDom = svgDomRef.current;
    svgFit({dom: clampedSvgDom});
  }, [resized]);

  return (
    <svg
      ref={svgDomRef}
      className={css`
        display: block;
        width: ${maxWidth}px;
        height: ${maxHeight}px;
      `}
    >
      <g>
        <path d={clampedPath} fill="none" stroke="#ff0000" strokeWidth={10} />
      </g>
    </svg>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
