/**
 * @file io处理工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var FileSystem = require('file-system');
    var fileCache = {};
    var fs = new FileSystem();


    // 将图片上传到内存
    fs.uploadImage = function (inputFile, type) {
        return new Promise(function (resolve, reject) {
            var file = inputFile.files[0];
            if (file.type.indexOf('image/') !== 0) {
                reject();
                return;
            }
            var key = file.lastModified + '.' + file.size + '.' + file.name;
            var cache = fileCache[key];
            if (cache) {
                resolve(cache);
                return;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = document.createElement('img');
                img.src = e.target.result;
                img.onload = function () {
                    fileCache[key] = img;
                    resolve(img);
                };
            };
            reader.onerror = function () {
                reject();
            };
            reader.readAsDataURL(file);
        });
    };


    fs.uploadFromBrowser = function (extension) {
        let input = document.createElement('input');
        input.type = 'file';
        input.style.cssText = 'visibility:hidden;';
        document.body.appendChild(input);
        return new Promise(function (resolve, reject) {
            input.onchange = function (evt) {
                document.body.removeChild(input);
                let file = evt.target.files[0];
                if (extension && file.name.split('.').pop() !== extension) {
                    return;
                }
                let reader = new FileReader();
                reader.onload = function (e) {
                    resolve(e);
                };
                reader.onerror = function () {
                    reject();
                };
                reader.readAsArrayBuffer(file);
            };
            input.click();
        });
    };


    return fs;

});
