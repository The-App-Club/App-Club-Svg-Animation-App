import { createRoot } from "react-dom/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { default as Snap } from "snapsvg";
import { css } from "@emotion/css";

import "./styles/index.scss";

const App = () => {
  const svgDomRef = useRef(null);
  const pathDomRef = useRef(null);
  const [pathPointList, setPathPointList] = useState([]);
  const convertSegmentToPoint = useCallback(
    (segment = [], resultList, group) => {
      const command = segment.shift();
      for (let i = 0; i < segment.length; i += 2) {
        const point = {
          x: segment[i],
          y: segment[i + 1],
          command,
          group,
        };
        resultList.push(point);
      }
    },
    []
  );

  useEffect(() => {
    const pathString = pathDomRef.current.getAttribute("d");
    const pathCubic = Snap.path.toCubic(pathString);
    const resultList = [];
    let group = 1;
    for (let i = 0; i < pathCubic.length; i++) {
      const segment = pathCubic[i];
      console.log(segment);
      convertSegmentToPoint(segment, resultList, group);
      group = group + 1;
    }
    setPathPointList(resultList);
  }, []);

  useEffect(() => {
    const svg = svgDomRef.current;

    const { xMin, xMax, yMin, yMax } = [...svg.children].reduce(
      (acc, el) => {
        const { x, y, width, height } = el.getBBox();
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
      { xMin: 0, yMin: 0, xMax: window.innerWidth, yMax: window.innerHeight }
    );

    const viewbox = `${xMin} ${yMin} ${xMax - xMin} ${yMax - yMin}`;

    svg.setAttribute("viewBox", viewbox);
  }, []);

  return (
    <div
      className={css`
        display: flex;
      `}
    >
      <svg
        ref={svgDomRef}
        className={css`
          display: block;
          width: 100%;
        `}
      >
        <g>
          <path
            ref={pathDomRef}
            d="M-332.649,118.7c50.857,106.481,95.67,90.117,167.673,99.549,30.264,3.977,59.853,22.274,88.088,46.252s53.009,84.435,48.726,150.005C-33.1,490.19-70.883,529.964-103.648,556.784q-76.716,63.07-153.412,125.8c-33.563,27.5-71.122,63.639-82.331,138.073-14.015,92.958,23.462,189.211,65.324,224.212s88.375,31.706,131.651,57.161c43.276,25.569,87.351,97.844,86.818,195.689-.553,98.412-45.448,167.96-88.724,195.461s-90.568,31.819-129.233,82.389c-26.72,35-48.624,105.572-37.19,168.87,13.872,76.821,61.43,82.73,99.235,84.435,29.9,1.363,60.611,8.636,87.043,39.206s47.866,88.639,48.4,153.869c.717,89.321-36.248,159.551-74.339,191.939-38.092,32.5-80.118,41.365-116.755,81.026-15.675,17.046-30.736,41.138-37.907,76.025-10.778,52.616,0,117.732,20.122,155.005s47.374,51.138,73.725,53.525c35.674,3.3,71.8-11.819,106.94,1.932,35.141,13.864,71.04,69.775,72.29,147.732,1.475,92.844-43.276,152.392-81.859,191.484q-58.859,59.491-117.738,119.1c-29.035,29.433-62.291,71.821-63.889,141.482-1.188,52.047,17.417,98.072,39.157,119.549,21.72,21.478,46.206,23.75,70,27.842,35.694,6.137,73.171,18.523,101.264,67.048s42.046,144.1,20.88,207.166c-17.089,50.911-74.954,120-102.083,141.823-65.467,52.729-120.709,107.845-185.234,126.027"
            fill="none"
            stroke="#000000"
            strokeWidth={10}
          />
        </g>
      </svg>
      <div>
        <pre>
          <code>{JSON.stringify(pathPointList, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

const container = document.getElementById("root");

const root = createRoot(container);

root.render(<App />);
