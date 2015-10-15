define(function (Require) {
    return {
        move: function () {
            this.transformer.callFunction('setMode', 'translate');
            this.transformer.callFunction(
                'setSpace',
                this.ui.refs.containerleft.refs.controlbar.state.transformerspace
            );
        },
        rotate: function () {
            this.transformer.callFunction('setMode', 'rotate');
            this.transformer.callFunction(
                'setSpace',
                this.ui.refs.containerleft.refs.controlbar.state.transformerspace
            );
        },
        scale: function () {
            this.transformer.callFunction('setMode', 'scale');
            this.transformer.callFunction('setSpace', 'local');
        },
        enlarge: function () {
            var size = this.transformer.get('size');
            this.transformer.callFunction('setSize', size * 1.1);
        },
        narrow: function () {
            var size = this.transformer.get('size');
            this.transformer.callFunction('setSize', size * 0.9);
        },
        coordinatetoggle: function () {
            var controlBar = this.ui.refs.containerleft.refs.controlbar;
            var space = controlBar.state.transformerspace === 'world' ? 'local' : 'world';
            controlBar.setState({transformerspace: space});
            this.transformer.callFunction('setSpace', space);
        }
    };
});