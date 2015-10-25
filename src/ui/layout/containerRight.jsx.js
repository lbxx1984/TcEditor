define([
    'config', 'component/mousePositionBar.jsx', 'component/tabNavigator.jsx'
], function (config, MousePositionBar, TabNavigator) {
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

            function tabClickHandler(e) {
                props.commandRouting(e.target.dataset.uiCmd);
            }

            return (
                <div className="container-right">
                    <TabNavigator {...tabProps}/>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>asd
                    <MousePositionBar ref="mousepositionbar"/>
                </div>
            );
        }
    });
});