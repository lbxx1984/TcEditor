define(function (Require) {
    return {
        light: [
            {
                type: 'PointLight',
                matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 900, 0, 1],
                color: 16777215,
                intensity: 1,
                distance: 0,
                decay: 1
            }
        ]
    };
});
