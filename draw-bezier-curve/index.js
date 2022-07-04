function drawBezierCurve(endPointInfoList) {
  function getLineInfo(pointA, pointB) {
    return {
      distance: Math.sqrt(
        Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
      ),
      angle: Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x),
    };
  }

  function getControlPointInfo(previous, current, next, reverse) {
    // When 'current' is the first or last point of the array'previous' or 'next' don't exist. Replace with 'current' ここのハンドリング味噌
    const p = previous || current;
    const n = next || current;

    const o = getLineInfo(p, n);

    // エンド端点側の場合は180度足して向き逆転
    const angle = o.angle + (reverse ? Math.PI : 0);
    const distance = o.distance * smoothing;

    // 極座標変換
    // https://science.shinshu-u.ac.jp/~tiiyama/?page_id=4311
    const x = current.x + Math.cos(angle) * distance;
    const y = current.y + Math.sin(angle) * distance;
    return { x, y };
  }

  function bezierCommand(currentEndPointInfo, currentIndex, endPointInfoList) {
    const startControlPointInfo = getControlPointInfo(
      endPointInfoList[currentIndex - 2],
      endPointInfoList[currentIndex - 1],
      currentEndPointInfo
    );

    const endControlPointInfo = getControlPointInfo(
      endPointInfoList[currentIndex - 1],
      currentEndPointInfo,
      endPointInfoList[currentIndex + 1],
      true
    );
    // https://developer.mozilla.org/ja/docs/Web/SVG/Tutorial/Paths#%E6%9B%B2%E7%B7%9A%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89
    return `C ${startControlPointInfo.x},${startControlPointInfo.y} ${endControlPointInfo.x},${endControlPointInfo.y} ${currentEndPointInfo.x},${currentEndPointInfo.y}`;
  }

  let resultPathCommand = "";
  for (let index = 0; index < endPointInfoList.length; index++) {
    const endPointInfo = endPointInfoList[index];
    if (index === 0) {
      resultPathCommand =
        resultPathCommand + `M ${endPointInfo.x},${endPointInfo.y}`;
    } else {
      resultPathCommand = `${resultPathCommand} ${bezierCommand(
        endPointInfo,
        index,
        endPointInfoList
      )}`;
    }
  }

  return `<path d="${resultPathCommand}" fill="none" stroke="grey" />`;
}

// The smoothing ratio
const smoothing = 0.2;

// この関数の場合曲線を描きたいなら3点以上が必須
const endPointInfoList = [
  { x: 5, y: 45 },
  { x: 60, y: 5 },
  { x: 90, y: 45 },
  { x: 120, y: 10 },
  { x: 150, y: 45 },
  { x: 170, y: 10 },
];

const svgDom = document.querySelector(".workspace");

svgDom.innerHTML = drawBezierCurve(endPointInfoList);
