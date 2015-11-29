define(function (require) {
    return [
        {
            label: 'File',
            cmd: 'show-file',
            children: [
                {label: 'Open', cmd: 'pop-open', hotKey: 'ctrl + o'},
                {label: 'Save', cmd: 'pop-save', hotKey: 'ctrl + s'},
                {label: 'Save As', cmd: 'pop-saveas', hotKey: 'ctrl + shift + s'}
            ]
        },
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