#!/usr/bin/env node
import { packImages } from './src';

const path = require('path');
const minimist = require('minimist');

export function genSprite() {
  const argv = minimist(process.argv);
  // console.log(argv, process.cwd());
  const givenDirectory = argv.from || '';
  const calleeDirectory = process.cwd();
  const outputName = 'testImage.png';
  const padding = 10;

  packImages(path.resolve(calleeDirectory, givenDirectory), outputName, padding);
}

genSprite();
