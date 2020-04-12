const { src, dest, parallel } = require("gulp");

const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

const PATHS = {
  source: {
    SCSS: "./src/scss/main.scss",
    JS: ["./src/js/main.js"],
  },
  output: {
    CSS: "./dist/css",
    JS: "./dist/js",
  },
};

function buildCSS() {
  return src(PATHS.source.SCSS)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest(PATHS.output.CSS));
}

function buildJS() {
  return browserify({
    entries: [PATHS.source.JS],
    transform: [babelify.configure({ presets: ["@babel/preset-env"] })],
  })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(dest(PATHS.output.JS));
}

exports.css = buildCSS;
exports.js = buildJS;
exports.default = parallel(buildCSS, buildJS);
