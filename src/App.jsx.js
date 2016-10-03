/**
 * @file 应用入口
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var Menu = require('./components/Menu.jsx');
    var CommandBar = require('./components/CommandBar.jsx');
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
                cameraRadius: this.props.stage.cameraRadius3D,
                colorStage: this.props.stage.colorStage[1],
                colorGrid: this.props.stage.colorGrid[1]
            };
            return (
                <div className="tc-root-container">
                    <Menu menu={this.props.menu}/>
                    <CommandBar datasource={this.props.command}/>
                    <Stage3D {...stage3dProps}/>
                </div>
            );
        }
    });


});
