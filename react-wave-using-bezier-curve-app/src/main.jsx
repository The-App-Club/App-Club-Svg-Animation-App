import {createRoot} from 'react-dom/client';
import '@fontsource/inter';
import './styles/index.scss';
import {css} from '@emotion/css';
import {useRef, useEffect, useState, useCallback} from 'react';
import {Slider} from '@mui/material';
import {transform} from 'framer-motion';
import * as d3 from 'd3';
import gsap from 'gsap';
import {samples, interpolate, formatHex} from 'culori';
import easing from 'bezier-easing';
import bezierSpline from '@freder/bezier-spline';
import 'array-each-slice';

const App = () => {
  const [progress, setProgress] = useState(0);
  const svgDomRef = useRef(null);

  const handleChange = (e) => {
    setProgress(e.target.value);
  };
  const computeControlPoints = (curvePoints, key) => {
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
  };

  function generateClosedPath(curvePoints, leftCornerPoint, rightCornerPoint) {
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
  }

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
    for (let y = cellHeight; y < height; y += cellHeight) {
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

  const points = generatePoints({
    width: 800,
    height: 600,
    segmentCount: 30,
    layerCount: 10,
    variance: 0.75,
  });

  const pathList = [];
  for (let i = 0; i < points.length; i++) {
    const path = generateClosedPath(points[i], [0, 600, 0], [800, 600, 0]);
    pathList.push(path);
  }
  console.log(pathList.join(''));
  return null;
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
