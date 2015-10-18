define(function (Require) {
    return {
        '3d': function () {
            this.stage.changeView('3d');
        },
        xoz: function () {
            this.stage.changeView('xoz');
        },
        zoy: function () {
            this.stage.changeView('zoy');
        },
        xoy: function () {
            this.stage.changeView('xoy');
        }
    };
});