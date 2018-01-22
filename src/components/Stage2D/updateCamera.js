/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import {CAMERA_RADIUS_FOR_2D_SCALE} from  './config';

export default function updateCamera(nextProps, me) {
    if (JSON.stringify(nextProps.style) !== JSON.stringify(me.props.style)) {
        setTimeout(function () {
            me.svgRenderer.setSize(me.refs.container.offsetWidth, me.refs.container.offsetHeight); 
        }, 10);
    }
    if (
        nextProps.axis.join('') !== me.props.axis.join('')
        || nextProps.cameraRadius !== me.props.cameraRadius
        || nextProps.cameraLookAt !== me.props.cameraLookAt
        || nextProps.cameraAngleA !== me.props.cameraAngleA
        || nextProps.cameraAngleB !== me.props.cameraAngleB
        || nextProps.style.right !== me.props.style.right
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
