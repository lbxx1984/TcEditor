define(function (Require) {
    return {
        menu: [
            {
                label: 'Geometry',
                cmd: 'show-geometry',
                children: [
                    {label: 'Plane', cmd: 'create-plane'},
                    {label: 'Plane', cmd: 'create-plane'},
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
        ],
        controlBar: [
            {
                label: 'VIEWS',
                display: 'always',
                children: [
                    {label: '3D', class: '', cmd: 'view-3d', title: 'Press 1', selector: '3d'},
                    {label: 'XOZ', class: '', cmd: 'view-xoz', title: 'Press 2', selector: 'xoz'},
                    {label: 'XOY', class: '', cmd: 'view-xoy', title: 'Press 3', selector: 'xoy'},
                    {label: 'YOZ', class: '', cmd: 'view-yoz', title: 'Press 4', selector: 'yoz'}
                ]
            },
            {
                label: 'TOOLS',
                display: 'always',
                children: [
                    {
                        label: '', class: ' icon icon-yidong', cmd: 'tool-pickgeo',
                        title: 'pick up geometry (S)', selector: 'pickgeo'
                    },
                    {
                        label: '', class: ' icon icon-shuxingxuanze', cmd: 'tool-pickjoint',
                        title: 'pick up joints of geometry (B)', selector: 'pickjoint'
                    }
                ]
            }
        ]
    };
});