const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require("gulp-autoprefixer");

const del = require('del');

const browserSync = require("browser-sync").create();

const gulpWebpack = require("gulp-webpack");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const paths = {
    root: './build',
    templates: {
        pages: 'src/templates/pages/*.pug',
        src: 'src/templates/**/*.pug',
        dest: 'build/assets/'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/styles'
    },
    fonts: {
        src: 'src/fonts/*.*',
        dest: 'build/assets/fonts'
    }, 
    images: {
        src: 'src/images/**/*.*',
        dest: 'build/assets/images'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'build/assets/scripts'
    },
    sprite: {
        src: 'src/icons/*.svg',
        dest: 'build/assets/sprite'
    }
    }

// следим за изменением файлов
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.images.src, images);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.sprite.src, sprite);
    gulp.watch(paths.scripts.src, scripts);
}

//следим и при изменении делаем релоад в браузере 
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

//очистка папки build
function clean() {
    return del(paths.root);
}

// pug
function templates () {
    return gulp.src(paths.templates.pages)
    .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
}

//scss
function styles() {
    return gulp.src('./src/styles/app.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer("last 15 versions"))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.styles.dest))
}

//sprite
function sprite() {
    return gulp.src(paths.sprite.src)
        .pipe(gulp.dest(paths.sprite.dest));
}

//images
function images() {
    return gulp.src(paths.images.src)
        .pipe(gulp.dest(paths.images.dest));
}

//fonts
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
}

// webpack
function scripts() {
    return gulp.src("./src/scripts/app.js")
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest));
}
exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;
exports.fonts = fonts;
exports.sprite = sprite;
exports.scripts = scripts;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates, images, fonts, sprite, scripts),
    gulp.parallel(watch, server)
));