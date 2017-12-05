/**
 * Created by yuanweihai on 2017/4/7.
 */

// 引入gulp
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// 引入组件
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var reload = browserSync.reload;
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');



// gulp sass
gulp.task('sass',['clean'],function () {
    return gulp.src('src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 version', 'safari 5','Firefox >=20','ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
            cascade: false,  // 是否美化
            remove: true     // 是否去掉不必要的前缀
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('dist/css/'))
        .pipe(reload({stream: true}))       // 刷新浏览器

        // .pipe(notify({message:'sass task  完成！'}));
});


// gulp js
gulp.task('js',function(){
    return gulp.src('src/js/*.js')
        .pipe(concat('app.js'))
        .pipe(rename({suffix:'.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({message:'js task complete'}));
});

// 图片压缩
gulp.task('image',function () {
   return gulp.src('imgs/**/*.{png,jpg}')
       .pipe(cache(imagemin({
           interlaced: true,
           progressive: true,
           optimizationLevel: 5,
           svgoPlugins: [{removeViewBox: false}]
       })))
       .pipe(gulp.dest('dist/images'))
       .pipe(notify({message:'image task complete'}));
});


// es6 - es5
var SRC_DIR = 'src/js-es6/*.js';
var DIST_DIR = 'dist/js/';

/* es6 */
gulp.task('es6', function() {
    return gulp.src(SRC_DIR)
        .pipe($.plumber())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(DIST_DIR))
        .pipe(notify({message:'es6 task complete'}));
});


// 浏览器自动刷新
gulp.task('go',['sass'], function() {
    browserSync.init({
        proxy: "http://0.0.0.0:3000"  // 本地PHP环境
    });

    gulp.watch("src/sass/*.scss", ['sass']);
    gulp.watch("views/*.php").on('change', reload);

    //gulp.watch([SRC_DIR], ['es6']);
});


// 清除  在执行任何编译的动作之前，都先执行清除任务，防止文件冲突
gulp.task('clean',function(){
    return gulp.src(['dist/css/*.css'],{read:false})
        .pipe(clean());
});
