define(function (require) {

    var config = require('config');
    var Menu = require('component/menu.jsx');
    var ControlBar = require('component/controlBar.jsx');
    var ContainerStage = require('layout/containerStage.jsx');

    return React.createClass({
        render: function () {

            var props = this.props;

            var menuProps = {
                datasource: config.menu,
                clickHandler: menuClickHandler
            };

            var controlBarProps = {
                defaultState: config.defaultCommandState,
                datasource: config.controlBar,
                clickHandler: controlBarClickHandler
            };

            function menuClickHandler(e) {
                props.commandRouting(e.target.dataset.uiCmd);
            }

            function controlBarClickHandler(e, v) {
                props.commandRouting(e, v);
            }

            return (
                <div className="container-left">
                    <ContainerStage ref="stage"/>
                    <Menu {...menuProps}/>
                    <ControlBar ref="controlbar" {...controlBarProps}/>
                </div>
            );
        }
    });
});