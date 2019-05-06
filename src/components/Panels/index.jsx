import React from 'react';
import MeshList from '../MeshList';
import LightList from '../LightList';
import GeometryEditor from '../GeometryEditor';
import MaterialEditor from '../MaterialEditor';
import './style.less';

export default function panelRenderer(me) {
    const {
        view, mesh3d, group, lights, activeGroup, timer,
        selectedMesh, selectedLight, selectedVectorIndex
    } = me.props;
    const component = {
        meshPanel: MeshList,
        lightPanel: LightList,
        geoEditor: selectedMesh ? GeometryEditor : null,
        mtlEditor: selectedMesh ? MaterialEditor : null
    };
    const props = {
        meshPanel: {mesh: mesh3d, group, activeGroup, selectedMesh},
        lightPanel: {lights, selectedLight},
        geoEditor: {mesh: selectedMesh, view, selectedVectorIndex, timer},
        mtlEditor: {mesh: selectedMesh, timer}
    };
    const doms = me.props.panel.map(item => {
        const {type, expend} = item;
        const baseProps = {key: type, type, expend};
        const Component = component[type];
        const itemProps = props[type];
        return Component ? <Component {...baseProps} {...itemProps}/> : null;
    }).filter(i => !!i);
    return doms.length ? <div className="tc-panel-container">{doms}</div> : null;
}
