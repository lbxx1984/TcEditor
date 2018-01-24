/**
 * @file 物体编辑器，事件工厂
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import isScaleAvailable from './isScaleAvailable';
import math from 'core/math';

export function getPositionChangeHandler(me, type) {
    const mesh = me.props.mesh;
    return function (e) {
        me.setState({
            ['pos' + type]: e.target.value
        });
        if (isNaN(e.target.value) || e.target.value === '') return;
        const pos = {
            x: mesh.position.x,
            y: mesh.position.y,
            z: mesh.position.z
        };
        pos[type] = +e.target.value;
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
        me.context.dispatch('updateTimer');
    };
}

export function getScaleChangeHandler(me, type) {
    const mesh = me.props.mesh;
    return function (e) {
        me.setState({
            ['scale' + type]: e.target.value
        });
        if (!isScaleAvailable(e.target.value)) return;
        mesh.scale[type] = +e.target.value;
        mesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
        me.context.dispatch('updateTimer');
    };
}

export function getVectorChangeHandler(me, type) {
    const mesh = me.props.mesh;
    const index = me.props.selectedVectorIndex;
    return function (e) {
        me.setState({
            ['vector' + type]: e.target.value
        });
        if (isNaN(e.target.value) || e.target.value === '') return;
        const vector = {
            x: me.state.vectorx,
            y: me.state.vectory,
            z: me.state.vectorz
        };
        vector[type] = +e.target.value;
        const pos = math.world2local(vector.x, vector.y, vector.z, mesh);
        mesh.geometry.vertices[index].x = pos[0];
        mesh.geometry.vertices[index].y = pos[1];
        mesh.geometry.vertices[index].z = pos[2];
        mesh.geometry.verticesNeedUpdate = true;
        mesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
        me.context.dispatch('updateTimer');
    };
}
