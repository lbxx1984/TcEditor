/**
 * @file 3D 舞台 更新坐标值
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import * as THREE from 'three';

export default function updateScene(prevProps, me) {
    const nextProps = me.props;
    if (nextProps.gridSize !== prevProps.gridSize || nextProps.gridStep !== prevProps.gridStep) {
        me.scene.remove(me.grid);
        me.grid = new THREE.GridHelper(
            nextProps.gridSize, nextProps.gridStep,
            nextProps.colorGrid, nextProps.colorGrid
        );
        me.grid.visible = nextProps.gridVisible;
        me.scene.add(me.grid);
    }
    if (nextProps.gridVisible !== prevProps.gridVisible) {
        me.grid.visible = nextProps.gridVisible;
        me.axis.visible = nextProps.gridVisible;
    }
    if (nextProps.panelCount !== prevProps.panelCount && nextProps.panelCount * prevProps.panelCount === 0) {
        setTimeout(function () {
            me.onResize();
        }, 0);
    }
}
