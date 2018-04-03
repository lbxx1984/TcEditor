/**
 * @file 判断是否是已经选中的灯光
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(key, me) {
    const selectedLight = me.get('selectedLight');
    if (typeof selectedLight === 'string' && selectedLight === key) {
        return true;
    }
    if (selectedLight && selectedLight.tc && selectedLight.tc.lightKey === key) {
        return true;
    }
    return false;
}
