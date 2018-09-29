/**
 * @file 3D 舞台 更新灯光列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function updateLightList(prevProps, me) {
    const nextProps = me.props;
    if (nextProps.lights === prevProps.lights) return;
    me.lightHelper.lights = nextProps.lights;
    const oldLightHash = {
        ...prevProps.lights
    };
    me.lightArray = [];
    Object.keys(nextProps.lights).map(key => {
        const light = nextProps.lights[key];
        me.lightArray.push(light);
        delete oldLightHash[key];
        if (light.tc.add) return;
        light.tc.add = true;
        me.scene.add(light);
    });
    Object.keys(oldLightHash).map(key => {
        const light = oldLightHash[key];
        me.scene.remove(light);
        let anchor = null;
        me.lightHelper.anchorArray.map(function (item) {
            if (item.tc.lightKey === key) anchor = item;
        });
        anchor && me.scene.remove(anchor);
    });
}
