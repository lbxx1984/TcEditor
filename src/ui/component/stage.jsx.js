define(function (require) {

    var Mesh = require('./mesh.jsx');

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
                <div className="tab-content stage-content" style={{display:this.props.display}}>
                    <div className="label-l1">
                        <div className={mFC} data-cmd="meshVisible" onClick={this.foldingHandler}></div>Mesh
                    </div>
                    <div style={{display: this.state.meshVisible ? 'block' : 'none'}}>
                        <Mesh ref="meshBox" commandRouting={this.props.commandRouting}/>
                    </div>
                    <div className="label-l1">
                        <div className={lFC} data-cmd="lightVisible" onClick={this.foldingHandler}></div>Light
                    </div>
                </div>
            );
        }
    });
});