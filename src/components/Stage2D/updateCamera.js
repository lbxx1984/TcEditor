/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import {CAMERA_RADIUS_FOR_2D_SCALE} from '../../config';

export default function updateCamera(prevProps, me) {
    const nextProps = me.props;
    if (JSON.stringify(nextProps.style) !== JSON.stringify(prevProps.style)) {
        setTimeout(function () {
            me.svgRenderer.setSize(me.refs.container.offsetWidth, me.refs.container.offsetHeight); 
        }, 10);
    }
    if (
        nextProps.axis.join('') !== prevProps.axis.join('')
        || nextProps.cameraRadius !== prevProps.cameraRadius
        || nextProps.cameraLookAt !== prevProps.cameraLookAt
        || nextProps.cameraAngleA !== prevProps.cameraAngleA
        || nextProps.cameraAngleB !== prevProps.cameraAngleB
        || nextProps.style.right !== prevProps.style.right
    ) {
        me.refs.container.style.right = nextProps.style.right + 'px';
        updateTools(me.renderer2D);
        updateTools(me.grid2D);
        updateTools(me.transformer2D);
        updateTools(me.morpher2D);
        me.grid2D.render();
        me.renderer2D.render();
        me.transformer2D.attach(me.transformer2D.mesh);
        me.morpher2D.attach(me.morpher2D.mesh);
        me.morpher2D.attachAnchor(me.morpher2D.index);
    }
    function updateTools(tool) {
        tool.axis = nextProps.axis;
        tool.cameraRadius = nextProps.cameraRadius / CAMERA_RADIUS_FOR_2D_SCALE;
        tool.cameraLookAt = me.grid2D.cameraLookAt = nextProps.cameraLookAt;
        tool.cameraAngleA = nextProps.cameraAngleA;
        tool.cameraAngleB = nextProps.cameraAngleB;
    }
}
