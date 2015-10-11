define([
    'React', '../config', './menu.jsx', './controlBar.jsx'
], function (React, config, Menu, ControlBar) {
    return React.createClass({
        render: function () {
            var props = this.props;
            function menuClickHandler(e) {
                props.commandRouting(e.target.dataset.uiCmd);
            }
            return (
                <div className="container-left">
                    <Menu datasource={config.menu} clickHandler={menuClickHandler}/>
                    <ControlBar datasource={config.controlBar} clickHandler={menuClickHandler}/>
                </div>
            );
        }
    });
});