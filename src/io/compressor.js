/**
 * 负责压缩JSON对象
 */
define(function (require) {

    function compressNumber(a, fixed) {
        var result = a.toString().indexOf('.') > -1 ? parseFloat(a.toFixed(fixed)) : a;
        if (Math.abs(result) < 0.001) result = 0;
        return result;
    }

    function compress(obj, fixed) {
        for (var key in obj) {
            if (typeof obj[key] === 'string') {
                continue;
            }
            if (obj[key] instanceof Array) {
                var arr = obj[key];
                for (var i = 0; i < arr.length; i++) {
                    if (isNaN(arr[i]) || typeof arr[i] !== 'number') continue;
                    arr[i] = compressNumber(arr[i], fixed);
                }
                continue;
            }
            if (!isNaN(obj[key]) && typeof obj[key] === 'number') {
                obj[key] = compressNumber(obj[key], fixed);
                continue;
            }
            if (typeof obj[key] === 'object') {
                compress(obj[key], fixed);
                continue;
            }
        }
    }

    return compress;
});
