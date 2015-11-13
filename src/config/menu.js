define(function (Require) {
    return [
        {
            label: 'Geometry',
            cmd: 'show-geometry',
            children: [
                {label: 'Plane', cmd: 'create-plane'}
            ]
        },
        {
            label: 'Material',
            cmd: 'show-material',
            children: []
        },
        {
            label: 'Light',
            cmd: 'show-light',
            children: []
        }
    ];
});