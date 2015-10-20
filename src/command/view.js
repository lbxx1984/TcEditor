define(function (Require) {
    return {
        '3d': function () {
            this.stage.changeView('3d');
            this.transformer.type = '$3d';
        },
        xoz: function () {
            this.stage.changeView('xoz');
            this.transformer.type = '$2d';
        },
        zoy: function () {
            this.stage.changeView('zoy');
            this.transformer.type = '$2d';
        },
        xoy: function () {
            this.stage.changeView('xoy');
            this.transformer.type = '$2d';
        }
    };
});