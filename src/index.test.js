import {
  calcBackgroundPos, calcBackgroundAxis, overlaps, isCollide, calculatePlacements,
} from './index';

test('calcBackgroundPos', () => {
  expect(calcBackgroundPos(1, 102, 100, 1)).toBe(25);
});

test('calcBackgroundAxis', () => {
  expect(calcBackgroundAxis(100, 100)).toBe(100);
});

test('overlaps', () => {
  expect(overlaps({
    x1: 0, y1: 0, x2: 2, y2: 2,
  }, {
    x1: 3, y1: 3, x2: 4, y2: 4,
  }, 0)).toBe(false);
  expect(overlaps({
    x1: 0, y1: 0, x2: 2, y2: 2,
  }, {
    x1: 0, y1: 0, x2: 4, y2: 4,
  }, 0)).toBe(true);
});

test('isCollide', () => {
  const currBoxes = [{
    x1: 0, y1: 0, x2: 2, y2: 2,
  }];
  const newBox = {
    x1: 3, y1: 3, x2: 4, y2: 4,
  };
  const pad = 0;
  expect(isCollide(currBoxes, newBox, pad)).toBe(false);
  currBoxes.push({
    x1: 3, y1: 3, x2: 4, y2: 4,
  });
  expect(isCollide(currBoxes, newBox, pad)).toBe(true);
});

test('calculatePlacements', () => {
  const currBoxes = [{
    width: 10,
    height: 10,
  }, {
    width: 10,
    height: 10,
  }, {
    width: 20,
    height: 20,
  }];
  const expected = {
    boxes: [{
      x1: 2, x2: 12, y1: 2, y2: 12,
    }, {
      x1: 14, x2: 24, y1: 2, y2: 12,
    }, {
      x1: 26, x2: 46, y1: 2, y2: 22,
    }],
    maxHeight: 22,
    maxWidth: 46,
  };
  expect(calculatePlacements(currBoxes, 2)).toEqual(expected);
});
