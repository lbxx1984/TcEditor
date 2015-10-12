define([
    'React', '../config', './menu.jsx', './controlBar.jsx', './stage.jsx'
], function (React, config, Menu, ControlBar, Stage) {
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
                    <Stage ref="stage"/>
                    <Menu {...menuProps}/>
                    <ControlBar {...controlBarProps}/>
                </div>
            );
        }
    });
});