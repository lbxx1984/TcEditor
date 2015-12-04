define(function (require) {

    var config = require('config');
    var Menu = require('widget/menu.jsx');
    var ControlBar = require('component/controlBar.jsx');
    var ContainerStage = require('layout/containerStage.jsx');

    return React.createClass({
        menuClickHandler: function (e) {
            this.props.commandRouting(e.target.dataset.uiCmd);
        },
        controlBarClickHandler: function (e, v) {
            this.props.commandRouting(e, v);
        },
        render: function () {
            var me = this;
            var menuProps = {
                datasource: config.menu,
                clickHandler: me.menuClickHandler
            };
            var controlBarProps = {
                ref: 'controlbar',
                datasource: config.controlBar,
                clickHandler: me.controlBarClickHandler
            };
            var stageProps = {
                ref: 'stage',
                commandRouting: me.props.commandRouting
            };
            return (
                <div className="container-left">
                    <ContainerStage {...stageProps}/>
                    <Menu {...menuProps}/>
                    <ControlBar {...controlBarProps}/>
                </div>
            );
        }
    });
});