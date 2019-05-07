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
        const rootClassName = `tc-root-container ${hasPanelBar ? 'has-panel-bar' : ''}`;
        const stageClassName = `tc-stage-container tc-stage-view-${view}`;
        return (
            <div className={rootClassName}>
                <div className={stageClassName}>
                    {stageRenderer(this)}
                </div>
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
        stage, timer, view, tool, mesh3d, lights,
        selectedMesh, selectedVector, selectedVectorIndex, selectedLight,
        transformer3Dinfo, morpher3Dinfo
    } = me.props;
    const {camera3D, colorGrid, colorStage, gridVisible, gridSize3D, gridStep3D} = stage;
    const {cameraRadius, cameraAngleA, cameraAngleB, lookAt} = camera3D;
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
        selectedMesh,
        selectedVector,
        selectedVectorIndex,
        selectedLight,
        transformer3Dinfo,
        morpher3Dinfo
    };
    if (view === '3d') {
        return <Stage3D {...stage3dProps}/>;
    }
    else if (view === 'all') {
        return [
            <Stage3D {...stage3dProps} key="3d"/>,
            <Stage2D {...stage2dProps} axis={['x', 'y']} key="xy"/>,
            <Stage2D {...stage2dProps} axis={['x', 'z']} key="xz"/>,
            <Stage2D {...stage2dProps} axis={['z', 'y']} key="zy"/>
        ];
    }
    else {
        return <Stage2D {...stage2dProps} axis={view.split('o')}/>;
    }
}
