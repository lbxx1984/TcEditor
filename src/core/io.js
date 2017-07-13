/**
 * @file io处理工具
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var fileCache = {};
    var FileSystem = require('file-system');
    var fs = new FileSystem();


    return {
        // 删除本地文件
        deleteLocalFile: function (path) {
            return new Promise(function (resolve, reject) {
                fs.del(path, function (e) {
                    if (!e) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });
        },
        // 创建本地目录
        createLocalDirectory: function (path) {
            return new Promise(function (resolve, reject) {
                fs.md(path, function (e) {
                    if (e.isDirectory || e.isFile) {
                        resolve(e);
                    }
                    else {
                        reject();
                    }
                });
            });
        },
        // 删除本地目录
        deleteLocalDirectory: function (path) {
            return new Promise(function (resolve, reject) {
                fs.deltree(path, function (e) {
                    if (!e) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });
        },
        // 重命名
        renameLocal: function (oldPath, newPath) {
            return new Promise(function (resolve, reject) {
                fs.ren(oldPath, newPath, function (e) {
                    if (e.isDirectory || e.isFile) {
                        resolve(e);
                    }
                    else {
                        reject();
                    }
                });
            });
        },
        // 获取本地目录结构
        getLocalDirectory: function (path) {
            return new Promise(function (resolve, reject) {
                fs.dir(function (e) {
                    if (e instanceof Array) {
                        resolve(e);
                    }
                    else {
                        reject();
                    }
                }, path);
            });
        },
        // 将图片上传到内存
        uploadImage: function (inputFile, type) {
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
