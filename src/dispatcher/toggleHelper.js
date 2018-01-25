/**
 * @file 显隐舞台辅助设备
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function () {
    const stage = {...this.get('stage')};
    stage.gridVisible = !stage.gridVisible;
    this.set('stage', stage);
}
