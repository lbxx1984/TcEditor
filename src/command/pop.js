define(function (require) {

    var Dialog = require('uiTool/dialog');
    var Alert = require('uiTool/alert');
    // function openfile(me, url) {
    //     me.fs.read(url, got);
    //     function got(result) {
    //         if (result instanceof ProgressEvent && result.target.result.length > 0) {
    //             var content = result.target.result;
    //             console.log(content);
    //         }
    //     }
    // }

    return {
        open: function () {
            var me = this;
            var hotkey = '|backspace|enter|esc|';
            var dialog = new Dialog({
                onClose: function () {
                    me.keyboard.removeListener(hotkey);
                }
            });
            this.keyboard.addListener(hotkey, function (e) {
                switch (e) {
                    case 'backspace': dialog.ui.content.upClickHandler();break;
                    case 'enter': dialog.ui.content.enterClickHandler();break;
                    case 'esc': dialog.close();break;
                    default: break;
                }
            });
            dialog.pop({
                title: 'Open File',
                content: require('component/explorer.jsx'),
                props: {
                    fs: this.fs,
                    onEnter: function (path) {
                        console.log(path);
                        dialog.close();
                    }
                }
            });
        },
        save: function () {
            var path = '/' + window.editorKey + '/' + window.editorKey + 'conf';
            var data = new Blob([this.io.getEditorConf()]);
            var alert = new Alert({});
            this.fs.write(path, {data: data}, function () {
                alert.pop({message: 'File Saved!'});
            });
            this.io.getMeshes();
        },
        saveas: function () {}
    };
});
