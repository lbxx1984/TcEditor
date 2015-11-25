define(function (Require) {
    
    function updateControlBar(me, view) {
        var controlBar = me.ui.refs.containerleft.refs.controlbar;
        if (controlBar.state.transformer === view) return;
        controlBar.setState({transformer: view});
    }
    return {
        move: function () {
            if (!this.transformer.attached) return;
            this.transformer.callFunction('setMode', 'translate');
            this.transformer.callFunction(
                'setSpace',
                this.ui.refs.containerleft.refs.controlbar.state.transformerspace
            );
            updateControlBar(this, 'move');
        },
        rotate: function () {
            if (!this.transformer.attached) return;
            this.transformer.callFunction('setMode', 'rotate');
            this.transformer.callFunction(
                'setSpace',
                this.ui.refs.containerleft.refs.controlbar.state.transformerspace
            );
            updateControlBar(this, 'rotate');
        },
        scale: function () {
            if (!this.transformer.attached) return;
            this.transformer.callFunction('setMode', 'scale');
            this.transformer.callFunction('setSpace', 'local');
            updateControlBar(this, 'scale');
        },
        enlarge: function () {
            if (!this.transformer.attached) return;
            var size = this.transformer.get('size');
            this.transformer.callFunction('setSize', size * 1.1);
        },
        narrow: function () {
            if (!this.transformer.attached) return;
            var size = this.transformer.get('size');
            this.transformer.callFunction('setSize', size * 0.9);
        },
        coordinatetoggle: function () {
            if (!this.transformer.attached) return;
            var controlBar = this.ui.refs.containerleft.refs.controlbar;
            var space = controlBar.state.transformerspace === 'world' ? 'local' : 'world';
            controlBar.setState({transformerspace: space});
            this.transformer.callFunction('setSpace', space);
        }
    };
});