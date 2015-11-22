define(function (Require) {

    var Dialog = require('widget/dialog.jsx');

    function dialogCloseHandler(container) {
        return function () {
            React.unmountComponentAtNode(container);
            document.body.removeChild(container);
        };
    }

    return {
        openfile: function () {
            var container = document.createElement('div');
            document.body.appendChild(container);
            React.render(
                React.createElement(
                    Dialog,
                    {
                        title: 'Open File',
                        content: require('component/explorer.jsx'),
                        props: {fs: this.fs},
                        onClose: dialogCloseHandler(container)
                    }
                ),
                container
            );
        }
    };
});
