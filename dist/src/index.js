'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packImages = packImages;
exports.calculatePlacements = calculatePlacements;
exports.isCollide = isCollide;
exports.overlaps = overlaps;
exports.calcBackgroundAxis = calcBackgroundAxis;
exports.calcBackgroundPos = calcBackgroundPos;
var PImage = require('pureimage');
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');

var error = chalk.bold.red;
var warning = chalk.keyword('orange');
var success = chalk.bold.green;

function packImages(inputs) {
  var folderDir = inputs.folderDir,
      outputName = inputs.outputName,
      padding = inputs.padding,
      generateHtml = inputs.generateHtml,
      generateReact = inputs.generateReact,
      styleName = inputs.styleName,
      stylePrefix = inputs.stylePrefix,
      indentSp = inputs.indentSp,
      reactPrefix = inputs.reactPrefix,
      outputDir = inputs.outputDir;

  try {
    fs.readdir(folderDir, function (err, files) {
      if (files) {
        var promises = [];
        for (var i = 0; i < files.length; i += 1) {
          var file = files[i];
          var extension = path.extname(file);
          promises.push(decodeFromStream(path.join(folderDir, file), extension));
        }
        Promise.all(promises).then(function (values) {
          // stitching becomes weird when we map, so we keep the name as a copy
          var withName = values.map(function (value, index) {
            return { bitmap: value, name: files[index] };
          });
          var imagesWithName = withName.filter(function (value) {
            if (value.bitmap.error) {
              console.log(warning(value.bitmap.error));
            }
            return !value.bitmap.error;
          });
          // remove those files that dont work
          var toStitch = values.filter(function (value) {
            return !value.error;
          });
          var writeDir = outputDir ? folderDir : '.';
          stitchImages({
            toStitch: toStitch,
            imagesWithName: imagesWithName,
            padding: padding,
            outputName: outputName,
            generateHtml: generateHtml,
            generateReact: generateReact,
            styleName: styleName,
            stylePrefix: stylePrefix,
            indentSp: indentSp,
            reactPrefix: reactPrefix,
            writeDir: writeDir
          });
          return true;
        }).catch(function (err2) {
          return console.log(error(err2));
        });
      } else {
        console.log(error(err));
      }
    });
  } catch (e) {
    console.log(error(e));
  }
}

// create read streams depending on file extension
function decodeFromStream(filePath, extension) {
  switch (extension) {
    case '.jpeg':
    case '.jpg':
      return PImage.decodeJPEGFromStream(fs.createReadStream(filePath));
    case '.png':
      return PImage.decodePNGFromStream(fs.createReadStream(filePath));
    default:
      return Promise.resolve({ error: extension + ' not handled' });
    // return Promise.reject(new Error(`${extension} extension not handled`));
  }
}

