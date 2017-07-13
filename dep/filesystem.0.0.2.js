/**
 * html5 浏览器端沙箱文件操作库
 *
 * @file 沙箱操作库
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
(function (namespace) {


    var version = '0.0.2';


    if (typeof define === 'function') {
        define(function (require) {
            return FileSystem;
        });
    }
    else {
        namespace = namespace || {};
        namespace.FileSystem = FileSystem;
        namespace.fs = new FileSystem();
    }


    /**
     * 内部工具，合并路径
     *
     * @param {string} path1 currentDirectory的fullpath
     * @param {string} path2 相对路径
     * @return {string} 绝对路径
     */
    function joinPath(path1, path2) {
        var arr1 = typeof path1 === 'string' ? path1.split('/') : [];
        var arr2 = typeof path2 === 'string' ? path2.split('/') : [];
        if (arr2.length === 0) {
            return path1;
        }
        if (arr2[0] === '') {
            arr1 = [];
        }
        for (var i = 0; i < arr2.length; i++) {
            if (arr2[i] === '.') {
                continue;
            }
            if (arr2[i] === '..') {
                arr1.pop();
                continue;
            }
            arr1.push(arr2[i]);
        }
        var dest = [];
        for (i = 0; i < arr1.length; i++) {
            if (arr1[i] === '') {
                continue;
            }
            dest.push(arr1[i]);
        }
        return '/' + dest.join('/');
    }


    /**
     * 内部工具，扩展fs对象实例API
     *
     * @param {Object} me fs对象实例
     * @param {Object} fs 文件操作句柄
     */
    function extend(me, fs) {

        var currentDirectory = fs.root;

        me.version = version;

        /**
         * 获取当前目录句柄
         *
         * @return {Object} 目录操作句柄
         */
        me.getCurrentDirectory = function () {
            return currentDirectory;
        };

        /**
         * 读取当前目录
         *
         * @param {?string} dir 相对路径
         * @return {Promise}
         */
        me.ls = me.dir = function (dir) {
            return new Promise(function (resolve, reject) {
                fs.root.getDirectory(
                    joinPath(currentDirectory.fullPath, dir),
                    {},
                    function (dirEntry) {
                        dirEntry.createReader().readEntries(resolve, reject);
                    },
                    reject
                );
            });
        };

        /**
         * 切换当前目录
         *
         * @param {string} dir 相对路径
         * @return {Promise}
         */
        me.cd = function (dir) {
            return new Promise(function (resolve, reject) {
                fs.root.getDirectory(
                    joinPath(currentDirectory.fullPath, dir),
                    {},
                    function (entry) {
                        currentDirectory = entry;
                        resolve(entry);
                    },
                    reject
                );
            });
        };

        /**
         * 创建目录，不递归创建
         *
         * @param {string} dir 相对路径
         * @return {Promise}
         */
        me.md = function (dir) {
            return new Promise(function (resolve, reject) {
                fs.root.getDirectory(
                    joinPath(currentDirectory.fullPath, dir),
                    {create: true},
                    resolve,
                    reject
                );
            });
        };

        /**
         * 删除目录，只删除空目录
         *
         * @param {string} dir 相对路径
         * @return {Promise}
         */
        me.rd = function (dir) {
            return new Promise(function (resolve, reject) {
                fs.root.getDirectory(
                    joinPath(currentDirectory.fullPath, dir),
                    {},
                    function (entry) {
                        entry.remove(resolve, reject);
                    },
                    reject
                );
            });
        };

        /**
         * 删除目录及其内部所有内容
         *
         * @param {string} dir 相对路径
         * @return {Promise}
         */
        me.deltree = function (dir) {
            return new Promise(function (resolve, reject) {
                fs.root.getDirectory(
                    joinPath(currentDirectory.fullPath, dir),
                    {},
                    function (entry) {
                        entry.removeRecursively(resolve, reject);
                    },
                    reject
                );
            });
        };

        /**
         * 创建文件，如果存在同名文件则抛错
         *
         * @param {string} filename 文件名（可含相对路径）
         * @return {Promise}
         */
        me.create = function (filename) {
            return new Promise(function (resolve, reject) {
                fs.root.getFile(
                    joinPath(currentDirectory.fullPath, filename),
                    {create: true, exclusive: true},
                    resolve, reject
                );
            });
        };

        /**
         * 删除文件，如果文件不存在则抛错
         *
         * @param {string} filename 完成文件名
         * @return {Promise}
         */
        me.del = function (filename) {
            return new Promise(function (resolve, reject) {
                fs.root.getFile(
                    joinPath(currentDirectory.fullPath, filename),
                    {create: false},
                    function (entry) {
                        entry.remove(resolve, reject);
                    },
                    reject
                );
            });
        };

        /**
         * 复制文件或目录到指定目录
         *
         * @param {string} src 源相对路径
         * @param {string} dest 相对目标目录
         * @return {Promise}
         */
        me.copy = function (src, dest) {
            dest = joinPath(currentDirectory.fullPath, dest);
            src = joinPath(currentDirectory.fullPath, src);
            return new Promise(function (resolve, reject) {
                fs.root.getDirectory(dest, {}, gotDest, reject);
                function gotDest(destEntry) {
                    fs.root.getFile(src, {create: false}, gotSrc, tryDirectory);
                    function gotSrc(srcEntry) {
                        srcEntry.copyTo(destEntry, null, resolve, reject);
                    }
                    function tryDirectory() {
                        fs.root.getDirectory(src, {}, gotSrc, reject);
                    }
                }
            });
        };

        /**
         * 移动文件或目录到指定目录
         *
         * @param {string} src 源相对路径
         * @param {string} dest 相对目标目录
         * @return {Promise}
         */
        me.move = function (src, dest) {
            dest = joinPath(currentDirectory.fullPath, dest);
            src = joinPath(currentDirectory.fullPath, src);
            return new Promise(function (resolve, reject) {
                fs.root.getDirectory(dest, {}, gotDest, reject);
                function gotDest(destEntry) {
                    fs.root.getFile(src, {create: false}, gotSrc, tryDirectory);
                    function gotSrc(srcEntry) {
                        srcEntry.moveTo(destEntry, null, resolve, reject);
                    }
                    function tryDirectory() {
                        fs.root.getDirectory(src, {}, gotSrc, reject);
                    }
                }
            });
        };

        /**
         * 重命名文件夹或文件
         *
         * @param {string} oldname 源文件或目录的相对路径
         * @param {string} newname 新名
         * @return {Promise}
         */
        me.ren = function (oldname, newname) {
            oldname = joinPath(currentDirectory.fullPath, oldname);
            return new Promise(function (resolve, reject) {
                fs.root.getDirectory(oldname, {}, got, tryFile);
                function got(entry) {
                    entry.getParent(function (parentEntry) {
                        entry.moveTo(parentEntry, newname, resolve, reject);
                    });
                }
                function tryFile() {
                    fs.root.getFile(oldname, {create: false}, got, reject);
                }
            });
        };

        /**
         * 打开文件，如果文件不存在则抛错
         *
         * @param {string} filename 完成文件名
         * @return {Promise}
         */
        me.open = function (filename) {
            return new Promise(function (resolve, reject) {
                fs.root.getFile(
                    joinPath(currentDirectory.fullPath, filename),
                    {create: false},
                    resolve,
                    reject
                );
            });
        };

        /**
         * 读取文件
         *
         * @param {string} src 文件路径，若不存在抛错
         * @param {?Object} param 读取配置
         * @param {?string} param.type 读取方式: readAsBinaryString, readAsText, readAsDataURL, readAsArrayBuffer
         * @param {?string} param.encoding 编码方式，type=readAsText时有效，默认utf8，在windows中文操作系统中读取本地文件时经常用gb2312
         * @return {Promise}
         */
        me.read = function (src, param) {
            src = joinPath(currentDirectory.fullPath, src);
            param = param || {};
            param.type = param.type || 'readAsText';
            param.encoding = param.encoding || 'utf8';
            return new Promise(function (resolve, reject) {
                fs.root.getFile(src, {}, gotFile, reject);
                function readFile(file) {
                    var reader = new FileReader();
                    reader.onloadend = resolve;
                    if (typeof reader[param.type] === 'function') {
                        reader[param.type](file, param.encoding);
                    }
                }
                function gotFile(fileEntry) {
                    fileEntry.file(readFile, reject);
                }
            });
        };

        /**
         * 写文件，文件不存在，则创建；不指定append，则清空文件从头写入，否则追加写入
         *
         * @param {string} src 文件路径
         * @param {Object} param 写入配置
         * @param {Blob|string} param.data 待写入的数据，以封装好的blob
         * @param {boolean} param.append 是否以追加形式写入
         * @return {Promise}
         */
        me.write = function (src, param) {
            src = joinPath(currentDirectory.fullPath, src);
            param = param || {};
            param.data = typeof param.data === 'string' ? new Blob([param.data]) : param.data;
            param.data = param.data instanceof Blob ? param.data : new Blob(['']);
            param.append = param.hasOwnProperty('append') ? param.append : false;
            return new Promise(function (resolve, reject) {
                fs.root.getFile(src, {create: true}, gotFile, reject);
                function gotFile(fileEntry) {
                    fileEntry.createWriter(gotWriter);
                }
                function gotWriter(fileWriter) {
                    var truncate = false;
                    fileWriter.onwriteend = function () {
                        if (truncate) {
                            resolve();
                            return;
                        }
                        if (param.append) {
                            resolve();
                        }
                        else {
                            fileWriter.truncate(param.data.size);
                            truncate = true;
                        }
                    };
                    fileWriter.seek(param.append ? fileWriter.length : 0);
                    fileWriter.write(param.data);
                }
            });
        };

    }


    /**
     * 构造函数
     *
     * @constructor
     * @param {Function} callback 回调
     * @param {Object} param 配置信息
     * @param {number} param.size 空间大小：字节
     */
    function FileSystem(callback, param) {

        if (!(this instanceof FileSystem)) {
            return new FileSystem(callback, param);
        }
        callback = typeof callback === 'function' ? callback : function () {};
        param = param || {};
        var size = (~~param.size) || 1024 * 1024 * 100; // 100MB
        var malloc = window.requestFileSystem || window.webkitRequestFileSystem;
        var me = this;

        // 分配空间，申请文件操作句柄
        if (typeof malloc === 'function' && typeof window.Promise === 'function') {
            malloc(window.TEMPORARY, size, success, fail);
        }
        else {
            fail();
        }

        return this;

        // 回调处理事件
        function success(fs) {
            extend(me, fs);
            log('FileSystem ' + me.version);
            callback(me);
        }

        function fail() {
            log('Your browser don\'t support!', 'warn');
            callback();
        }

        function log(str, func) {
            str = str || '';
            func = typeof console[func] === 'function' ? func : 'log';
            console[func](str);
        }
    }


})(window);
