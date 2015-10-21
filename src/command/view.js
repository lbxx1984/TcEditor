define(function (Require) {
    return {
        '3d': function () {
            this.stage.changeView('3d');
            this.transformer.update('$3d');
        },
        xoz: function () {
            this.stage.changeView('xoz');
            this.transformer.update('$2d');
        },
        zoy: function () {
            this.stage.changeView('zoy');
            this.transformer.update('$2d');
        },
        xoy: function () {
            this.stage.changeView('xoy');
            this.transformer.update('$2d');
        }
    };
});