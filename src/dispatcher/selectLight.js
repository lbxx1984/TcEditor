/**
 * @file 选择物体
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function(key, anchor) {
    const dataset = {
        selectedLight: null
    };
    const light = this.get('lights')[key];
    if (anchor) {
        dataset.selectedLight = anchor;
    }
    else if (light && light.visible && !light.tc.locked) {
        dataset.selectedLight = key;
    }
    dataset.selectedLight && this.fill(dataset);
}
