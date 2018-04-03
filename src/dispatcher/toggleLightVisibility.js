/**
 * @file 切换灯光的显示状态
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
    light.visible = !light.visible;
    if (isSelectedLight(key, this)) {
        dataset.selectedLight = null;
    }
    this.fill(dataset);
}
