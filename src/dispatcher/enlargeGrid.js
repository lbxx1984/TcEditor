/**
 * @file 放大坐标纸
 * @author Brian Li
 * @email lbxxlht@163.com
 */

export default function () {
    const stage = {...this.get('stage')};
    stage.gridSize3D = Math.min(stage.gridSize3D + 1000, 20000);
    stage.gridStep3D = stage.gridSize3D / 50;
    this.set('stage', stage);
}
