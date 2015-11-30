/// <binding ProjectOpened='sass:watch, js-site:watch' />
var gulp = require('gulp');

var uglify = require('gulp-uglify');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var rename = require('gulp-rename');

var minifyCss = require('gulp-minify-css');

gulp.task('js', function () {
    return gulp.src('ng-tick/src/*.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('ng-tick/dist'));
});

gulp.task('js-site', function () {
    return gulp.src('demo-site/js/app.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('demo-site/js'));
});

gulp.task('sass', function () {
    return gulp.src('demo-site/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCss())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('demo-site/css'));
});

gulp.task('js-site:watch', function () {
    gulp.watch('demo-site/js/app.js', ['js-site']);
});

gulp.task('sass:watch', function () {
    gulp.watch('demo-site/sass/*.scss', ['sass']);
});

gulp.task('build', ['sass', 'js']);