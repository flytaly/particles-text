const defaultSettings = {
  size: 30,
  color: 'black',
  weight: 'bold',
  family: 'sans-serif',
  fontface: 'Arial',
  width: 200,
  height: 150,
  paddings: 10,
  canvas: null,
  text: 'text',
};

export default class TextTexture {
  constructor(settings = defaultSettings) {
    const { size, color, weight, family, width, height, canvas, text, fontface, paddings } = { ...defaultSettings, ...settings };

    this.canvas = canvas || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.width = width;
    this.height = height;

    this.canvas.width = width;
    this.canvas.height = height;
    this.paddings = paddings;
    this.size = size;
    this.color = color;
    this.weight = weight;
    this.family = family;
    this.ctx.font = `${this.weight} ${this.size}px ${this.family}`;
    this.fontface = fontface;

    this.text = text;
    this.draw();
  }

  draw() {
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.fitText(0, this.size);

    this.ctx.fillText(this.text, this.width / 2, this.height / 2);
  }

  /* Binary search of the best font size to fit canvas */
  fitText(min, max) {
    if (max - min < 1) {
      return min;
    }
    let resultSize;
    let halfSize = (max + min) / 2;

    this.ctx.font = `${this.weight} ${halfSize}px ${this.family}`;

    const { width } = this.ctx.measureText(this.text);
    if (width > this.width - this.paddings) {
      resultSize = this.fitText(min, halfSize);
    } else {
      resultSize = this.fitText(halfSize, max);
    }

    return resultSize;
  }
}
