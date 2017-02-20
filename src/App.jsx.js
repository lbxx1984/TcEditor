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
    var MeshListPanel = require('./components/MeshListPanel.jsx');
    var ToolsBar = require('./components/ToolsBar.jsx');


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
            var style = {
                right: this.props.panel.length ? 301 : 0
            };
            var stage3dProps = {
                cameraRadius: this.props.stage.camera3D.cameraRadius,
                cameraAngleA: this.props.stage.camera3D.cameraAngleA,
                cameraAngleB: this.props.stage.camera3D.cameraAngleB,
                cameraLookAt: this.props.stage.camera3D.lookAt,
                gridVisible: this.props.stage.gridVisible,
                gridSize: this.props.stage.gridSize3D,
                gridStep: this.props.stage.gridStep3D,
                colorStage: this.props.stage.colorStage[1],
                colorGrid: this.props.stage.colorGrid[1],
                tool: this.props.tool,
                mesh3d: this.props.mesh3d,
                style: style,
                panelCount: this.props.panel.length,
                selectedMesh: this.props.selectedMesh,
                selectedVector: this.props.selectedVector,
                transformer3Dinfo: this.props.transformer3Dinfo,
                morpher3Dinfo: this.props.morpher3Dinfo
            };
            var informationBarProps = {
                mouse3d: this.props.mouse3d,
                style: style
            };
            var commandBarProps = {
                datasource: this.props.command,
                view: this.props.view,
                tool: this.props.tool,
                gridVisible: this.props.stage.gridVisible,
                style: style
            };
            var menuProps = {
                panel: this.props.panel,
                menu: this.props.menu,
                cameraAngleA: this.props.stage.camera3D.cameraAngleA,
                style: style
            };
            var toolsBarProps = toolsBarPropsFactory(this.props);
            return (
                <div className="tc-root-container">
                    <Stage3D {...stage3dProps}/>
                    <Menu {...menuProps}/>
                    <CommandBar {...commandBarProps}/>
                    <InformationBar {...informationBarProps}/>
                    {this.props.panel.length ? panelFactory(this) : null}
                    {toolsBarProps ? <ToolsBar {...toolsBarProps}/> : null}
                </div>
            );
        }
    });


    function panelFactory(me) {
        var doms = [];
        me.props.panel.map(function (item, index) {
            switch (item.type) {
                case 'meshPanel':
                    var meshListProps = {
                        key: item.type,
                        item: item,
                        index: index,
                        mesh: me.props.mesh3d,
                        group: me.props.group,
                        selectedMesh: me.props.selectedMesh
                    };
                    doms.push(<MeshListPanel {...meshListProps}/>);
                    break;
                default:
                    break;
            }
        });
        return <div className="tc-panel-container">{doms}</div>;
    }


    function toolsBarPropsFactory(props) {
        if (props.tool === 'tool-pickGeometry') {
            return {
                tool: props.tool,
                datasource: props.transformer3DTools,
                controls: props.transformer3Dinfo
            };
        }
        if (props.tool === 'tool-pickJoint') {
            return {
                tool: props.tool,
                datasource: props.morpher3DTools
            };
        }
    }

});
