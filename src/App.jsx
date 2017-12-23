/**
 * @file 应用入口
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
    const {command, view} = me.props;
    return command.map(item => {
        if (typeof item === 'string') return item;
        return Object.assign({}, item, {
            disabled: ['view-3d', 'view-all'].indexOf(view) < 0
                && ['stage-enlargeGride', 'stage-narrowGrid'].indexOf(item.value) > -1
        });
    });
}

function getToolsBarProps(props) {
    let datasource = null;
    switch (props.tool) {
        case 'tool-pickGeometry':
            datasource = JSON.parse(JSON.stringify(props.transformer3DTools));
            if (props.transformer3Dinfo.mode === 'rotate') {
                datasource.pop();
            }
            return {
                tool: props.tool,
                datasource: datasource,
                controls: props.transformer3Dinfo
            };
        case 'tool-pickJoint':
            datasource = JSON.parse(JSON.stringify(props.morpher3DTools));
            let color = props.morpher3Dinfo.anchorColor.toString(16);
            while(color.length < 6) color = '0' + color;
            datasource[0].color = '#' + color;
            return {
                tool: props.tool,
                datasource: datasource
            };
        default:
            break;
    }
}


export default class App extends Component {

    static childContextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        mouse3d: PropTypes.object.isRequired,
        panel: PropTypes.array.isRequired,
        view: PropTypes.string.isRequired,
        tool: PropTypes.string.isRequired,
        stage: PropTypes.object.isRequired,
        menu: PropTypes.array.isRequired
    }

    getChildContext() {
        return {
            dispatch: this.props.dispatch
        };
    }

    render() {
        const {mouse3d, panel, view, tool, stage, menu} = this.props;
        const style = {
            right: panel.length ? 301 : 0
        };
        const informationBarProps = {
            mouse3d,
            style
        };
        const commandBarProps = {
            datasource: commandsFilter(this),
            view,
            tool,
            gridVisible: stage.gridVisible,
            style
        };
        const menuProps = {
            panel,
            menu,
            style
        };
        const toolsBarProps = getToolsBarProps(this.props);
        return (
            <div className="tc-root-container">
                {stageFactory(this)}
                <Menu {...menuProps}/>
                <CommandBar {...commandBarProps}/>
                <InformationBar {...informationBarProps}/>
                {panel.length ? panelFactory(this) : null}
                {toolsBarProps ? <ToolsBar {...toolsBarProps}/> : null}
            </div>
        );
    }
}


function panelFactory(me) {
    const doms = [];
    const {
        view, mesh3d, group, lights, activeGroup, timer,
        selectedMesh, selectedLight, selectedVectorIndex
    } = me.props;
    me.props.panel.map(item => {
        const {type, expend} = item;
        switch (type) {
            case 'meshPanel':
                const meshListProps = {
                    key: type,
                    type,
                    expend,
                    mesh: mesh3d,
                    group,
                    activeGroup,
                    selectedMesh
                };
                doms.push(<MeshList {...meshListProps}/>);
                break;
            case 'lightPanel':
                const lightListProps = {
                    key: type,
                    type,
                    expend,
                    lights,
                    selectedLight
                };
                doms.push(<LightList {...lightListProps}/>);
                break;
            case 'geoEditor':
                const geoEditorProps = {
                    key: item.type,
                    type,
                    expend,
                    mesh: selectedMesh,
                    view,
                    selectedVectorIndex,
                    timer
                };
                if (selectedMesh) {
                    doms.push(<GeometryEditor {...geoEditorProps}/>);
                }
                break;
            case 'mtlEditor':
                const mtlEditorProps = {
                    key: item.type,
                    type,
                    expend,
                    mesh: selectedMesh,
                    timer
                };
                if (selectedMesh) {
                    doms.push(<MaterialEditor {...mtlEditorProps}/>);
                }
                break;
            default:
                break;
        }
    });
    return <div className="tc-panel-container">{doms}</div>;
}

function stageFactory(me) {
    const {
        stage, timer, view, tool, mesh3d, lights, panel,
        selectedMesh, selectedVector, selectedVectorIndex, selectedLight,
        transformer3Dinfo, morpher3Dinfo
    } = me.props;
    const {camera3D, colorGrid, colorStage, gridVisible, gridSize3D, gridStep3D} = stage;
    const {cameraRadius, cameraAngleA, cameraAngleB, lookAt} = camera3D;
    const right = panel.length ? 301 : 0;
    const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - right;
    const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 110;
    const stage2dProps = {
        timer,
        cameraRadius,
        cameraAngleA,
        cameraAngleB,
        cameraLookAt: lookAt,
        gridColor: colorGrid[0],
        gridVisible,
        view,
        tool,
        mesh3d,
        selectedMesh,
        selectedVector,
        selectedVectorIndex,
        transformer3Dinfo,
        morpher3Dinfo
    };
    const stage3dProps = {
        cameraRadius,
        cameraAngleA,
        cameraAngleB,
        cameraLookAt: lookAt,
        gridVisible,
        gridSize: gridSize3D,
        gridStep: gridStep3D,
        colorStage: colorStage[1],
        colorGrid: colorGrid[1],
        view,
        tool,
        mesh3d,
        lights,
        panelCount: panel.length,
        selectedMesh,
        selectedVector,
        selectedVectorIndex,
        selectedLight,
        transformer3Dinfo,
        morpher3Dinfo
    };
    if (view === 'view-3d') {
        return <Stage3D {...stage3dProps} style={{right: right}}/>;
    }
    else if (me.props.view === 'view-all') {
        const doms = [];
        const props3D = {
            key: '3d',
            style: {
                right,
                left: width * 0.5,
                top: height * 0.5 + 82
            }
        };
        const propsXOY = {
            key: 'xoy',
            axis: ['x', 'y'],
            style: {
                right,
                left: width * 0.5,
                bottom: height * 0.5 + 28
            } 
        };
        const propsXOZ = {
            key: 'xoz',
            axis: ['x', 'z'],
            style: {
                right: right + width * 0.5,
                bottom: height * 0.5 + 28
            }
        };
        const propsZOY = {
            key: 'zoy',
            axis: ['z', 'y'],
            style: {
                right: right + width * 0.5,
                top: height * 0.5 + 82
            }
        }
        doms.push(<Stage3D {...stage3dProps} {...props3D}/>);
        doms.push(<Stage2D {...stage2dProps} {...propsXOY}/>);
        doms.push(<Stage2D {...stage2dProps} {...propsXOZ}/>);
        doms.push(<Stage2D {...stage2dProps} {...propsZOY}/>);
        return doms;
    }
    else {
        const props2D = {
            axis: view.replace('view-', '').split('o'),
            style: {right}
        };
        return <Stage2D {...stage2dProps} {...props2D}/>;
    }
}
