/**
 * @file 应用入口
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var React = require('react');
    var Menu = require('./components/Menu.jsx');
    var CommandBar = require('./components/CommandBar.jsx');
    var InformationBar = require('./components/InformationBar.jsx');
    var Stage3D = require('./components/Stage3D.jsx');
    var Stage2D = require('./components/Stage2D.jsx');
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
            var informationBarProps = {
                mouse3d: this.props.mouse3d,
                style: style
            };
            var commandBarProps = {
                datasource: commandsFilter(this),
                view: this.props.view,
                tool: this.props.tool,
                gridVisible: this.props.stage.gridVisible,
                style: style
            };
            var menuProps = {
                panel: this.props.panel,
                menu: this.props.menu,
                style: style
            };
            var toolsBarProps = toolsBarPropsFactory(this.props);
            return (
                <div className="tc-root-container">
                    {stageFactory(this)}
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
            var datasource = JSON.parse(JSON.stringify(props.morpher3DTools));
            var color = props.morpher3Dinfo.anchorColor.toString(16);
            while(color.length < 6) color = '0' + color;
            datasource[0].color = '#' + color;
            return {
                tool: props.tool,
                datasource: datasource
            };
        }
    }

    function commandsFilter(me) {
        return me.props.command.map(filter);
        function filter(item) {
            if (typeof item === 'string') return item;
            var disabled =  me.props.view !== 'view-3d' && me.props.view !== 'view-all'
                && 'stage-enlargeGride;stage-narrowGrid;'.indexOf(item.value) > -1
                ? true : false
            return _.extend({}, item, {disabled: disabled});
        }
    }

    function stageFactory(me) {
        var cameraConfig = me.props.stage.camera3D;
        var right = me.props.panel.length ? 301 : 0;
        var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - right;
        var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 110;
        var stage2dProps = {
            timer: me.props.timer,
            cameraRadius: cameraConfig.cameraRadius,
            cameraAngleA: cameraConfig.cameraAngleA,
            cameraAngleB: cameraConfig.cameraAngleB,
            cameraLookAt: cameraConfig.lookAt,
            gridColor: me.props.stage.colorGrid[0],
            gridVisible: me.props.stage.gridVisible,
            view: me.props.view,
            tool: me.props.tool,
            mesh3d: me.props.mesh3d,
            selectedMesh: me.props.selectedMesh,
            transformer3Dinfo: me.props.transformer3Dinfo,
        };
        var stage3dProps = {
            cameraRadius: cameraConfig.cameraRadius,
            cameraAngleA: cameraConfig.cameraAngleA,
            cameraAngleB: cameraConfig.cameraAngleB,
            cameraLookAt: cameraConfig.lookAt,
            gridVisible: me.props.stage.gridVisible,
            gridSize: me.props.stage.gridSize3D,
            gridStep: me.props.stage.gridStep3D,
            colorStage: me.props.stage.colorStage[1],
            colorGrid: me.props.stage.colorGrid[1],
            view: me.props.view,
            tool: me.props.tool,
            mesh3d: me.props.mesh3d,
            lights: me.props.lights,
            panelCount: me.props.panel.length,
            selectedMesh: me.props.selectedMesh,
            selectedVector: me.props.selectedVector,
            selectedLight: me.props.selectedLight,
            transformer3Dinfo: me.props.transformer3Dinfo,
            morpher3Dinfo: me.props.morpher3Dinfo
        };
        if (me.props.view === 'view-3d') {
            return (<Stage3D {...stage3dProps} style={{right: right}}/>);
        }
        else if (me.props.view === 'view-all') {
            var doms = [];
            doms.push(<Stage3D {...stage3dProps} style={{right: right, left: width * 0.5, top: height * 0.5 + 82}}/>);
            doms.push(<Stage2D {...stage2dProps} style={{right: right, left: width * 0.5, bottom: height * 0.5 + 28}} axis={['x', 'y']}/>);
            doms.push(<Stage2D {...stage2dProps} style={{right: right + width * 0.5, bottom: height * 0.5 + 28}} axis={['x', 'z']}/>);
            doms.push(<Stage2D {...stage2dProps} style={{right: right + width * 0.5, top: height * 0.5 + 82}} axis={['z', 'y']}/>);
            return doms;
        }
        else {
            return (<Stage2D {...stage2dProps} style={{right: right}} axis={me.props.view.replace('view-', '').split('o')}/>);
        }
    }
});
