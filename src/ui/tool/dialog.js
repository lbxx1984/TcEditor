define(function (require) {

    var DialogUI = require('widget/dialog.jsx');

    /**
     * dialog构造函数
     *
     * @param {Object} param 构造配置
     * @param {Function} param.onClose 窗体销毁后的回调
     */
    function Dialog(param) {
        this.container = document.createElement('div');
        this.param = param || {};
    }

    /**
     * 弹出dialog
     *
     * @param {Object} param dialog配置
     * @param {?string} param.title 标题
     * @param {Function} param.content dialog中的子内容
     * @param {Object} param.props content初始化时传入的参数
     */
    Dialog.prototype.pop = function (param) {
        param = param || {};
        var me = this;
        document.body.appendChild(me.container);
        param.onClose = function () {me.close()};
        me.ui = React.render(React.createElement(DialogUI, param), this.container, function (ui) {
            var timer = setInterval(uiFocus, 10);
            function uiFocus() {
                if (!me.ui) return;
                clearInterval(timer);
                if (param.focus) {
                    me.ui.content.refs[param.focus].getDOMNode().focus();
                } 
            }
        });
    };

    /**
     * 关闭并销毁窗体
     *
     * @param {boolean} callOnClose 是否调用默认回调
     */
    Dialog.prototype.close = function (callOnClose) {
        React.unmountComponentAtNode(this.container);
        document.body.removeChild(this.container);
        this.ui = null;
        callOnClose = callOnClose === undefined ? true : callOnClose;
        if (typeof this.param.onClose === 'function' && callOnClose) {
            this.param.onClose();
        }
    };

    return Dialog;
});
