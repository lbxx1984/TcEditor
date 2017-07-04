/**
 * @file io处理工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var fileCache = {};


    return {
        uploadFile: function (inputFile, type) {
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
        }
    };


});
