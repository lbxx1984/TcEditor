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
import ToolsBar from './components/ToolsBar';
import panelRenderer from './components/Panels';

import getToolsBarProps from './components/ToolsBar/getToolsBarProps';


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
        menu: PropTypes.array.isRequired,
        command: PropTypes.array.isRequired
    }

    getChildContext() {
        return {
            dispatch: this.props.dispatch
        };
    }

    render() {
        const {mouse3d, panel, view, tool, stage: {gridVisible}, menu, command: datasource} = this.props;
        const panels = panelRenderer(this);
        const hasPanelBar = !!panels;
        const informationBarProps = {mouse3d, hasPanelBar};
        const commandBarProps = {datasource, view, tool, gridVisible, hasPanelBar};
        const menuProps = {panel, menu, tool, hasPanelBar};
        const toolsBarProps = getToolsBarProps(this.props);
        return (
            <div className="tc-root-container">
                {stageRenderer(this)}
                <Menu {...menuProps}/>
                <CommandBar {...commandBarProps}/>
                <InformationBar {...informationBarProps}/>
                {panels}
                {toolsBarProps[tool] ? <ToolsBar {...toolsBarProps[tool]}/> : null}
            </div>
        );
    }
}

// 渲染主舞台
function stageRenderer(me) {
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
    if (view === '3d') {
        return <Stage3D {...stage3dProps} style={{right: right}}/>;
    }
    else if (me.props.view === 'all') {
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
            axis: view.split('o'),
            style: {right}
        };
        return <Stage2D {...stage2dProps} {...props2D}/>;
    }
}
