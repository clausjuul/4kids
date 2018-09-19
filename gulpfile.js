
// const fs = require('fs');
// const imageminJpegtran = require('imagemin-jpegtran');
// const gulpCopy = require('gulp-copy');
// var cache = require('gulp-cache');
// var imagemin = require('gulp-imagemin');
// var imageminZopfli = require('imagemin-zopfli');
// var imageminGiflossy = require('imagemin-giflossy');

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
// const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const combineMq = require('gulp-combine-mq');
const sassdoc = require('sassdoc');
const htmlvalidate = require('gulp-w3cjs');
const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');
const sitemap = require('gulp-sitemap');
const gulpSeo = require('gulp-seo');

const runSequence = require('run-sequence');
const del = require('del');
const imagemin = require('gulp-imagemin');

const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg'); //need to run 'brew install libpng'

const uglify = require('gulp-uglify');
const cssval = require('gulp-w3c-css');
const robots = require('gulp-robots');

const htmlmin = require('gulp-htmlmin');

const fontMagician = require('postcss-font-magician');

// var scsslint = require('gulp-scss-lint');
// var scssLintStylish = require('gulp-scss-lint-stylish');
const sassLint = require('gulp-sass-lint');

 
gulp.task('sass-lint', function() {
    return gulp.src(['src/scss/**/*.s+(a|c)ss', '!src/scss/abstracts', '!src/scss/vendor'])
      .pipe(sassLint({
        // options: {
        //   formatter: 'stylish',
        // //   'merge-default-rules': true
        // },
        // files: {
        //     ignore: [
        //     'src/scss/vendor/**/*.scss',
        //     'src/scss/abstracts/**/*.scss'
        //     ],
        //     include: './src/scss/**/*.scss'
        // },

        // },
        // rules: {
        //   'no-ids': 1,
        //   'no-mergeable-selectors': 0
        // },
        configFile: '.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Validate CSS, if you dare
gulp.task('cssval', function () {
    gulp.src('src/css/**/*.css')
        .pipe(cssval())
        .pipe(gulp.dest('src/docs/tests/'))
});

// Validate CSS, if you dare
gulp.task('cssval-prod', function () {
    gulp.src('dist/css/**/*.css')
        .pipe(cssval())
        .pipe(gulp.dest('dist/docs/tests/'))
});

gulp.task('htmlminify', function () {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy-favicon', function () {
    gulp.src('src/favicon.ico')

    .pipe(gulp.dest('dist/'))
});

gulp.task('copy-extra', function () {
    gulp.src([
        'src/.gitignore',
        'src/.gitattributes',
        'src/favicon.ico',
        'src/site.webmanifest'])
    .pipe(gulp.dest('dist/'))
});

gulp.task('robottxt', function () {
    gulp.src('src/index.html')
        .pipe(robots({
            useragent: '*',
            allow: ['js/', 'css/', 'img/'],
            disallow: ['docs/']
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function (done) {
    del([
        './dist'
    ]).then( function () {
        done();
    });
});

gulp.task('uglify', function () {
    return gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))

});

gulp.task('build', function (callback) {
    runSequence(
        'clean',
        ['seo', 'sass-prod', 'uglify', 'robottxt', 'copy-extra', 'sitemap'],
        'cssval-prod',
        'sassdoc',
        'minify-icons',
        'imagemin',
        'htmlval-prod',
        'sass-lint',
        callback);
});


gulp.task('imagemin', function () {
    return gulp.src(['src/img/**/*.{gif,png,jpg,svg}'])
        .pipe(plumber())
        .pipe(imagemin([
            imageminMozjpeg({
                quality: 80
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imageminPngquant({
                speed: 1,
                quality: 90 //lossy settings
            }),

            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: true}
                ]
            })
        ]))
        .pipe(gulp.dest('dist/img'))
});


gulp.task('minify-icons', function () {
    return gulp.src(['src/icons/**/*.svg'])
        .pipe(plumber())
        .pipe(imagemin([
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: true}
                ]
            })
        ]))
        .pipe(gulp.dest('dist/icons'))
});



gulp.task('seo', function () {
    //   return gulp.src('src/index.html')
    return gulp.src('src/*.html')
        .pipe(gulpSeo({
            list: ['og', 'se', 'schema', 'twitter', 'lang: "dk"'],
            meta: {
                title: '4 Kids',
                description: 'Børne ting og sager',
                // author: 'Maksym Blank',
                keywords: ['legetøj', 'værktøj', 'sengetøj', 'syltetøj'],
                robots: {
                    index: true, // true
                    follow: true // true
                },
                revisitAfter: '2 month', // 3 month
                // image: 'http://mywebsite.com/image.jpg',
                locale: 'dk',
                site_name: '4 Kids',
                type: 'website',
            }
        }))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'));
});


gulp.task('sitemap', function () {
    gulp.src('dist/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: 'http://www.4kids.dk'
        }))
        .pipe(gulp.dest('./dist'));
});


