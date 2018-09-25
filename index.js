#!/usr/bin/env node
import { packImages } from './src';

const path = require('path');
const minimist = require('minimist');
const CRC32 = require('crc-32');

let rootPath = { path: '' };

try {
  require.resolve('app-root-path');
  rootPath = require('app-root-path');// eslint-disable-line global-require
} catch (e) {
  console.error('app-root-path not installed');
}

const help = `
output image name: --out -o
padding between images: --pad -p
generate html file (for human verification default false): --genHtml --gh
generate react file (default true): --genReact --gr
stylesheet name (default 'style.scss'): --styleName -s
react component prefix (default 'image'): --reactPrefix -r
directory of images to stitch: --from -f
css class prefix (default is crc32-base36 of image directory (with prefix 'p')): --stylePrefix
css class indent rules with (default two spaces '  '): --indentSp
output directory same as images (default false (current working directory)): --dir -d
`;

export default function genSprite() {
  const argv = minimist(process.argv);
  if (argv.help) {
    console.log(help);
    return;
  }
  const outputName = argv.out || argv.o || 'sprite.png';
  const padding = argv.pad || argv.p || 10;
  const generateHtml = argv.genHtml || argv.gh;
  let generateReact = true;
  if (argv.genReact !== undefined) { generateReact = argv.genReact; }
  if (argv.gr !== undefined) { generateReact = argv.gr; }
  const styleName = argv.styleName || argv.s || 'style.scss';
  const reactPrefix = argv.reactPrefix || argv.r || 'image';
  const outputDir = argv.dir || argv.d || false;

  // generate prefix
  const givenDirectory = argv.from || argv.f || '';
  const calleeDirectory = process.cwd();
  const imagesDirectory = path.resolve(calleeDirectory, givenDirectory);
  const relativePath = path.relative(rootPath.path, imagesDirectory);

  // we use crc32 as it will produce vastly different checksums on minorly different strings
  // base 36: 0-9 a-z, shortest possible representation of the crc32
  const crc = CRC32.str(relativePath).toString(36);
  const stylePrefix = argv.stylePrefix || `p${crc}`;
  const indentSp = argv.indentSp || '  ';
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
    outputDir,
  });
}

genSprite();
