define(function (Require) {

    var Dialog = require('widget/dialog.jsx');
    var saving = false;

    function openfile(me, url) {
        me.fs.read(url, got);
        function got(result) {
            if (result instanceof ProgressEvent && result.target.result.length > 0) {
                var content = result.target.result;
                console.log(content);
            }
        }
    }

    function savefile(me, url) {
        // if (saving) {
        //     return;
        // }
        // saving = true;
        // // 临时随便写点儿东西
        // var content = '';
        // for (var i = 0; i < 100; i++) content += Math.random() + ';';
        // //
        // me.fs.write(url, {data: new Blob([content])}, saved);
        // function saved() {
        //     saving = false;
        // }
    }

    return {
        openfile: function () {
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
        saveas: function () {
            // var me = this;
            // var container = document.createElement('div');
            // var closeHandler = dialogCloseHandler(container);
            // document.body.appendChild(container);
            // function onEnter(path) {
            //     savefile(me, path);
            //     closeHandler();
            // }
            // React.render(
            //     React.createElement(
            //         Dialog,
            //         {
            //             title: 'Save File As',
            //             content: require('component/explorer.jsx'),
            //             props: {
            //                 fs: this.fs,
            //                 button1: 'Save As',
            //                 mode: 'saveas',
            //                 onEnter: onEnter
            //             },
            //             onClose: closeHandler
            //         }
            //     ),
            //     container
            // );
        }
    };
});
