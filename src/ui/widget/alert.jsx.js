define(function (require) {
    return React.createClass({
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

            var minTop = document.body.scrollTop - dom.clientHeight - 5
            var maxTop = document.body.scrollTop + 5;
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
});
