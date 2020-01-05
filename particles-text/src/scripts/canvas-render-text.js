const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

let h = 100;
let text = 'HELLO';
ctx.font = `bold ${100}px sans-serif`;
const letterHeight = ctx.measureText('M').width;
const textWidth = ctx.measureText(text).width;

const words = ['JS', 'THREE', 'NODE'];
const maxWidth = words.reduce((acc, word) => {
  const { width } = ctx.measureText(word);
  return width > acc ? width : acc;
}, 0);
h = ctx.measureText('M').width;
canvas.width = maxWidth;
canvas.height = h;
ctx.font = 'bold ' + 100 + 'px sans-serif';
ctx.textAlign = 'center';
document.body.appendChild(canvas);

let time = 0;
function raf() {
  time += 0.01;
  text = words[Math.floor(time % words.length)];
  const currentWidth = ctx.measureText(text).width;

  ctx.clearRect(0, 0, maxWidth, h);
  ctx.fillText(text, maxWidth / 2, h);
  window.requestAnimationFrame(raf);
}

raf();
