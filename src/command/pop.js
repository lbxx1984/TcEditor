define(function (Require) {

    var Dialog = require('widget/dialog.jsx');

    function openfile(me, url) {
        me.fs.read(url, got);
        function got(result) {
            if (result instanceof ProgressEvent && result.target.result.length > 0) {
                var content = result.target.result;
                console.log(content);
            }
        }
    }

    return {
        open: function () {
            var me = this;
            var hotkey = '|backspace|enter|esc|';
            var container = document.createElement('div');
            var dialog = null;
            var dialogProp = {
                title: 'Open File',
                content: require('component/explorer.jsx'),
                props: {
                    fs: this.fs,
                    onEnter: onEnter
                },
                onClose: onCancel
            };
            document.body.appendChild(container);
            dialog = React.render(React.createElement(Dialog, dialogProp), container);
            this.keyboard.addListener(hotkey, hotKeyHandler);
            return;
            function hotKeyHandler(e) {
                switch (e) {
                    case 'backspace': dialog.content.upClickHandler();break;
                    case 'enter': dialog.content.enterClickHandler();break;
                    case 'esc': onCancel();break;
                    default: break;
                }
            }
            function onEnter(path) {
                openfile(me, path);
                onCancel();
            }
            function onCancel() {
                React.unmountComponentAtNode(container);
                document.body.removeChild(container);
                me.keyboard.removeListener(hotkey);
            }
        },
        save: function () {
            var path = '/' + window.editorKey + '/' + window.editorKey + 'conf';
            var data = new Blob([this.io.getEditorConf()]);
            this.fs.write(path, {data: data}, function () {
                console.log('conf saved!');
            });
        },
        saveas: function () {}
    };
});
