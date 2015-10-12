define([
    'React', '../config', './menu.jsx', './controlBar.jsx'
], function (React, config, Menu, ControlBar) {
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

            function controlBarClickHandler(e) {
                console.log(e);
            }

            return (
                <div className="container-left">
                    <Menu {...menuProps}/>
                    <ControlBar {...controlBarProps}/>
                </div>
            );
        }
    });
});