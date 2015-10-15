define(function (Require) {
    return {
        '3d': function () {
            this.stage.changeView('3d');
        },
        xoz: function () {
            this.stage.changeView('xoz');
        },
        yoz: function () {
            this.stage.changeView('yoz');
        },
        xoy: function () {
            this.stage.changeView('xoy');
        }
    };
});