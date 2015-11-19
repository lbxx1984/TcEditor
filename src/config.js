define(function (Require) {
    window.editorKey = '__tceditor__';
    return {
        defaultCommandState: {
            cameraview: '3d',
            systemtool: 'cameramove',
            transformer: 'move',
            transformerspace: 'world',
            enablebar: ''
        },
        menu: require('./config/menu'),
        controlBar: require('./config/controlBar')
    };
});