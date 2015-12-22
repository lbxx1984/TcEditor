define(function (require) {


    var Alert = require('uiTool/alert');


    /**
     * 保存当前文件
     * 由于save和save as保存文件的流程是相同的，所以提出来
     *
     * @param {Object} me routing对象
     * @param {string} filePath 文件的路径
     */
    function writeFile(me, filePath) {
        me.io.writeTCM(filePath, function (result) {
            var alert = new Alert();
            if (result instanceof FileError) {
                alert.pop({message: 'File Save Failed!'});
                me.filePath = null;
            }
            else {
                alert.pop({message: 'File Saved!'});
                me.filePath = filePath;
            }
        });
    }


    return {
        open: function () {
            var me = this;
            var io = this.io;
            var filepath = '';
            var alert = new Alert();
            io.openExplorer('Open').then(
                function (path) {
                    filepath = path;
                    return io.readFile(path, 'readAsArrayBuffer');
                },
                function () {}
            ).then(
                function (result) {
                    document.title = 'TcEditor ' + filepath.split('/').pop();
                    me.filePath = filepath;
                    console.log(result);
                },
                function () {
                    document.title = 'TcEditor';
                    me.filePath = null;
                    alert.pop({message: 'File Open Failed'});
                }
            );
        },
        save: function () {
            var alert = new Alert();
            var io = this.io;
            var confPath = '/' + window.editorKey + '/' + window.editorKey + 'conf';
            io.callExporter('conf').then(
                function (result) {
                    return io.writeFile(confPath, new Blob([JSON.stringify(result)]));
                },
                function () {
                    alert.pop('Fail to Read System Configuration!');
                }
            ).then(
                function () {
                    console.log('save conf over');
                },
                function () {
                    alert.pop('Fail to Save System Configuration!');
                }
            )
            /**
            var me = this;
            this.io.writeEditorConf(function (result) {
                if (me.filePath === null) {
                    openExplorer(me, 'save', function (path) {writeFile(me, path);}, 'tcm');
                }
                else {
                    writeFile(me, me.filePath);
                }
            });
            */
        },
        saveas: function () {
            // var me = this;
            // this.io.writeEditorConf(function (result) {
            //     if (result instanceof FileError) {
            //         var alert = new Alert();
            //         alert.pop({message: 'Fail to Save System Configuration!'});
            //     }
            //     openExplorer(me, 'save', function (path) {writeFile(me, path);}, 'tcm');
            // });
        }
    };
});
