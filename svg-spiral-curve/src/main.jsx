import {createRoot} from 'react-dom/client';
import {cx, css} from '@emotion/css';
import {useEffect, useState, useRef, useMemo} from 'react';
import {samples, interpolate, formatHex} from 'culori';

import * as d3 from 'd3';

const App = () => {
  useEffect(() => {
    const width = 300,
      height = 300,
      start = 0,
      end = 1,
      spiralCount = 3;
    const theta = (r) => {
      return spiralCount * 2 * Math.PI * r;
    };

    const r = d3.min([width, height]) / 2;

    const radiusScaler = ({t}) => {
      return d3.scaleLinear().domain([start, end]).range([0, r])(t);
    };

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const points = d3.range(start, end, (end - start) / 100);
    const spiral = d3
      .radialLine()
      .curve(d3.curveCardinal)
      .angle(function (d) {
        return theta(d);
      })
      .radius(function (d) {
        return radiusScaler({t: d});
      });

    const path = svg
      .append('path')
      .datum(points)
      .attr('id', 'spiral')
      .attr('d', function (d) {
        console.log(spiral(d));
        return spiral(d);
      })
      .style('fill', 'none')
      .style('stroke', '#000');

    const spiralLength = path.node().getTotalLength();
    const niceData = samples(10).map((t, index) => {
      return {id: index, t};
    });

    const circleRadiusScaler = d3.scaleLinear().domain([0, 1]).range([3, 10]);

    const timeScale = d3
      .scaleLinear()
      .domain(
        d3.extent(
          niceData.map((d) => {
            return d.id;
          })
        )
      )
      .range([0, spiralLength]);

    const circleInfoList = niceData.map((d) => {
      const linePer = timeScale(d.id);
      const {x, y} = path.node().getPointAtLength(linePer);
      const r = circleRadiusScaler(d.t);
      return {x, y, r};
    });

    console.log(circleInfoList);

    svg
      .selectAll('circle')
      .data(niceData)
      .enter()
      .append('circle')
      .attr('cx', function (d, i) {
        const linePer = timeScale(d.id);
        const {x, y} = path.node().getPointAtLength(linePer);
        d.cx = x;
        d.cy = y - 20;
        return d.cx;
      })
      .attr('cy', function (d, i) {
        return d.cy;
      })
      .attr('r', function (d, i) {
        return circleRadiusScaler(d.t);
      });
  }, []);

  return (
    <div
      id="chart"
      className={css`
        display: grid;
        place-items: center;
        width: 100%;
      `}
    ></div>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
