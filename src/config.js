define(function (require) {
    window.editorKey = '__tceditor__';
    return {
        editorDefaultConf: require('./config/editorDefaultConf'),
        defaultCommandState: {
            cameraview: '3d',
            systemtool: 'cameramove',
            transformer: 'move',
            transformerspace: 'world',
            enablebar: ''
        },
        menu: require('./config/menu'),
        controlBar: require('./config/controlBar'),
        meshGroup: [
            {name: 'test group1', uuid: 'asksdjfghisdhfguhdfg', close: false, visible: false, locked: false},
            {name: 'default group', uuid: 'default group', close: false, visible: true, locked: false},
            {name: 'test group2', uuid: 'asksdjfghisdhfg', close: true, visible: false, locked: false},
            {name: 'test group3', uuid: 'asksdjfuhdfg', close: false, visible: false, locked: true}
        ]
    };
});