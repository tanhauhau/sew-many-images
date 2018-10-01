'use strict';

var _index = require('./index');

test('calcBackgroundPos', function () {
  expect((0, _index.calcBackgroundPos)(1, 102, 100, 1)).toBe(50);
});

test('calcBackgroundAxis', function () {
  expect((0, _index.calcBackgroundAxis)(100, 100)).toBe(100);
});

test('overlaps', function () {
  expect((0, _index.overlaps)({
    x1: 0, y1: 0, x2: 2, y2: 2
  }, {
    x1: 3, y1: 3, x2: 4, y2: 4
  }, 0)).toBe(false);
  expect((0, _index.overlaps)({
    x1: 0, y1: 0, x2: 2, y2: 2
  }, {
    x1: 0, y1: 0, x2: 4, y2: 4
  }, 0)).toBe(true);
});

test('isCollide', function () {
  var currBoxes = [{
    x1: 0, y1: 0, x2: 2, y2: 2
  }];
  var newBox = {
    x1: 3, y1: 3, x2: 4, y2: 4
  };
  var pad = 0;
  expect((0, _index.isCollide)(currBoxes, newBox, pad)).toBe(false);
  currBoxes.push({
    x1: 3, y1: 3, x2: 4, y2: 4
  });
  expect((0, _index.isCollide)(currBoxes, newBox, pad)).toBe(true);
});

test('calculatePlacements', function () {
  var currBoxes = [{
    width: 10,
    height: 10
  }, {
    width: 10,
    height: 10
  }, {
    width: 20,
    height: 20
  }];
  var expected = {
    boxes: [{
      x1: 2, x2: 12, y1: 2, y2: 12
    }, {
      x1: 18, x2: 28, y1: 2, y2: 12
    }, {
      x1: 2, x2: 22, y1: 16, y2: 36
    }],
    maxHeight: 36,
    maxWidth: 32
  };
  expect((0, _index.calculatePlacements)(currBoxes, 2)).toEqual(expected);
});