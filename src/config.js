define(function (Require) {
    return {
        defaultCommandState: {
            activetab: 'stage',
            cameraview: '3d',
            systemtool: 'cameramove',
            transformer: 'move',
            transformerspace: 'world',
            enablebar: ''
        },
        tab: require('./config/tabNavigator'),
        menu: require('./config/menu'),
        controlBar: require('./config/controlBar')
    };
});