/**
 * @file 3D 舞台 渲染器工厂
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function animaterFactory(me) {
    return function () {
        me.camera.lookAt(me.props.cameraLookAt);
        me.renderer.render(me.scene, me.camera);
        if (me.props.tool === 'tool-pickLight') {
            me.lightHelper.update();
        }
        if (me.props.tool === 'tool-pickLight' && me.props.selectedLight) {
            me.lightHelper.controller.update();
        }
        if (me.props.tool === 'tool-pickGeometry' && me.props.selectedMesh) {
            me.transformer.update();
        }
        if (me.props.tool === 'tool-pickJoint' && me.props.selectedVector) {
            me.morpher.controller.update();
        }
    };
}
