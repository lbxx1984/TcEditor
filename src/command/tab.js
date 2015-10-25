define(function (Require) {
    return {
        stage: function () {
            var right = this.ui.refs.containerright;
            right.setState({activetab: 'stage'});
        },
        geometry: function () {
            var right = this.ui.refs.containerright;
            right.setState({activetab: 'geometry'});
        },
        material: function () {
            var right = this.ui.refs.containerright;
            right.setState({activetab: 'material'});
        }
    };
});