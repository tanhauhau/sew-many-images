# Sew Many Images
100% JavaScript implementation for CSS image sprite generator. Have a suggestion/improvement? Please submit an PR or Issue.

**Optional Dependency:** In the repo where you run this command, you can install `app-root-path` to consistently generate the same hash for CSS class prefixes, as we use the location of your image directory to generate these hashes. If `app-root-path` doesn't exist, we will just use your current working directory. Therefore, the same repo on a different directory in the same machine will generate different hashes, but it will still work regardless.

## Todo:
- [ ] Add flag to resize images before stitching together

## Quick start guide
Run `git clone https://github.com/Shopee/sew-many-images.git && cd sew-many-images && npm install && npm run build && npm install -g`

Or:

- Clone this repo `git clone https://github.com/Shopee/sew-many-images.git`
- Change directory to the repo `cd sew-many-images`
- Install dependencies `npm install`
- Build project `npm run build`
- Globally install `npm install -g`

Or:

`npm install -g sew-many-images`

Or:

- `npm install -D sew-many-images`
- `npx smi`

## User guide
Change directory to where your images are and generate 3 files with `smi` in your current working directory
- `sprite.png`
  - Generated CSS sprites, greedily arranged into the (reasonably) smallest rectangle
- `images.js`
  - A JS file which exports react components with background-image as the respective images. The components will be named `Image${filename}`. You should be able to resize these components and the images will be accordingly responsive
- `style.scss`
  - A CSS file which defines the classes for the images. You will not need to modify this in most cases.

### Commands and flags

|Command|Shorthand|Description|
|:---|:---|:---|
|--help|N.A.|If you need to read the docs to understand what this does, maybe you should refresh on your CLI skills|
|--from|-f|Directory of images to stitch. By default it will crawl through your current working directory|
|--dir|-d|Output directory same as images. By default it will generate the files in your current working directory, but turning this flag to true will generate the files in your images directory|
|--pad|-p|Padding between images. You can increase this if the images bleed into each other|
|--genHtml|--gh|Generate html file. Off by default. It is good to turn on this flag if you want to check the styles generated and whether they bleed, without using the actual React components|
|--genReact|--gr|Generate JS file with React components. You can import these components and resize them (override the height and width), they will scale accordingly|
|--styleName|-s|Stylesheet name (default 'style.scss') on chrome. SCSS will not load on the generated html page, otherwise there's no need to change this|
|--reactPrefix|-r|React component prefix (default 'image'). There's no need to change this unless the import names are getting ridiculously long|
|--out|-o|Output image name. There's no need to change this, will not affect development|
|--stylePrefix|N.A.|CSS class prefix. By default we will generate a crc32-base36 of the image directory (with prefix 'p', to avoid bad className). There's no need to change this, will (likely) not affect development, but there's a possibility of hash collision|
|--indentSp|N.A|CSS class indent rules with (default two spaces '  '). Change this if it doesn't work with your css linting rules|

With ❤ from tenzy

Copyright 2018 Ten Zhi Yang

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
