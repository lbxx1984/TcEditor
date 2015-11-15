define(function (require) {

    var Mesh = require('./meshes.jsx');
    var Light = require('./lights.jsx');

    return React.createClass({
        getInitialState: function () {
            return {
                meshVisible: true,
                lightVisible: true
            };
        },
        foldingHandler: function (e) {
            var key = e.target.dataset.cmd;
            var obj = {};
            obj[key] = !this.state[key];
            this.setState(obj);
        },
        render: function () {
            var mFC = 'iconfont icon-' + (this.state.meshVisible ? 'xiashixinjiantou' : 'youshixinjiantou');
            var lFC = 'iconfont icon-' + (this.state.lightVisible ? 'xiashixinjiantou' : 'youshixinjiantou');
            return (
                <div className="stage-content">
                    <div className="label-l1">
                        <div className={mFC} data-cmd="meshVisible" onClick={this.foldingHandler}></div>Mesh
                    </div>
                    <div style={{display: this.state.meshVisible ? 'block' : 'none'}}>
                        <Mesh ref="meshBox" commandRouting={this.props.commandRouting}/>
                    </div>
                    <div className="label-l1">
                        <div className={lFC} data-cmd="lightVisible" onClick={this.foldingHandler}></div>Light
                    </div>
                    <div style={{display: this.state.lightVisible ? 'block' : 'none'}}>
                        <Light ref="lightBox" commandRouting={this.props.commandRouting}/>
                    </div>
                </div>
            );
        }
    });
});
