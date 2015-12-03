define(function (require) {

    var MousePositionBar = require('component/mousePositionBar.jsx');
    var VerticalList = require('./VerticalList.jsx');

    return React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            var props = this.props;
            var vlProps = {
                commandRouting: props.commandRouting
            };
            return (
                <div className="container-right">
                    <VerticalList {...vlProps} ref="verticallist"/>
                    <MousePositionBar ref="mousepositionbar"/>
                </div>
            );
        }
    });
})