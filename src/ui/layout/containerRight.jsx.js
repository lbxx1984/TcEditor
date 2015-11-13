define(function (require) {

    var config = require('config');
    var MousePositionBar = require('component/mousePositionBar.jsx');
    var TabNavigator = require('component/tabNavigator.jsx');
    var Stage = require('component/stage.jsx');
    var Material = require('component/material.jsx');
    var Geometry = require('component/geometry.jsx');

    return React.createClass({
        getInitialState: function () {
            return {
                activetab: config.defaultCommandState.activetab
            };
        },
        render: function () {

            var props = this.props;

            var tabProps = {
                datasource: config.tab,
                clickHandler: tabClickHandler,
                activetab: this.state.activetab
            };
            var stageProps = {
                display: this.state.activetab === 'stage' ? 'block' : 'none',
                commandRouting: props.commandRouting
            };
            var geometryProps = {
                display: this.state.activetab === 'geometry' ? 'block' : 'none'
            };
            var materialProps = {
                display: this.state.activetab === 'material' ? 'block' : 'none'
            };

            function tabClickHandler(e) {
                props.commandRouting(e.target.dataset.uiCmd);
            }

            return (
                <div className="container-right">
                    <TabNavigator {...tabProps}/>
                    <Stage {...stageProps} ref="stageContent"/>
                    <Geometry {...geometryProps}/>
                    <Material {...materialProps}/>
                    <MousePositionBar ref="mousepositionbar"/>
                </div>
            );
        }
    });
})