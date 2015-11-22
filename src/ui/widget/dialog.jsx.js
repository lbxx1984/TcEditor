define(function (require) {
    return React.createClass({
        getDefaultProps : function () {
            return {title: 'title'};
        },
        resize: function () {
            var dom = this.getDOMNode();
            var doc = document.documentElement;
            dom.className = 'dialog';
            dom.style.cssText = 'left:' + 0.5 * (doc.clientWidth - dom.clientWidth) + 'px;'
                + 'top:' + (0.38 * (doc.clientHeight - dom.clientHeight) + document.body.scrollTop) + 'px';
        },
        componentDidMount: function () {
            // 装载子对象
            if (typeof this.props.content === 'function') {
                var contentProps = this.props.props;
                contentProps.onClose = this.closeHandler;
                this.content = React.render(
                    React.createElement(this.props.content, contentProps),
                    this.refs.content.getDOMNode()
                );
            }
            // 重新设置Dialog位置
            this.resize();
        },
        closeHandler: function () {
            React.unmountComponentAtNode(this.refs.content.getDOMNode());
            if (typeof this.props.onClose === 'function') {
                this.props.onClose();
            }
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
});
