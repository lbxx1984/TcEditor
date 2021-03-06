/**
 * @file 3D 舞台 更新灯光控制器
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateLightHelper(prevProps, me) {
    const nextProps = me.props;
    if (nextProps.tool === 'pickLight' && prevProps.tool !== 'pickLight') {
        me.lightHelper.attach();
    }
    if (typeof nextProps.selectedLight === 'string') {
        switchAnchorType();
        return;
    }
    if (nextProps.tool !== 'pickLight' && prevProps.tool === 'pickLight') {
        me.lightHelper.detach();
        me.lightHelper.controller.detach();
    }
    if (nextProps.selectedLight !== prevProps.selectedLight && nextProps.tool === 'pickLight') {
        me.lightHelper.controller[nextProps.selectedLight ? 'attach' : 'detach'](nextProps.selectedLight);
    }
    function switchAnchorType() {
        let anchor = null;
        me.lightHelper.anchorArray.map(function (item) {
            if (item.tc.lightKey === nextProps.selectedLight) {
                anchor = item;
            }
        });
        if (anchor) {
            me.context.dispatch('selectLight', null, anchor);
        }
    }
}
