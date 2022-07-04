import {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
  createRef,
} from 'react';
import easing from 'bezier-easing';
import bezierSpline from '@freder/bezier-spline';
import 'array-each-slice';
import {samples, interpolate, formatHex} from 'culori';
import {css} from '@emotion/css';
import * as d3 from 'd3';
import {interpolatePath} from 'd3-interpolate-path';

const Wave = ({width, height, segmentCount, layerCount, variance}) => {
  const pathDomRef = useRef();

  const computeControlPoints = useCallback((curvePoints, key) => {
    const points = bezierSpline.getControlPoints(curvePoints).eachSlice(2);
    const p1list = [];
    const p2list = [];
    points.map((p) => {
      p1list.push(p[0][key]);
    });
    points.map((p) => {
      p2list.push(p[1][key]);
    });
    return {p1: p1list, p2: p2list};
  }, []);

  const generateClosedPath = useCallback(
    (curvePoints, leftCornerPoint, rightCornerPoint) => {
      const xPoints = curvePoints.map((p) => {
        return p[0];
      });
      const yPoints = curvePoints.map((p) => {
        return p[1];
      });
      const xControlPoints = computeControlPoints(curvePoints, 0);
      const yControlPoints = computeControlPoints(curvePoints, 1);
      let path =
        `M ${leftCornerPoint[0]},${leftCornerPoint[1]} ` +
        `C ${leftCornerPoint[0]},${leftCornerPoint[1]} ` +
        `${xPoints[0]},${yPoints[0]} ` +
        `${xPoints[0]},${yPoints[0]} `;
      for (let i = 0; i < xPoints.length - 1; i++) {
        path +=
          `C ${xControlPoints.p1[i]},${yControlPoints.p1[i]} ` +
          `${xControlPoints.p2[i]},${yControlPoints.p2[i]} ` +
          `${xPoints[i + 1]},${yPoints[i + 1]} `;
      }
      path +=
        `C ${xPoints[xPoints.length - 1]},${yPoints[xPoints.length - 1]} ` +
        `${rightCornerPoint[0]},${rightCornerPoint[1]} ` +
        `${rightCornerPoint[0]},${rightCornerPoint[1]} Z`;
      return path;
    },
    []
  );

  const generatePoints = ({
    width,
    height,
    segmentCount,
    layerCount,
    variance,
  }) => {
    const cellWidth = width / segmentCount;
    const cellHeight = height / layerCount;
    const moveLimitX = cellWidth * variance * 0.5;
    const moveLimitY = cellHeight * variance;
    const points = [];
    for (let y = cellHeight; y <= height; y += cellHeight) {
      const pointsPerLayer = [];
      pointsPerLayer.push([0, Math.floor(y), 0]);
      for (let x = cellWidth; x < width; x += cellWidth) {
        const varietalY = y - moveLimitY / 2 + Math.random() * moveLimitY;
        const varietalX = x - moveLimitX / 2 + Math.random() * moveLimitX;
        pointsPerLayer.push([Math.floor(varietalX), Math.floor(varietalY), 0]);
      }
      pointsPerLayer.push([width, Math.floor(y), 0]);
      points.push(pointsPerLayer);
    }
    return points;
  };
  const points = useMemo(() => {
    return generatePoints({
      width,
      height,
      segmentCount,
      layerCount,
      variance,
    });
  }, []);

  const pathList = useMemo(() => {
    const resultList = [];
    for (let i = 0; i < points.length; i++) {
      const path = generateClosedPath(
        points[i],
        [0, height, 0],
        [width, height, 0]
      );
      resultList.push(path);
    }
    return resultList;
  }, [points, width, height]);

  const niceMorph = useCallback(({pathDom, dPath1, dPath2}) => {
    d3.select(pathDom)
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

  const pathPairList = useMemo(() => {
    return d3.pairs(pathList);
  }, [pathList]);

  const pathDomRefs = useMemo(() => {
    return pathPairList.map((n) => {
      return createRef();
    });
  }, [pathPairList]);

  useEffect(() => {
    const dataList = pathPairList;
    for (let index = 0; index < dataList.length; index++) {
      const data = dataList[index];
      const pathDom = pathDomRefs[index].current;
      const [dPath1, dPath2] = data;
      niceMorph({pathDom, dPath1, dPath2});
    }
  }, []);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className={css`
        width: 100%;
        height: 100vh;
        display: block;
      `}
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
                  '#1F4690',
                  '#3A5BA0',
                  '#DAEAF1',
                  '#C6DCE4',
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
                  stopOpacity={0.1}
                />
              );
            })}
        </linearGradient>
      </defs>
      <g fill="url(#gradient)">
        {pathList.map((path, index) => {
          return (
            <path
              ref={pathDomRefs[index]}
              key={index}
              vectorEffect={'non-scaling-stroke'}
              d={path}
            />
          );
        })}
      </g>
    </svg>
  );
};

export {Wave};