// Compile Sass & Inject Into Browser
// gulp.task('sass', ['sasstoscss'], function() {
// gulp.task('sass', ['sass-lint'], function () {
gulp.task('sass', function () {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber())
        
        // .pipe(sassLint({
        //     configFile: '.sass-lint.yml'
        // }))
        // .pipe(sassLint.format())
        // .pipe(sassLint.failOnError())

        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            errorLogToConsole: true
        }))
        .pipe(postcss([
            fontMagician() // Automaticly gets all fonts from https://fonts.google.com/
        ]))
        .pipe(sourcemaps.write("./maps"))
        
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

var sassDocOptions = {
    dest: './dist/docs/sassdoc',
    // theme: 'flippant',
    // theme: 'jigsass',
    // verbose: true,
    display: {
        access: ['public', 'private'],
        alias: true,
        //   watermark: true,
    },
    // groups: {
    //   'undefined': 'Ungrouped',
    //   foo: 'Foo group',
    //   bar: 'Bar group',
    // },
    // basePath: 'https://github.com/mftw/ubuntu-conference',
};

gulp.task('sassdoc', function () {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber())
        .pipe(sassdoc(sassDocOptions))
    // .pipe(gulp.dest("./dist/docs")) // Dont pipe the destination, use config var instead.
});

// Compile Sass & Inject Into Browser
gulp.task('sass-prod', function () {
    return gulp.src(['src/scss/**/*.scss'])
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed',
            errorLogToConsole: true
        }))
        .pipe(combineMq({
            beautify: false
        }))
        .pipe(postcss([
            postcssPresetEnv({
                browsers: ['last 9 versions', '> 5%', 'ie 8', 'ie 7'],
            }),
            fontMagician()
        ]))
        
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream());
});

// Validate HTML, if you dare
gulp.task('htmlval', function () {
    gulp.src('src/*.html')
        // gulp.src('src/views/*.html')
        .pipe(htmlvalidate())
        .pipe(htmlvalidate.reporter());
});

// Validate production HTML, if you dare
gulp.task('htmlval-prod', function () {
    gulp.src('dist/*.html')
        // gulp.src('src/views/*.html')
        .pipe(htmlvalidate())
        .pipe(htmlvalidate.reporter())
        // .pipe(gulp.dest('dist/docs/tests/html.txt'))
});

// Watch Sass & Serve
gulp.task('serve', ['sass'], function () {
    // console.log('')
    browserSync.init({
        server: "./src"
    });

    gulp.watch(['src/scss/**/*.scss'], ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Watch Sass-prod & Serve
gulp.task('serve-prod', ['sass-prod'], function () {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch(['src/scss/**/*.scss'], ['sass-prod']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

// Watch Sass & Serve
gulp.task('compile', ['sass'], function () {
    gulp.watch(['src/scss/**/*.scss'], ['sass']);
});

// Watch Sass & Serve
gulp.task('compile-prod', ['sass-prod'], function () {
    gulp.watch(['src/scss/**/*.scss'], ['sass-prod']);
});

// Default Task
gulp.task('default', ['serve']);
// gulp.task('default', ['compile']);