// https://github.com/mattdesl/esmify
// https://github.com/mattdesl/budo
import {parse} from 'extract-svg-path';
import loadSvg from 'load-svg';
import createMesh from 'svg-mesh-3d';
import drawTriangles from 'draw-triangles-2d';

const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

const size = 256;
canvas.width = size;
canvas.height = size;

loadSvg('svg/twitter.svg', (err, svg) => {
  if (err) {
    throw err;
  }
  const svgPath = parse(svg);
  const mesh = createMesh(svgPath, {
    scale: 1,
    simplify: 0.01,
  });
  render(mesh);
});

function render(mesh) {
  // 描画前の状態を保持
  context.clearRect(0, 0, size, size);
  context.save();

  const scale = size / 2;
  context.translate(size / 2, size / 2);
  context.scale(scale, -scale);
  context.beginPath();
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.lineWidth = 2 / scale;
  drawTriangles(context, mesh.positions, mesh.cells);
  context.fillStyle = '#d86c15';
  context.strokeStyle = '#3b3b3b';
  context.fill();
  context.stroke();

  // 描画前の状態をリストアしてもとに戻す
  context.restore();
}

document.body.appendChild(canvas);
