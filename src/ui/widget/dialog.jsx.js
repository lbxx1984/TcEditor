define(function (require) {

    var DialogUI = React.createClass({
        getDefaultProps : function () {
            return {title: 'title'};
        },
        componentDidMount: function () {
            if (typeof this.props.content !== 'function') return;
            var me = this;
            this.content = React.render(
                React.createElement(this.props.content, this.props.contentProps),
                this.refs.content.getDOMNode(),
                function () {me.resize();}
            );
        },
        resize: function () {
            var dom = this.getDOMNode().parentNode;
            var doc = document.documentElement;
            var left = 0.5 * (doc.clientWidth - dom.clientWidth);
            var top = 0.38 * (doc.clientHeight - dom.clientHeight);
            dom.style.cssText = 'left:' + left + 'px;top:' + top + 'px';
        },
        closeHandler: function () {
            React.unmountComponentAtNode(this.refs.content.getDOMNode());
            typeof this.props.onClose === 'function' && this.props.onClose();
        },
        render: function () {
            return (
                <div>
                    <div className="title-bar">
                        <span>{this.props.title}</span>
                        <div className="iconfont icon-guanbi" onClick={this.closeHandler}></div>
                    </div>
                    <div ref="content" className="content"></div>
                </div>
            );
        }
    });

    /**
     * dialog构造函数
     */
    function Dialog() {
        this.container = document.createElement('div');
        this.container.className = 'dialog';
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
        document.body.appendChild(this.container);
        var me = this;
        param = param || {};
        this.ui = React.render(React.createElement(DialogUI, param), this.container, function () {
            var timer = setInterval(uiFocus, 10);
            function uiFocus() {
                if (!me.ui) return;
                clearInterval(timer);
                param.focus && me.ui.content.refs[param.focus].getDOMNode().focus();
            }
        });
    };

    /**
     * 关闭并销毁窗体
     */
    Dialog.prototype.close = function () {
        React.unmountComponentAtNode(this.container);
        document.body.removeChild(this.container);
        this.ui = null;
    };

    return Dialog;
});
