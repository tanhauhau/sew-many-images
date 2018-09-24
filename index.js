#!/usr/bin/env node
import { packImages } from './src';

const path = require('path');
const minimist = require('minimist');

export default function genSprite() {
  const argv = minimist(process.argv);
  const givenDirectory = argv.from || argv.f || '';
  const calleeDirectory = process.cwd();
  const outputName = argv.out || argv.o || 'sprite.png';
  const padding = argv.pad || argv.p || 10;
  const generateHtml = argv.generateHtml || argv.g || false;
  const styleName = argv.styleName || argv.s || 'style.scss';
  const stylePrefix = argv.stylePrefix || (new Date()).getTime();
  const indentSp = '  ';
  // todo: find a better default style prefix
  packImages({
    folderDir: path.resolve(calleeDirectory, givenDirectory),
    outputName,
    padding,
    generateHtml,
    styleName,
    stylePrefix,
    indentSp,
  });
}

genSprite();