function stitchImages(input) {
  var toStitch = input.toStitch,
      imagesWithName = input.imagesWithName,
      padding = input.padding,
      outputName = input.outputName,
      generateHtml = input.generateHtml,
      generateReact = input.generateReact,
      styleName = input.styleName,
      stylePrefix = input.stylePrefix,
      indentSp = input.indentSp,
      reactPrefix = input.reactPrefix,
      writeDir = input.writeDir;

  var sortedImages = toStitch.sort(function (a, b) {
    return a.height < b.height;
  });
  var sortedNames = imagesWithName.sort(function (a, b) {
    return a.bitmap.height < b.bitmap.height;
  });
  var boxPlacements = calculatePlacements(sortedImages, padding);
  var boxes = boxPlacements.boxes,
      maxWidth = boxPlacements.maxWidth,
      maxHeight = boxPlacements.maxHeight;

  var outputImage = PImage.make(maxWidth, maxHeight);
  var context = outputImage.getContext('2d');
  var backgroundSize = [];
  var backgroundPos = [];
  var boxsizes = [];

  for (var index = 0; index < boxes.length; index += 1) {
    var boxPlacement = boxes[index];
    var currImage = sortedImages[index];
    var outputWidth = boxPlacement.x2 - boxPlacement.x1;
    var outputHeight = boxPlacement.y2 - boxPlacement.y1;
    console.log(currImage.width, currImage.height, outputWidth, outputHeight);
    context.drawImage(currImage, 0, 0, currImage.width, currImage.height, boxPlacement.x1, boxPlacement.y1, outputWidth - 1, outputHeight - 1);

    backgroundSize.push({
      x: calcBackgroundAxis(maxWidth, outputWidth),
      y: calcBackgroundAxis(maxHeight, outputHeight)
    });
    backgroundPos.push({
      x: calcBackgroundPos(boxPlacement.x1, maxWidth, outputWidth),
      y: calcBackgroundPos(boxPlacement.y1, maxHeight, outputHeight)
    });
    boxsizes.push({ x: outputWidth, y: outputHeight });
  }
  // console.log(boxes, backgroundSize, backgroundPos);
  encodeImage(outputImage, padding, outputName, writeDir);
  writeCSS({
    generateHtml: generateHtml,
    generateReact: generateReact,
    boxsizes: boxsizes,
    backgroundSize: backgroundSize,
    backgroundPos: backgroundPos,
    outputName: outputName,
    styleName: styleName,
    stylePrefix: stylePrefix,
    indentSp: indentSp,
    sortedNames: sortedNames,
    reactPrefix: reactPrefix,
    writeDir: writeDir
  });
}

function writeHtmlPreview(backgroundName, classNames, styleName, writeDir) {
  var toWrite = '<html><head><link rel="stylesheet" href="' + styleName + '" /></head><body>';
  for (var i = 0; i < classNames.length; i += 1) {
    var className = classNames[i];
    toWrite += '<div class="' + backgroundName + ' ' + className + '"></div>';
  }
  toWrite += '</body></html>';
  fs.writeFile(path.join(writeDir, 'index.html'), toWrite, function (err) {
    if (err) {
      console.error(error(err));
    }
    console.log(success('html generated!'));
  });
}

function writeReact(backgroundName, classNames, styleName, writeDir, imageNames) {
  var toWrite = 'import React from \'react\';\nimport \'./' + styleName + '\';\n\n';
  for (var i = 0; i < classNames.length; i += 1) {
    var className = classNames[i];
    toWrite += 'export const ' + imageNames[i] + ' = props => <div className={\'' + backgroundName + ' ' + className + ' \' + props.className} />;\n\n';
  }

  fs.writeFile(path.join(writeDir, 'images.js'), toWrite, function (err) {
    if (err) {
      console.error(error(err));
    }
    console.log(success('React components generated!'));
  });
}

function writeCSS(input) {
  var generateHtml = input.generateHtml,
      generateReact = input.generateReact,
      boxsizes = input.boxsizes,
      backgroundSize = input.backgroundSize,
      backgroundPos = input.backgroundPos,
      outputName = input.outputName,
      styleName = input.styleName,
      stylePrefix = input.stylePrefix,
      indentSp = input.indentSp,
      sortedNames = input.sortedNames,
      reactPrefix = input.reactPrefix,
      writeDir = input.writeDir;

  var toWrite = '.' + stylePrefix + '-background {\n' + indentSp + 'background-image: url(\'' + outputName + '\');\n}\n\n';
  var htmlCssClasses = [];
  for (var i = 0; i < boxsizes.length; i += 1) {
    var boxSize = boxsizes[i];
    var bgSize = backgroundSize[i];
    var bgPos = backgroundPos[i];
    var imageName = sortedNames[i].name.replace(/[\s+.@]/g, '-').toLowerCase();
    toWrite += '.' + stylePrefix + '-' + imageName + ' {\n' + indentSp + 'width: ' + boxSize.x + 'px;\n' + indentSp + 'height: ' + boxSize.y + 'px;\n' + indentSp + 'background-size: ' + bgSize.x + '% ' + bgSize.y + '%;\n' + indentSp + 'background-position: ' + bgPos.x + '% ' + bgPos.y + '%;\n}\n\n';
    htmlCssClasses.push(stylePrefix + '-' + imageName);
  }
  fs.writeFile(path.join(writeDir, styleName), toWrite, function (err) {
    if (err) {
      console.error(error(err));
      return;
    }
    console.log(success('SCSS generated!'));
  });

  if (generateHtml === true) {
    writeHtmlPreview(stylePrefix + '-background', htmlCssClasses, styleName, writeDir);
  }
  if (generateReact === true) {
    writeReact(stylePrefix + '-background', htmlCssClasses, styleName, writeDir, sortedNames.map(function (value) {
      return '' + reactPrefix.charAt(0).toUpperCase() + reactPrefix.slice(1) + value.name.charAt(0).toUpperCase() + value.name.slice(1).replace(/_([a-z][A-Z])/g, function (g) {
        return g[1].toUpperCase();
      }).replace(/[\s+\-_@]/g, '').replace(/.(jpg|jpeg|png)/g, '');
    }));
  }
}

