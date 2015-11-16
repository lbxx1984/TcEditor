define(function (require) {

    var config = require('config');
    var MousePositionBar = require('component/mousePositionBar.jsx');
    var VerticalList = require('component/VerticalList.jsx');

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