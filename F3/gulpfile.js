// 获取 gulp
var gulp = require('gulp')
// 获取 gulp-ruby-sass 模块
var sass = require('gulp-ruby-sass')
// 编译sass

// 在命令行输入 gulp sass 启动此任务
gulp.task('sass', function() {
    return sass('*.scss',{sourcemap: true,style: 'compressed'})
           .pipe(gulp.dest(''))
});
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function() {
    // 监听文件修改，当文件被修改则执行
    gulp.watch('*.scss', ['sass'])
});
// 使用 gulp.task('default') 定义默认任务
// 在命令行使用 gulp 启动 sass 任务和 auto 任务
gulp.task('default', ['sass', 'auto'])