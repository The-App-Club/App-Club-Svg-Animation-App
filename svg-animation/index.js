function getSvgViewBoxInfo() {
  const svgDom = document.querySelector("svg");
  const viewBoxParams = svgDom
    .getAttribute("viewBox")
    .split(" ")
    .map((param) => {
      return param;
    });
  return {
    viewBox: {
      x: viewBoxParams[0],
      y: viewBoxParams[1],
      width: viewBoxParams[2],
      height: viewBoxParams[3],
    },
  };
}

const svgDom = document.querySelector("svg");
const pathDom = svgDom.querySelector(".path");
const pathDomPosInfo = pathDom.getBoundingClientRect();
svgDom.style.width = `${pathDomPosInfo.width}px`;
svgDom.style.height = `${pathDomPosInfo.height}px`;
svgDom.setAttributeNS(
  "http://www.w3.org/2000/svg",
  "viewBox",
  `0 0 ${pathDomPosInfo.width} ${pathDomPosInfo.height}`
);

const svgViewBoxInfo = getSvgViewBoxInfo();
const maxPathLength = pathDom.getTotalLength();
const objectDom = document.querySelector(".ball");

let currentPathLength = 0;
let reqId;
let previousSvgPoint = pathDom.getPointAtLength(currentPathLength);

let stats;
stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

let parameter = {
  speed: 1500,
};

// https://github.com/GRI-Inc/App-Club-Image-Clean-App/blob/main/image-proportion/index.js#L251
let controllerInfo = {
  "Ball Speed": 1500,
  "Animation Start": startAnimation,
  "Animation Stop": stopAnimation,
};

const gui = new dat.GUI();
gui.width = 300;
gui.add(controllerInfo, "Ball Speed", 1, 10000, 1).onChange((event) => {
  detectChangeParameter(event, "Ball Speed");
});
gui.add(controllerInfo, "Animation Start");
gui.add(controllerInfo, "Animation Stop");

function detectChangeParameter(event, keyName) {
  if (keyName === "Ball Speed") {
    parameter.speed = event;
  }
}

function loop() {
  requestAnimationFrame(loop);
  stats.begin();
  stats.end();
}

loop();

function stopAnimation() {
  cancelAnimationFrame(reqId);
}
function startAnimation() {
  let counter = 0;
  function marquee() {
    function mod(n, m) {
      return ((n % m) + m) % m;
    }
    counter++;
    reqId = requestAnimationFrame(marquee);
    if (mod(counter, 1) + 1 === 1) {
      currentPathLength =
        (currentPathLength + parameter.speed / 1000) % maxPathLength;

      const currentSvgPoint = pathDom.getPointAtLength(currentPathLength);

      const svgDomPosInfo = svgDom.getBoundingClientRect();
      const x =
        (currentSvgPoint.x * svgDomPosInfo.width) /
        svgViewBoxInfo.viewBox.width;
      const y =
        (currentSvgPoint.y * svgDomPosInfo.height) /
        svgViewBoxInfo.viewBox.height;

      const rotation =
        (Math.atan2(
          currentSvgPoint.y - previousSvgPoint.y,
          currentSvgPoint.x - previousSvgPoint.x
        ) *
          180) /
        Math.PI;

      objectDom.style.transform = `translate3d(${x}px, ${y}px, 0) translate3d(-50%, -50%, 0) rotate(${rotation}deg)`;

      previousSvgPoint = currentSvgPoint;
    }
  }
  marquee();
}
