define(function (require) {

    var Alert = require('uiTool/alert');

    function saveEditorConf(me) {
        var confPath = '/' + window.editorKey + '/' + window.editorKey + 'conf';
        var result = function () {return true;};
        return me.io.callExporter('conf').then(function (result) {
            return me.io.writeFile(confPath, new Blob([JSON.stringify(result)]));
        }).then(result, result);
    }

    return {
        open: function () {
            var me = this;
            var filepath = '';
            var alert = new Alert();
            saveEditorConf(me).then(function () {
                return me.io.openExplorer('Open');
            }).then(function (path) {
                filepath = path;
                return me.io.readFile(path, 'readAsArrayBuffer');
            }).then(function (result) {
                return me.io.callLoader(filepath.split('.').pop().toLowerCase(), result);
            }).then(
                function () {
                    document.title = 'TcEditor ' + filepath.split('/').pop();
                    me.filePath = filepath;
                },
                function (evt) {
                    if (evt) return; // close dialog by user.
                    document.title = 'TcEditor';
                    me.filePath = null;
                    alert.pop({message: 'File Open Failed'});
                }
            );
        },
        save: function () {
            var me = this;
            var writingPath = null;
            var alert = new Alert();
            saveEditorConf(me).then(function () {
                return me.filePath == null ? me.io.openExplorer('Save') : me.filePath;
            }).then(function (path) {
                writingPath = path.indexOf('.tcm') === path.length - 4 ? path : path + '.tcm';
                return me.io.callExporter('tcm');
            }).then(function (tcm) {
                return me.io.writeFile(writingPath, tcm);
            }).then(
                function () {
                    alert.pop({message: 'File Saved!'});
                    me.filePath = writingPath;
                    document.title = 'TcEditor ' + writingPath.split('/').pop();
                },
                function (evt) {
                    if (evt) return; // close dialog by user.
                    alert.pop({message: 'File Save Failed!'});
                }
            );
        },
        saveas: function () {
            var me = this;
            var writingPath = null;
            var alert = new Alert();
            saveEditorConf(me).then(function () {
                return me.io.openExplorer('Save');
            }).then(function (path) {
                writingPath = path.indexOf('.tcm') === path.length - 4 ? path : path + '.tcm';
                return me.io.callExporter('tcm');
            }).then(function (tcm) {
                return me.io.writeFile(writingPath, tcm);
            }).then(
                function () {
                    alert.pop({message: 'File Saved!'});
                    me.filePath = writingPath;
                    document.title = 'TcEditor ' + writingPath.split('/').pop();
                },
                function (evt) {
                    if (evt) return; // close dialog by user.
                    alert.pop({message: 'File Save Failed!'});
                }
            );
        },
        export: function () {
            var me = this;
            me.io.callExporter('tcm').then(function (tcm) {
                var filename = typeof me.filePath === 'string' ? me.filePath.split('/').pop() : new Date() + '.tcm';
                me.io.download(tcm, filename);
            });
        },
        import: function () {
            var me = this;
            var filepath = null;
            me.io.upload().then(function (file) {
                var content = file.blob;
                filepath = file.name;
                return me.io.callLoader(filepath.split('.').pop().toLowerCase(), content);
            }).then(
                function () {
                    document.title = 'TcEditor ' + filepath.split('/').pop();
                    me.filePath = null;
                },
                function (evt) {
                    document.title = 'TcEditor';
                    me.filePath = null;
                    alert.pop({message: 'File Import Failed'});
                }
            );
        }
    };
});