function encodeImage(outputImage, pad, outputName, writeDir) {
  PImage.encodePNGToStream(outputImage, fs.createWriteStream(path.join(writeDir, outputName))).then(function () {
    console.log(success('Image Generated'));
  });
}

function calculatePlacements(values, pad) {
  var maxWidth = 0;
  var maxHeight = 0;
  var currBoxes = [];
  for (var index = 0; index < values.length; index += 1) {
    var newbox = values[index];
    var isInserted = false;
    var cursorY = void 0;
    var cursorX = void 0;
    for (cursorY = pad; cursorY < maxHeight; cursorY += 1) {
      for (cursorX = pad; cursorX < maxWidth; cursorX += 1) {
        if (!isCollide(currBoxes, {
          x1: cursorX,
          y1: cursorY,
          x2: cursorX + newbox.width,
          y2: cursorY + newbox.height
        }, pad)) {
          // inserting
          currBoxes.push({
            x1: cursorX,
            y1: cursorY,
            x2: cursorX + newbox.width,
            y2: cursorY + newbox.height
          });
          maxWidth = Math.max(maxWidth, cursorX + newbox.width);
          maxHeight = Math.max(maxHeight, cursorY + newbox.height);
          isInserted = true;
          // break out of double for loop
          cursorX = maxWidth;
          cursorY = maxHeight;
        }
      }
    }
    // cannot fit, append right;
    if (!isInserted) {
      cursorX = maxWidth + pad;
      cursorY = pad;
      // inserting
      currBoxes.push({
        x1: cursorX,
        y1: cursorY,
        x2: cursorX + newbox.width,
        y2: cursorY + newbox.height
      });
      maxWidth = Math.max(maxWidth, cursorX + newbox.width) + pad * 2;
      maxHeight = Math.max(maxHeight, cursorY + newbox.height) + pad * 2;
      isInserted = true;
    }
  }
  return { maxWidth: maxWidth, maxHeight: maxHeight, boxes: currBoxes };
}

function isCollide(currBoxes, newBox, pad) {
  var hasCollided = false;
  for (var index = 0; index < currBoxes.length; index += 1) {
    var oldBox = currBoxes[index];
    if (overlaps(oldBox, newBox, pad)) {
      hasCollided = true;
      break;
    }
  }
  return hasCollided;
}

// x1,y1 = top left, x2, y2= bottom right
function overlaps(a, b, pad) {
  // no horizontal overlap
  if (a.x1 >= b.x2 + pad * 2 || b.x1 >= a.x2 + pad * 2) return false;
  // no vertical overlap
  if (a.y1 >= b.y2 + pad * 2 || b.y1 >= a.y2 + pad * 2) return false;
  return true;
}

function calcBackgroundAxis(spriteSize, imageSize) {
  return 100 * spriteSize / imageSize;
}

function calcBackgroundPos(offset, spriteSize, imageSize) {
  return 100 * offset / Math.abs(spriteSize - imageSize);
}