/**
 * @file 此包仅对JavaScript原生对象进行必要的方法扩充，没有任何输出
 * @author Brian Li (lihaitao03@baidu.com)
 */
/* eslint-disable */
define(function (require) {

    Array.prototype.each = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback(this[i]);
        }
    };

    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === val) {
                return i;
            }
        }
        return -1;
    };

    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    Date.prototype.format = function (format) {
        var o = {
            'M+': this.getMonth() + 1,
            'D+': this.getDate(),
            'h+': this.getHours(),
            'm+': this.getMinutes(),
            's+': this.getSeconds(),
            'c+': this.getMilliseconds()
        };
        if (/(Y+)/.test(format)) {
            format = format.replace(
                RegExp.$1,
                (this.getFullYear() + '').substr(4 - RegExp.$1.length)
            );
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        return format;
    };

    return {};
});
/* eslint-enable */
