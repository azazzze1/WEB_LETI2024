const { src, dest } = require('gulp');
const less = require('gulp-less');
paths = { // Настройка путей
    styles: {
        src: 'serverStyles/*.less',
        dest: 'public/styles'
    }
}
exports.default = function() {
    return src(paths.styles.src)
        .pipe(less())
        .pipe(dest(paths.styles.dest));
}