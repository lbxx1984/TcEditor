/**
 * @file 应用入口
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import React, {Component} from 'react';
import Menu from './components/Menu';
import CommandBar from './components/CommandBar';
import InformationBar from './components/InformationBar';
import Stage3D from './components/Stage3D';
import Stage2D from './components/Stage2D';
import MeshList from './components/MeshList';
import LightList from './components/LightList';
import GeometryEditor from './components/GeometryEditor';
import MaterialEditor from './components/MaterialEditor';
import ToolsBar from './components/ToolsBar';


    function commandsFilter(me) {
        const a = () => {
            return 1;
        };
        return me.props.command.map(filter);
        function filter(item) {
            if (typeof item === 'string') return item;
            var disabled =  me.props.view !== 'view-3d' && me.props.view !== 'view-all'
                && 'stage-enlargeGride;stage-narrowGrid;'.indexOf(item.value) > -1
                ? true : false
            return Object.assign({}, item, {disabled: disabled});
        }
    }



export default class Main extends Component {

    getChildContext() {
        return {
            dispatch: this.props.dispatch
        };
    }

    render() {
        const {mouse3d} = this.props;
        const style = {
            right: this.props.panel.length ? 301 : 0
        };
        const informationBarProps = {
            mouse3d,
            style
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
}

Main.childContextTypes = {
    dispatch: React.PropTypes.func
};

    function panelFactory(me) {
        var doms = [];
        me.props.panel.map(function (item, index) {
            switch (item.type) {
                case 'meshPanel':
                    var meshListProps = {
                        key: item.type,
                        type: item.type,
                        expend: item.expend,
                        mesh: me.props.mesh3d,
                        group: me.props.group,
                        activeGroup: me.props.activeGroup,
                        selectedMesh: me.props.selectedMesh
                    };
                    doms.push(<MeshList {...meshListProps}/>);
                    break;
                case 'lightPanel':
                    var lightListProps = {
                        key: item.type,
                        type: item.type,
                        expend: item.expend,
                        lights: me.props.lights,
                        selectedLight: me.props.selectedLight
                    };
                    doms.push(<LightList {...lightListProps}/>);
                    break;
                case 'geoEditor':
                    var geoEditorProps = {
                        key: item.type,
                        type: item.type,
                        expend: item.expend,
                        mesh: me.props.selectedMesh,
                        view: me.props.view,
                        selectedVectorIndex: me.props.selectedVectorIndex,
                        timer: me.props.timer
                    };
                    if (me.props.selectedMesh) {
                        doms.push(<GeometryEditor {...geoEditorProps}/>);
                    }
                    break;
                case 'mtlEditor':
                    var mtlEditorProps = {
                        key: item.type,
                        type: item.type,
                        expend: item.expend,
                        mesh: me.props.selectedMesh,
                        timer: me.props.timer
                    };
                    if (me.props.selectedMesh) {
                        doms.push(<MaterialEditor {...mtlEditorProps}/>);
                    }
                    break;
                default:
                    break;
            }
        });
        return <div className="tc-panel-container">{doms}</div>;
    }


    function toolsBarPropsFactory(props) {
        if (props.tool === 'tool-pickGeometry') {
            var datasource = JSON.parse(JSON.stringify(props.transformer3DTools));
            if (props.transformer3Dinfo.mode === 'rotate') {
                datasource.pop();
            }
            return {
                tool: props.tool,
                datasource: datasource,
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
            selectedVector: me.props.selectedVector,
            selectedVectorIndex: me.props.selectedVectorIndex,
            transformer3Dinfo: me.props.transformer3Dinfo,
            morpher3Dinfo: me.props.morpher3Dinfo
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
            selectedVectorIndex: me.props.selectedVectorIndex,
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
