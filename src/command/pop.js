define(function (require) {


    var Dialog = require('uiTool/dialog');
    var Alert = require('uiTool/alert');


    /**
     * 打开explorer
     *
     * @param {Object} me routing对象
     * @param {string} mode explorer工作模式，open,save
     * @param {Function} callback 成功选择文件或创建文件后的回调，回传文件路径，explorer不负责创建文件，只回传路径
     * @param {string} filetype 保存时自动添加的文件扩展名
     */
    function openExplorer(me, mode, callback, filetype) {
        var hotkey = '|backspace|enter|esc|';
        var dialog = new Dialog({
            onClose: function () {
                me.keyboard.removeListener(hotkey);
            }
        });
        me.keyboard.addListener(hotkey, function (e) {
            switch (e) {
                case 'backspace': dialog.ui.content.upClickHandler();break;
                case 'enter': dialog.ui.content.enterClickHandler();break;
                case 'esc': dialog.close();break;
                default: break;
            }
        });
        dialog.pop({
            title: mode === 'save' ? 'Save' : 'Open',
            content: require('component/explorer.jsx'),
            focus: 'inputbox',
            props: {
                fs: me.fs,
                mode: mode,
                button1: mode === 'save' ? 'Save' : 'Open',
                filetype: filetype,
                onEnter: function (path) {
                    callback(path);
                    dialog.close();
                }
            }
        });
    }


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
            openExplorer(me, 'open', gotPath);
            function gotPath(path) {
                me.io.readTCM(path, function (result) {
                    if (typeof result === 'string') {
                        document.title = 'TcEditor';
                        me.filePath = null;
                        var alert = new Alert();
                        alert.pop({message: result});
                    }
                    else {
                        document.title = 'TcEditor ' + path.split('/').pop();
                        me.filePath = path;
                    }
                });
            }
        },
        save: function () {
            var me = this;
            this.io.writeEditorConf(function (result) {
                if (result instanceof FileError) {
                    var alert = new Alert();
                    alert.pop({message: 'Fail to Save System Configuration!'});
                }
                if (me.filePath === null) {
                    openExplorer(me, 'save', function (path) {writeFile(me, path);}, 'tcm');
                }
                else {
                    writeFile(me, me.filePath);
                }
            });
        },
        saveas: function () {
            var me = this;
            this.io.writeEditorConf(function (result) {
                if (result instanceof FileError) {
                    var alert = new Alert();
                    alert.pop({message: 'Fail to Save System Configuration!'});
                }
                openExplorer(me, 'save', function (path) {writeFile(me, path);}, 'tcm');
            });
        }
    };
});
