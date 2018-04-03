/**
 * @file 锁定灯光
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import isSelectedLight from './util/isSelectedLight';

export default function(key) {
    const dataset = {
        timer: +new Date()
    };
    const light = this.get('lights')[key];
    if (!light) return;
    light.tc.locked = !light.tc.locked;
    if (isSelectedLight(key, this)) {
        dataset.selectedLight = null;
    }
    this.fill(dataset);
}
