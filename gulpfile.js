const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');

// Load plugins


const sass = require('gulp-sass')(require('node-sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');


// Clean assets

function clear() {
  return src('./style.css', {
    read: false,
    allowEmpty: true
  })
  .pipe(clean());
}

// CSS function

function css() {
  const source = './scss/main.scss';

  return src(source)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    overrideBrowserslist: ['last 2 versions'],
    cascade: false
  }))
  .pipe(cssnano())
  .pipe(concat('style.css'))
  .pipe(sourcemaps.write('.'))
  .pipe(dest('.'))
  .pipe(browsersync.stream());
}

// Watch files

function watchFiles() {
  watch('./scss/**/*', css);
}

// BrowserSync

function browserSync() {
  browsersync.init({
    server: {
      baseDir: './'
    },
    port: 3000
  });
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.css = series(clear, parallel(css));
exports.default = series(clear, parallel(css));