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
const rimraf = require('rimraf')
const pkg = require('./package.json')

const banner = ['/*!*',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

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
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest(DIST_DIR))
})

gulp.task('clean:dist', () => {
    rimraf.sync(`${DIST_DIR}/*`);
});

gulp.task('minify-css', () => {
    return gulp.src(`${DIST_DIR}/utility.css`)
        .pipe(cleanCSS())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(DIST_DIR))
})

gulp.task('build:src', (callback) => {
    runSequence('clean:dist', 'build:css', 'minify-css', callback);
});

gulp.task('default', () => {
    gulp.watch(`${SRC_DIR}/**/*`, ['build:src'])
})
