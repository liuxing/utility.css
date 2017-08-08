const gulp = require('gulp')
const path = require('path')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const header = require('gulp-header')
const runSequence = require('run-sequence')
const pkg = require('./package.json')

const postcssConfig = [autoprefixer({
    browsers: [
        'last 2 versions',
    ],
})]

const SRC_DIR = path.resolve(__dirname, 'src')
const DIST_DIR = path.resolve(__dirname, 'dist')

gulp.task('build:css', () => {
    return gulp.src(`${SRC_DIR}/utility.scss`)
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(postcss(postcssConfig))
        .pipe(header(`/*! Utility.css v${pkg.version} ${pkg.homepage} */\n`))
        .pipe(gulp.dest(DIST_DIR))
})

gulp.task('minify-css', () => {
    return gulp.src(`${DIST_DIR}/utility.css`)
        .pipe(cleanCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(DIST_DIR))
})


gulp.task('build:src', (callback) => {
  runSequence('build:css', 'minify-css', callback);
});