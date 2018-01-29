/**
 * @file 将灯光拾取到model中
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import clearObject3dColor from './clearObject3dColor';

export default function(selectedLight, intersected, me) {
    if (selectedLight && selectedLight.uuid === intersected.uuid) return;
    clearObject3dColor(selectedLight);
    if (intersected && intersected.tc.lightKey) {
        const light = me.get('lights')[intersected.tc.lightKey];
        if (!light || !light.visible || light.tc.locked) return
    }
    me.fill({
        selectedLight: intersected
    });
}
