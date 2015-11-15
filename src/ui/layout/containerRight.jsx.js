define(function (require) {

    var config = require('config');
    var MousePositionBar = require('component/mousePositionBar.jsx');
    var Stage = require('component/stage.jsx');

    return React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            var props = this.props;
            var stageProps = {
                commandRouting: props.commandRouting
            };
            return (
                <div className="container-right">
                    <Stage {...stageProps} ref="stageContent"/>
                    <MousePositionBar ref="mousepositionbar"/>
                </div>
            );
        }
    });
})