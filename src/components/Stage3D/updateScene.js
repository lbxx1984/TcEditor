/**
 * @file 3D 舞台 更新坐标值
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';

export default function updateScene(nextProps, me) {
    if (nextProps.gridSize !== me.props.gridSize || nextProps.gridStep !== me.props.gridStep) {
        me.scene.remove(me.grid);
        me.grid = new THREE.GridHelper(
            nextProps.gridSize, nextProps.gridStep,
            nextProps.colorGrid, nextProps.colorGrid
        );
        me.grid.visible = nextProps.gridVisible;
        me.scene.add(me.grid);
    }
    if (nextProps.gridVisible !== me.props.gridVisible) {
        me.grid.visible = nextProps.gridVisible;
        me.axis.visible = nextProps.gridVisible;
    }
    if (nextProps.panelCount !== me.props.panelCount && nextProps.panelCount * me.props.panelCount === 0) {
        setTimeout(function () {
            me.onResize();
        }, 0);
    }
}
