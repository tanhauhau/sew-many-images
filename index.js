#!/usr/bin/env node
import { packImages } from './src';

const path = require('path');
const minimist = require('minimist');
const rootPath = require('app-root-path');
const CRC32 = require('crc-32');

export default function genSprite() {
  const argv = minimist(process.argv);
  const outputName = argv.out || argv.o || 'sprite.png';
  const padding = argv.pad || argv.p || 10;
  const generateHtml = argv.generateHtml || argv.gh || false;
  const generateReact = argv.generateReact || argv.gr || true;
  const styleName = argv.styleName || argv.s || 'style.scss';

  const reactPrefix = argv.reactPrefix || argv.r || 'image';

  // generate prefix
  const givenDirectory = argv.from || argv.f || '';
  const calleeDirectory = process.cwd();
  const imagesDirectory = path.resolve(calleeDirectory, givenDirectory);
  const relativePath = path.relative(rootPath.path, imagesDirectory);

  // we use crc32 as it will produce vastly different checksums on minorly different strings
  // base 36: 0-9 a-z, shortest possible representation of the crc32
  const crc = CRC32.str(relativePath).toString(36);
  const stylePrefix = argv.stylePrefix || `p${crc}`;
  const indentSp = '  ';
  // todo: find a better default style prefix
  packImages({
    folderDir: imagesDirectory,
    reactPrefix,
    outputName,
    padding,
    generateHtml,
    generateReact,
    styleName,
    stylePrefix,
    indentSp,
  });
}

genSprite();
