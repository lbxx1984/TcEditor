define(function (require) {

    var AlertUI = require('widget/alert.jsx');

    /**
     * dialog构造函数
     *
     * @param {Object} param 构造配置
     * @param {Function} param.onClose 窗体销毁后的回调
     */
    function Alert(param) {
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
    Alert.prototype.pop = function (param) {
        param = param || {};
        var me = this;
        document.body.appendChild(this.container);
        param.onClose = function () {me.close()};
        this.ui = React.render(React.createElement(AlertUI, param), this.container);
    };

    /**
     * 关闭并销毁窗体
     */
    Alert.prototype.close = function () {
        React.unmountComponentAtNode(this.container);
        document.body.removeChild(this.container);
        this.ui = null;
        if (typeof this.param.onClose === 'function') {
            this.param.onClose();
        }
    };

    return Alert;
});