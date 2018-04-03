/**
 * @file 重置摄像机
 * @author Brian Li
 * @email lbxxlht@163.com
 */
export default function () {
    this.fill({
        stage: {
            colorStage: ['#3D3D3D', 0x3d3d3d],
            colorGrid: ['#8F908A', 0x8F908A],
            camera3D: {
                cameraRadius: 1000,
                cameraAngleA: 40,
                cameraAngleB: 45,
                lookAt: {x: 0, y: 0, z: 0}
            },
            gridVisible: true,
            gridSize3D: 2500,
            gridStep3D: 50
        },
        mouse3d: {x: 0, y: 0, z: 0}
    });
}
