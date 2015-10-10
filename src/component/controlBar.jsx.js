define(['React'], function (React) {
    return React.createClass({
        render: function () {

            //var clickHandler = this.props.clickHandler;

            function button(item) {
                var prop = {
                    className: 'control-bar-button iconfont' + item.class 
                };
                return <div {...prop}>{item.label}</div>;
            }

            function prepare(item) {
                return (
                    <div className="control-bar-item">
                        <div className="control-bar-label">{item.label}</div>
                        {item.children.map(button)}
                    </div>
                );
            }

            return (
                <div className="control-bar">{this.props.datasource.map(prepare)}</div>
            );
        }
    });
});