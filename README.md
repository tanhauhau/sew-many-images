# Sew Many Images
100% javascript implementation for css image sprite generator. Have a suggestion/improvement? Please submit an MR or Issue.

**Optional Dependency:** In the repo where you run this command, you can install `app-root-path` to consistently generate the same hash for css class prefixes, as we use the location of your image directory to generate these hashes. If `app-root-path` doesn't exist, we will just use your current working directory, therefore the same repo on a different directory in the same machine will generate different hashes, but it will still work regardless.

## Todo:
- [ ] add flag to resize images before stitching together

## Quick start guide
run `git clone https://github.com/Shopee/sew-many-images.git && cd sew-many-images && npm install && npm run build && npm install -g`

or:

- clone this repo `git clone https://github.com/Shopee/sew-many-images.git`
- change directory to the repo `cd sew-many-images`
- install dependencies `npm install`
- build project `npm run build`
- globally install `npm install -g`

or:

`npm install -g sew-many-images`

or:

- `npm install -D sew-many-images`
- `npx smi`

## User guide
change directory to your where your images are and generate 3 files with `smi` in your current working directory
- `sprite.png`
  - generated css sprites, greedily arranged into the smallest(reasonably smallest) rectangle
- `images.js`
  - a js file which exports react components with background-image as the respective images. the components will be named `Image${filename}`. You should be able to resize these components and the images will be accordingly responsive
- `style.scss`
  - a css file which defines the classes for the images. you will not need to modify this in most cases.

### Commands and flags

|command|short hand|description|
|:---|:---|:---|
|--help|N.A.|if you need to read the docs to understand what this does, maybe you should refresh on your cli skills|
|--from|-f|directory of images to stitch, by default it will crawl through your current working directory|
|--dir|-d|output directory same as images, by default it will generate the files in your current working directory, but turning this flag to true will generate the files in your images directory|
|--pad|-p|padding between images you can increase this if the images bleed into each other|
|--genHtml|--gh|generate html file off by default, this is good to turn on this flag if you want to check the styles generated and whether they bleed, without using the actual react components|
|--genReact|--gr|generate js file with react components, you can import these components and resize them (override the height and width), they will scale accordingly|
|--styleName|-s|stylesheet name (default 'style.scss') on chrome, scss will not load on the generated html page, otherwise there's no need to change this|
|--reactPrefix|-r|react component prefix (default 'image') there's no need to change this unless the import names are getting ridiculously long|
|--out|-o|output image name, there's no need to change this, will not affect development|
|--stylePrefix|N.A.|css class prefix. by default we will generate a crc32-base36 of the image directory (with prefix 'p', to avoid bad className) there's no need to change this, will (likely) not affect development, but there's a possibility of hash collision|
|--indentSp|N.A|css class indent rules with (default two spaces '  ') change this if it doesn't work with your css linting rules|

with ❤ from tenzy

Copyright 2018 Ten Zhi Yang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
