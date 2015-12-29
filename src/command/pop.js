define(function (require) {

    var Alert = require('uiTool/alert');

    return {
        open: function () {
            var me = this;
            var filepath = '';
            var alert = new Alert();
            me.io.openExplorer('Open').then(function (path) {
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
                    document.title = 'TcEditor';
                    me.filePath = null;
                    alert.pop({message: 'File Open Failed'});
                }
            );
        },
        save: function () {
            var me = this;
            var confPath = '/' + window.editorKey + '/' + window.editorKey + 'conf';
            var writingPath = null;
            var alert = new Alert();
            me.io.callExporter('conf').then(function (result) {
                return me.io.writeFile(confPath, new Blob([JSON.stringify(result)]));
            }).then(
                function () {
                    return me.filePath == null ? me.io.openExplorer('Save') : me.filePath;
                },
                function () {
                    alert.pop('Fail to Save System Configuration!');
                    return me.filePath == null ? me.io.openExplorer('Save') : me.filePath;
                }
            ).then(function (path) {
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
                function () {
                    alert.pop({message: 'File Save Failed!'});
                }
            );
        },
        saveas: function () {
            var me = this;
            var confPath = '/' + window.editorKey + '/' + window.editorKey + 'conf';
            var writingPath = null;
            var alert = new Alert();
            me.io.callExporter('conf').then(function (result) {
                return me.io.writeFile(confPath, new Blob([JSON.stringify(result)]));
            }).then(
                function () {
                    return me.io.openExplorer('Save');
                },
                function () {
                    alert.pop('Fail to Save System Configuration!');
                    return me.io.openExplorer('Save');
                }
            ).then(function (path) {
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
                function () {
                    alert.pop({message: 'File Save Failed!'});
                }
            );
        }
    };
});
