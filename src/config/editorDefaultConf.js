define(function (Require) {
    return {
        defaultLight: {
            type: 'PointLight',
            name: 'default light',
            matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 900, 0, 1],
            color: 16777215,
            intensity: 1,
            distance: 0,
            decay: 1
        },
        camera: {
            a: 40,
            b: 45,
            r: 2000,
            l: [0, 0, 0],
            s: 2,
            o: [0, 0]
        },
        grid: {
            size: 2000,
            visible: true
        },
        controlBar: {
            cameraview: '3d',
            systemtool: 'cameramove',
            transformer: 'move',
            ransformerspace: 'world',
            enablebar: ''
        },
        transformer: {
            mode: 'move',
            space: 'world',
            size: 1
        }
    };
});
