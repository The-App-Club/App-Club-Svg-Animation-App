import {createRoot} from 'react-dom/client';
import {useCallback, useEffect, useRef, useState, useMemo} from 'react';
import {default as Snap} from 'snapsvg';
import {css} from '@emotion/css';
import {transform} from 'framer-motion';
import {tidy, summarize, sum, groupBy, mutate} from '@tidyjs/tidy';
import './styles/index.scss';
import {generatePath} from './plugins/generatePath';
import data from './assets/data.json';

const originalPath = `M-166.32,29.68C-140.90,56.30-118.49,52.20-82.49,54.56C-67.36,55.56-52.56,60.13-38.44,66.13C-24.33,72.12-11.94,87.23-14.08,103.63C-16.55,122.55-35.44,132.49-51.82,139.20C-77.40,149.71-102.96,160.19-128.53,170.65C-145.31,177.52-164.09,186.56-169.70,205.16C-176.70,228.40-157.96,252.47-137.03,261.22C-116.10,269.97-92.85,269.14-71.21,275.51C-49.57,281.90-27.53,299.97-27.80,324.43C-28.08,349.03-50.52,366.42-72.16,373.29C-93.80,380.17-117.44,381.25-136.78,393.89C-150.14,402.64-161.09,420.29-155.37,436.11C-148.44,455.31-124.66,456.79-105.75,457.22C-90.80,457.56-75.45,459.38-62.23,467.02C-49.02,474.66-38.30,489.18-38.03,505.49C-37.67,527.82-56.16,545.37-75.20,553.47C-94.25,561.60-115.26,563.81-133.58,573.73C-141.42,577.99-148.95,584.01-152.53,592.73C-157.92,605.89-152.53,622.17-142.47,631.49C-132.41,640.80-118.79,644.27-105.61,644.87C-87.77,645.69-69.71,641.91-52.14,645.35C-34.57,648.82-16.62,662.79-16.00,682.28C-15.26,705.49-37.63,720.38-56.92,730.15C-76.54,740.07-96.17,749.99-115.79,759.93C-130.31,767.29-146.94,777.88-147.74,795.30C-148.33,808.31-139.03,819.82-128.16,825.19C-117.30,830.56-105.06,831.12-93.16,832.15C-75.31,833.68-56.57,836.78-42.53,848.91C-28.48,861.04-21.50,884.93-32.09,900.70C-40.63,913.43-69.56,930.70-83.13,936.16C-115.86,949.34-143.48,963.12-175.75,967.66`;

const App = () => {
  const padding = 10;
  const originalSvgDomRef = useRef(null);
  const clampedSvgDomRef = useRef(null);
  const [resized, setResized] = useState(null);
  const [maxWidth, setMaxWidth] = useState(window.innerWidth);
  const [maxHeight, setMaxHeight] = useState(window.innerHeight * 11);

  const handleResize = useCallback(() => {
    setResized(new Date());
    setMaxWidth(window.innerWidth);
    setMaxHeight(window.innerHeight * 11);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resized]);

  const getPathBoundingBox = useCallback(({path}) => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svgDom = document.createElementNS(svgNS, 'svg');
    const pathDom = document.createElementNS(svgNS, 'path');
    pathDom.setAttributeNS(null, 'd', path);
    svgDom.appendChild(pathDom);
    document.body.appendChild(svgDom);
    const result = pathDom.getBBox();
    svgDom.remove();
    return result;
  }, []);

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

    const viewbox = `${xMin - padding} ${yMin - padding} ${
      xMax - xMin + padding * 2
    } ${yMax - yMin + padding * 2}`;

    dom.setAttribute('viewBox', viewbox);
  }, []);

  useEffect(() => {
    // const originalSvgDom = originalSvgDomRef.current;
    const clampedSvgDom = clampedSvgDomRef.current;
    // svgFit({ dom: originalSvgDom });
    svgFit({dom: clampedSvgDom});
  }, [resized]);

  return (
    <div
      className={css`
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
      `}
    >
      {/* <svg
        ref={originalSvgDomRef}
        className={css`
          display: block;
          width: 50%;
        `}
      >
        <g>
          <path
            d={originalPath}
            fill="none"
            stroke="#000000"
            strokeWidth={10}
          />
        </g>
      </svg> */}
      <svg
        ref={clampedSvgDomRef}
        className={css`
          display: block;
          width: 100%;
        `}
      >
        <g>
          <path d={clampedPath} fill="none" stroke="#ff0000" strokeWidth={10} />
        </g>
      </svg>
    </div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
