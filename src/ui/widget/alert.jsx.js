define(function (require) {

    var AlertUI = React.createClass({
        getInitialState: function () {
            return {
                left: 0,
                top: -999
            };
        },
        getDefaultProps : function () {
            return {message: 'contentasdasdidfuhdifugdhfg'};
        },
        componentDidMount: function () {

            var dom = this.getDOMNode();
            var doc = document.documentElement;
            dom.className = 'alert';

            var minTop = - dom.clientHeight - 5
            var maxTop = 5;
            var curTop = minTop;
            this.setState({left: 0.5 * (doc.clientWidth - dom.clientWidth), top: curTop});
            
            // -1弹出；0等待；1收回
            var state = -1;
            // 每帧移动的像素数
            var step = dom.clientWidth / 10;
            // 等待帧数
            var wait = 60;
            // 60FPS的速度播放移动
            var me = this;
            var timer = setInterval(function () {
                curTop = (state < 0) ? (curTop + step) : ((state > 0) ? (curTop - step) : curTop);
                me.setState({top: curTop});
                state = (state < 0) ? (curTop > maxTop ? 0 : state) : (wait > 0 ? 0 : 1);
                wait = (state === 0 && wait > 0) ? wait - 1 : wait;
                if (curTop < minTop) {
                    clearInterval(timer);
                    me.props.onClose();
                }
            }, 1000 / 60);
        },
        render: function () {
            var prop = {
                style: {
                    left: this.state.left,
                    top: this.state.top
                }
            };
            return (
                <div {...prop}>{this.props.message}</div>
            );
        }
    });

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
