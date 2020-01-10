import { generate2DPositions, shufflePairsArray } from './utils.js';

describe('shuffle pairs', () => {
  test('should not mix positions', () => {
    const run = (x, y) => {
      const positions = generate2DPositions(x, y);
      const seen = [];
      const len = x * y * 2;
      expect(positions).toHaveLength(len);

      for (let i = 0; i < positions.length - 1; i += 2) {
        const p1 = positions[i];
        const p2 = positions[i + 1];

        expect(seen.every((pair) => pair[0] !== p1 || pair[1] !== p2)).toBeTruthy();
        seen.push([p1, p2]);
      }
    };
    let testNum = 0;
    while (testNum < 5) {
      testNum++;
      run(4, 4);
    }
  });
});
