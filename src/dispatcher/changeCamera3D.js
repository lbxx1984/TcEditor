/**
 * @file 更新3D摄像机
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function (param) {
    const stage = {...this.get('stage')};
    stage.camera3D = {
        ...stage.camera3D,
        ...param
    };
    this.set('stage', stage);
}
