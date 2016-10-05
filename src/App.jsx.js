/**
 * @file 应用入口
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var Menu = require('./components/Menu.jsx');
    var CommandBar = require('./components/CommandBar.jsx');
    var InformationBar = require('./components/InformationBar.jsx');
    var Stage3D = require('./components/Stage3D.jsx');


    return React.createClass({
        childContextTypes: {
            dispatch: React.PropTypes.func
        },
        // @override
        getChildContext: function () {
            return {
                dispatch: this.props.dispatch
            };
        },
        render: function () {
            var stage3dProps = {
                cameraRadius: this.props.stage.camera3D.cameraRadius,
                cameraAngleA: this.props.stage.camera3D.cameraAngleA,
                cameraAngleB: this.props.stage.camera3D.cameraAngleB,
                gridVisible: this.props.stage.gridVisible,
                gridSize: this.props.stage.gridSize3D,
                gridStep: this.props.stage.gridStep3D,
                colorStage: this.props.stage.colorStage[1],
                colorGrid: this.props.stage.colorGrid[1]
            };
            var informationBarProps = {
                mouse3d: this.props.mouse3d
            };
            var commandBarProps = {
                datasource: this.props.command,
                view: this.props.view,
                tool: this.props.tool,
                gridVisible: this.props.stage.gridVisible
            };
            return (
                <div className="tc-root-container">
                    <Menu menu={this.props.menu}/>
                    <CommandBar {...commandBarProps}/>
                    <Stage3D {...stage3dProps}/>
                    <InformationBar {...informationBarProps}/>
                </div>
            );
        }
    });


});
