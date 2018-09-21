const PImage = require('pureimage');
const path = require('path');
const fs = require('fs');


export function packImages(folderDir, outputName, padding, generateHtml) {
  try {
    fs.readdir(folderDir, (err, files) => {
      console.log('asdf1')
      if (files) {
        console.log('asdf2')
        const promises = [];
        for (let i = 0; i < files.length; i += 1) {
          const file = files[i];
          const extension = path.extname(file);
          promises.push(decodeFromStream(path.join(folderDir, file), extension));
        }
        Promise.all(promises).then((values) => {
          console.log('asdf3')
          stitchImages(values, padding, outputName, generateHtml);
          return true;
        }).catch(err2 => console.error(err2));
      } else {
        console.error(err);
      }
    });
  } catch (e) {
    console.error(e);
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
      return Promise.reject(new Error('extension not handled'));
  }
}

function stitchImages(values, pad, outputName, generateHtml) {
  console.log('stitching', generateHtml);
  const sortedImages = values.sort((a, b) => a.height < b.height);
  const boxPlacements = calculatePlacements(sortedImages, pad);
  const { boxes, maxWidth, maxHeight } = boxPlacements;
  const outputImage = PImage.make(maxWidth + pad * 2, maxHeight + pad * 2);
  const context = outputImage.getContext('2d');
  const backgroundSize = [];
  const backgroundPos = [];
  const boxsizes = [];

  for (let index = 0; index < boxes.length; index += 1) {
    const boxPlacement = boxes[index];
    const currImage = sortedImages[index];
    const outputWidth = boxPlacement.x2 - boxPlacement.x1;
    const outputHeight = boxPlacement.y2 - boxPlacement.y1;
    context.drawImage(currImage,
      0, 0, currImage.width, currImage.height,
      boxPlacement.x1, boxPlacement.y1, outputWidth, outputHeight);

    backgroundSize.push({
      x: calcBackgroundAxis(maxWidth, outputWidth),
      y: calcBackgroundAxis(maxHeight, outputHeight),
    });
    backgroundPos.push({
      x: calcBackgroundPos(boxPlacement.x1, maxWidth, outputWidth),
      y: calcBackgroundPos(boxPlacement.y1, maxHeight, outputHeight),
    });
    boxsizes.push({ x: outputWidth, y: outputHeight });
  }
  // console.log(boxes, backgroundSize, backgroundPos);
  encodeImage(outputImage, pad, outputName);
  if (generateHtml) {
    console.log('writingHtml');
    writeHtmlPreview(boxsizes, backgroundSize, backgroundPos, outputName);
  }
}

function calcBackgroundAxis(spriteSize, imageSize) {
  return 100 * spriteSize / imageSize;
}

function calcBackgroundPos(offset, spriteSize, imageSize) {
  return 100 * offset / Math.abs(spriteSize - imageSize);
}

function writeHtmlPreview(boxsizes, backgroundSize, backgroundPos, outputName) {
  let toWrite = '<html>';
  for (let i = 0; i < backgroundSize.length; i += 1) {
    toWrite += `<div style="background-image: url('${outputName}'); width: ${boxsizes[i].x}; height:  ${boxsizes[i].y}; background-size: ${backgroundSize[i].x}% ${backgroundSize[i].y}%; background-position: ${backgroundPos[i].x}% ${backgroundPos[i].y}%;"> </div>`;
  }
  toWrite += '</html>';
  fs.writeFile('index.html', toWrite, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('html generated!');
    return true;
  });
}

function encodeImage(outputImage, pad, outputName) {
  PImage.encodePNGToStream(outputImage, fs.createWriteStream(outputName)).then(() => {
    console.log('done writing');
  });
}

function calculatePlacements(values, pad) {
  let maxWidth = 0;
  let maxHeight = 0;
  const currBoxes = [];
  for (let index = 0; index < values.length; index += 1) {
    const newbox = values[index];
    let isInserted = false;
    let cursorY;
    let cursorX;
    for (cursorY = pad; cursorY < maxHeight; cursorY += 1) {
      for (cursorX = pad; cursorX < maxWidth; cursorX += 1) {
        if (!isCollide(currBoxes,
          {
            x1: cursorX,
            y1: cursorY,
            x2: cursorX + newbox.width,
            y2: cursorY + newbox.height,
          }, pad)) {
          // inserting
          currBoxes.push({
            x1: cursorX,
            y1: cursorY,
            x2: cursorX + newbox.width,
            y2: cursorY + newbox.height,
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
        y2: cursorY + newbox.height,
      });
      maxWidth = Math.max(maxWidth, cursorX + newbox.width);
      maxHeight = Math.max(maxHeight, cursorY + newbox.height);
      isInserted = true;
    }
  }
  return { maxWidth, maxHeight, boxes: currBoxes };
}

function isCollide(currBoxes, newBox, pad) {
  let hasCollided = false;
  for (let index = 0; index < currBoxes.length; index += 1) {
    const oldBox = currBoxes[index];
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
