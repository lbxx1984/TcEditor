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
                        content: require('widget/colorPicker.jsx'),
                        onClose: dialogCloseHandler(container)
                    }
                ),
                container
            );
        }
    };
});
