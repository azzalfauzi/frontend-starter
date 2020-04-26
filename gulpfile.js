const { src, dest, parallel, series, watch } = require("gulp");

// CSS processor dependencies
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

// JavaScript processor dependencies
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");

// Live server and auto reload dependencies
var browserSync = require("browser-sync");
var reload = browserSync.reload;

// HMTL template dependencies
var pug = require("gulp-pug");

const PATHS = {
  source: {
    SCSS: "./src/scss/main.scss",
    JS: ["./src/js/main.js"],
    DOCS_PUG: "./docs-src/*.pug",
  },
  output: {
    CSS: "./dist/css",
    JS: "./dist/js",
    DOCS_HTML: "./docs",
  },
};

/**
 * Compile SCSS into CSS and live injection
 */
function buildCSS() {
  return src(PATHS.source.SCSS)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(dest(PATHS.output.CSS))
    .pipe(reload({ stream: true }));
}

/**
 * Compile and bundle ES2015+ files into ES2015
 *  and live injection
 */
function buildJS() {
  return browserify({
    entries: [PATHS.source.JS],
    transform: [babelify.configure({ presets: ["@babel/preset-env"] })],
  })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(dest(PATHS.output.JS))
    .pipe(reload({ stream: true }));
}

/**
 * Compile pug files into HTML
 */
function buildHTML() {
  console.log('PUG LO INI')
  return src(PATHS.source.DOCS_PUG)
    .pipe(pug())
    .pipe(dest(PATHS.output.DOCS_HTML));
}

function pugHandler() {
  return series(buildHTML, reload)();
}

/**
 * Watcher to auto-recompile and reload
 */
function liveServer() {
  browserSync({
    server: "./",
  });
  watch(PATHS.source.SCSS, buildCSS);
  watch(PATHS.source.JS, buildJS);
  watch(PATHS.source.DOCS_PUG, buildHTML);
  watch(PATHS.output.DOCS_HTML).on("change", reload);
}

exports.css = buildCSS;
exports.js = buildJS;
exports.html = buildHTML;
exports.default = parallel(buildCSS, buildJS, buildHTML, liveServer);