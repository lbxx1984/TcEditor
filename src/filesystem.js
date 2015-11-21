/**
 * html5 浏览器端沙箱文件操作库
 *
 * @file 沙箱操作库
 * @author Haitao Li
 * @mail 279641976@qq.com
 * @site http://lbxx1984.github.io/
 */
(function (namespace) {


    if (typeof define === 'function') {
        define(function (require) {
            return FileSystem;
        });
    }
    else {
        namespace.FileSystem = FileSystem;
        namespace.fs = FileSystem;
    }

    var version = '0.0.1';

    /**
     * 内部工具，输出调试信息
     *
     * @param {string} str 要输出到控制台的信息
     * @param {string} func 输出类型，即console对应的方法
     */
    function log(str, func) {
        /* eslint-disable */
        str = str || '';
        func = typeof console[func] === 'function' ? func : 'log';
        console[func](str);
        /* eslint-enable */
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
     * 内部工具，包装callback回调
     *
     * @param {Object} me fs对象实例
     * @param {Function} callback 待封包的函数
     * @return {Function} 封号包的函数
     */
    function bind(me, callback) {
        callback = typeof callback === 'function' ? callback : function () {};
        me = me || {};
        return function () {
            callback.apply(me, arguments);
        };
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
         * 读取当前目录
         *
         * @param {Function} callback 回调函数
         * @param {?string} dir 相对路径
         */
        me.dir = function (callback, dir) {
            callback = bind(this, callback);
            fs.root.getDirectory(joinPath(currentDirectory.fullPath, dir), {}, gotDirectory, callback);
            function gotDirectory(dirEntry) {
                var reader = dirEntry.createReader();
                reader.readEntries(callback, callback);
            }
        };

        /**
         * 切换当前目录
         *
         * @param {string} dir 相对路径
         * @param {Function} callback 回调函数
         */
        me.cd = function (dir, callback) {
            callback = bind(this, callback);
            fs.root.getDirectory(joinPath(currentDirectory.fullPath, dir), {}, gotDirectory, callback);
            function gotDirectory(evt) {
                currentDirectory = evt;
                callback(evt);
            }
        };

        /**
         * 创建目录，不递归创建
         *
         * @param {string} dir 相对路径
         * @param {Function} callback 回调函数，创建成功，回传dirEntry
         */
        me.md = function (dir, callback) {
            callback = bind(this, callback);
            fs.root.getDirectory(joinPath(currentDirectory.fullPath, dir), {create: true}, callback, callback);
        };

        /**
         * 删除目录
         * 只删除空目录
         *
         * @param {string} dir 相对路径
         * @param {Function} callback 回调
         */
        me.rd = function (dir, callback) {
            callback = bind(this, callback);
            fs.root.getDirectory(joinPath(currentDirectory.fullPath, dir), {}, gotDirectory, callback);
            function gotDirectory(dirEntry) {
                dirEntry.remove(callback, callback);
            }
        };

        /**
         * 删除目录及其内部所有内容
         *
         * @param {string} dir 相对路径
         * @param {Function} callback 回调
         */
        me.deltree = function (dir, callback) {
            callback = bind(this, callback);
            fs.root.getDirectory(joinPath(currentDirectory.fullPath, dir), {}, gotDirectory, callback);
            function gotDirectory(dirEntry) {
                dirEntry.removeRecursively(callback, callback);
            }
        };

        /**
         * 创建文件
         * 如果存在同名文件则抛错
         *
         * @param {string} filename 文件名（可含相对路径）
         * @param {Function} callback 回调函数
         */
        me.create = function (filename, callback) {
            callback = bind(this, callback);
            fs.root.getFile(
                joinPath(currentDirectory.fullPath, filename),
                {create: true, exclusive: true},
                callback, callback
            );
        };

        /**
         * 删除文件
         * 如果文件不存在则抛错
         *
         * @param {string} filename 完成文件名
         * @param {Function} callback 回调函数
         */
        me.del = function (filename, callback) {
            callback = bind(this, callback);
            fs.root.getFile(joinPath(currentDirectory.fullPath, filename), {create: false}, gotFile, callback);
            function gotFile(fileEntry) {
                fileEntry.remove(callback, callback);
            }
        };

        /**
         * 打开文件
         * 如果文件不存在则抛错
         *
         * @param {string} filename 完成文件名
         * @param {Function} callback 回调函数
         */
        me.open = function (filename, callback) {
            callback = bind(this, callback);
            fs.root.getFile(joinPath(currentDirectory.fullPath, filename), {create: false}, callback, callback);
        };

        /**
         * 复制
         * 复制文件或目录到指定目录
         *
         * @param {string} src 源相对路径
         * @param {string} dest 相对目标目录
         * @param {Function} callback 回调函数
         */
        me.copy = function (src, dest, callback) {
            callback = bind(this, callback);
            dest = joinPath(currentDirectory.fullPath, dest);
            src = joinPath(currentDirectory.fullPath, src);
            fs.root.getDirectory(dest, {}, gotDest, callback);
            function gotDest(destEntry) {
                fs.root.getFile(src, {create: false}, gotSrc, tryDirectory);
                function gotSrc(srcEntry) {
                    srcEntry.copyTo(destEntry, null, callback, callback);
                }
                function tryDirectory() {
                    fs.root.getDirectory(src, {}, gotSrc, callback);
                }
            }
        };

        /**
         * 移动
         * 移动文件或目录到指定目录
         *
         * @param {string} src 源相对路径
         * @param {string} dest 相对目标目录
         * @param {Function} callback 回调函数
         */
        me.move = function (src, dest, callback) {
            callback = bind(this, callback);
            dest = joinPath(currentDirectory.fullPath, dest);
            src = joinPath(currentDirectory.fullPath, src);
            fs.root.getDirectory(dest, {}, gotDest, callback);
            function gotDest(destEntry) {
                fs.root.getFile(src, {create: false}, gotSrc, tryDirectory);
                function gotSrc(srcEntry) {
                    srcEntry.moveTo(destEntry, null, callback, callback);
                }
                function tryDirectory() {
                    fs.root.getDirectory(src, {}, gotSrc, callback);
                }
            }
        };


        /**
         * 重命名
         * 重命名文件夹或文件
         *
         * @param {string} oldname 源文件或目录的相对路径
         * @param {string} newname 新名
         * @param {Function} callback 回调函数
         */
        me.ren = function (oldname, newname, callback) {
            callback = bind(this, callback);
            oldname = joinPath(currentDirectory.fullPath, oldname);
            fs.root.getDirectory(oldname, {}, got, tryFile);
            function got(entry) {
                entry.getParent(function (parentEntry) {
                    entry.moveTo(parentEntry, newname, callback, callback);
                });
            }
            function tryFile() {
                fs.root.getFile(oldname, {create: false}, got, callback);
            }
        };


        /**
         * 读取文件
         *
         * @param {string} src 文件路径，若不存在抛错
         * @param {Function} callback 回调函数
         * @param {?Object} param 读取配置
         * @param {?string} param.type 读取方式: readAsBinaryString, readAsText, readAsDataURL, readAsArrayBuffer
         * @param {?string} param.encoding 编码方式，type=readAsText时有效，默认utf8，
         *      在windows中文操作系统中读取本地文件时经常用gb2312
         */
        me.read = function (src, callback, param) {
            callback = bind(this, callback);
            src = joinPath(currentDirectory.fullPath, src);
            param = param || {};
            param.type = param.type || 'readAsText';
            param.encoding = param.encoding || 'utf8';
            fs.root.getFile(src, {}, gotFile, callback);
            function readFile(file) {
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    callback(e);
                };
                if (typeof reader[param.type] === 'function') {
                    reader[param.type](file, param.encoding);
                }
            }
            function gotFile(fileEntry) {
                fileEntry.file(readFile, callback);
            }
        };

        /**
         * 写文件
         * 文件不存在，则创建；不指定append，则清空文件从头写入，否则追加写入
         *
         * @param {string} src 文件路径，若不存在抛错
         * @param {Object} param 写入配置
         * @param {Blob} param.data 待写入的数据，以封装好的blob
         * @param {?boolean} param.append 是否以追加形式写入
         * @param {Function} callback 回调函数
         */
        me.write = function (src, param, callback) {
            callback = bind(this, callback);
            src = joinPath(currentDirectory.fullPath, src);
            param = param || {};
            param.data = param.data instanceof Blob ? param.data : new Blob(['']);
            param.append = param.hasOwnProperty('append') ? param.append : false;
            fs.root.getFile(src, {create: true}, (param.append ? gotFile : deleteFile), callback);
            function gotFile(fileEntry) {
                fileEntry.createWriter(gotWriter);
            }
            function deleteFile(fileEntry) {
                fileEntry.remove(createFile, callback);
            }
            function createFile() {
                fs.root.getFile(src, {create: true}, gotFile, callback);
            }
            function gotWriter(fileWriter) {
                fileWriter.seek(fileWriter.length);
                fileWriter.onwriteend = function (e) {
                    callback(e);
                };
                fileWriter.write(param.data);
            }
        };

        /**
         * 获取当前目录句柄
         *
         * @param {Object} 目录操作句柄
         */
        me.getWorkingDirectory = function () {
            return currentDirectory;
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
            return new FileSystem(param, callback);
        }
        callback = typeof callback === 'function' ? callback : function () {};
        param = param || {};
        var size = (~~param.size) || 1024 * 1024 * 100; // 100MB
        var malloc = window.requestFileSystem || window.webkitRequestFileSystem;
        var me = this;

        // 分配空间，申请文件操作句柄
        if (typeof malloc === 'function') {
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
    }


})(window);
