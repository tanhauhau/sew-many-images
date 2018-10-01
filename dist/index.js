#!/usr/bin/env node
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = genSprite;

var _src = require('./src');

var path = require('path');
var minimist = require('minimist');
var CRC32 = require('crc-32');

var rootPath = { path: '' };

try {
  require.resolve('app-root-path');
  rootPath = require('app-root-path'); // eslint-disable-line global-require
} catch (e) {
  console.error('app-root-path not installed');
}

var help = '\noutput image name: --out -o\npadding between images: --pad -p\ngenerate html file (for human verification default false): --genHtml --gh\ngenerate react file (default true): --genReact --gr\nstylesheet name (default \'style.scss\'): --styleName -s\nreact component prefix (default \'image\'): --reactPrefix -r\ndirectory of images to stitch: --from -f\ncss class prefix (default is crc32-base36 of image directory (with prefix \'p\')): --stylePrefix\ncss class indent rules with (default two spaces \'  \'): --indentSp\noutput directory same as images (default false (current working directory)): --dir -d\n';

function genSprite() {
  var argv = minimist(process.argv);
  if (argv.help) {
    console.log(help);
    return;
  }
  var outputName = argv.out || argv.o || 'sprite.png';
  var padding = argv.pad || argv.p || 10;
  var generateHtml = argv.genHtml || argv.gh;
  var generateReact = true;
  if (argv.genReact !== undefined) {
    generateReact = argv.genReact;
  }
  if (argv.gr !== undefined) {
    generateReact = argv.gr;
  }
  var styleName = argv.styleName || argv.s || 'style.scss';
  var reactPrefix = argv.reactPrefix || argv.r || 'image';
  var outputDir = argv.dir || argv.d || false;

  // generate prefix
  var givenDirectory = argv.from || argv.f || '';
  var calleeDirectory = process.cwd();
  var imagesDirectory = path.resolve(calleeDirectory, givenDirectory);
  var relativePath = path.relative(rootPath.path, imagesDirectory);

  // we use crc32 as it will produce vastly different checksums on minorly different strings
  // base 36: 0-9 a-z, shortest possible representation of the crc32
  var crc = CRC32.str(relativePath).toString(36);
  var stylePrefix = argv.stylePrefix || 'p' + crc;
  var indentSp = argv.indentSp || '  ';
  (0, _src.packImages)({
    folderDir: imagesDirectory,
    reactPrefix: reactPrefix,
    outputName: outputName,
    padding: padding,
    generateHtml: generateHtml,
    generateReact: generateReact,
    styleName: styleName,
    stylePrefix: stylePrefix,
    indentSp: indentSp,
    outputDir: outputDir
  });
}

genSprite();