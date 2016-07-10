var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    sass         = require('gulp-sass'),
    browser      = require('browser-sync'),
    iconfont     = require("gulp-iconfont"),
    consolidate  = require("gulp-consolidate"),
    $            = require('gulp-load-plugins')();

var sassPaths = [
  'bower_components/foundation-sites/scss',
  'bower_components/motion-ui/src'
];


gulp.task('sass', function() {
  return gulp.src('scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths,
      outputStyle: 'compressed' // if css compressed **file size**
    })
      .on('error', $.sass.logError))
    // .pipe($.autoprefixer({
    //   browsers: ['last 2 versions', 'ie >= 9']
    // }))
    .pipe(gulp.dest('css'))
    .pipe(browser.stream({match: '**/*.css'}));
});


// icon builder
gulp.task("build:icons", function() {
    return gulp.src(["./icons/*.svg"])//path to svg icons
      .pipe(iconfont({
        fontName: "myicons",
        formats: ["ttf", "eot", "woff", "svg"],
        centerHorizontally: true,
        fixedWidth: true,
        normalize: true
      }))
      .on("glyphs", function (glyphs) {

        gulp.src("./icons/util/*.scss") // Template for scss files
            .pipe(consolidate("lodash", {
                glyphs: glyphs,
                fontName: "myicons",
                fontPath: "../fonts/"
            }))
            .pipe(gulp.dest("./scss/icons"));//generated scss files with classes
      })
      .pipe(gulp.dest("./fonts/"));//icon font destination
});

// browser-sync
gulp.task('serve', ['sass'], function(){
  browser.init({
        server: {
            baseDir: "./"
        }
    });
});



gulp.task('default', ['serve'], function() {
  gulp.watch(['scss/**/*.scss'], ['sass']);
  gulp.watch('./**/*.html').on('change', browser.reload);
});
