/**
 * @file 删除灯光
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import isSelectedLight from './util/isSelectedLight';

export default function(key) {
    const light = this.get('lights')[key];
    if (!light) return;
    const lights = {...this.get('lights')};
    const dataset = {lights};
    delete lights[key];
    if (isSelectedLight(key, this)) {
        dataset.selectedLight = null;
    }
    this.fill(dataset);
}
