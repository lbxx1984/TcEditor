define(function (require) {

    var GeometryPropertyBar = require('../component/geometryPropertyBar.jsx');

    return React.createClass({
        getInitialState: function () {
            return {
                currentTab: 'geometry',
                tabItems: ['geometry', 'material', ''],
                defaultMesh: new THREE.Mesh(
                    new THREE.PlaneGeometry(1, 1, 1, 1),
                    new THREE.MeshLambertMaterial({color: 0xe6e6e6})
                )
            };
        },
        componentDidMount: function () {
            var dom = this.getDOMNode();
            var arr = dom.getElementsByTagName('*');
            for (var i = 0; i < arr.length; i++) {
                arr[i].dataset.isPropertyBar = true;
            }
            dom.dataset.isPropertyBar = true;
        },
        tabChangeHandler: function (e) {
            this.setState({currentTab: e.target.dataset.tabItem});
        },
        render: function () {
            var me = this;
            var props = {
                className: 'container-property',
                style: {display: this.props.mesh ? 'block' : 'none'}
            };
            var geometryProps = {
                mesh: this.props.mesh || this.state.defaultMesh,
                joint: this.props.joint,
                display: this.state.currentTab === 'geometry' ? 'block' : 'none',
                commandRouting: this.props.commandRouting
            };
            var materialProps = {
                mesh: this.props.mesh || this.state.defaultMesh,
                display: this.state.currentTab === 'material' ? 'block' : 'none'
            };
            return (
                <div {...props}>
                    <div className="tab-bar" data-is-property-bar="true">
                        {this.state.tabItems.map(produceTabItem)}
                    </div>
                    <GeometryPropertyBar {...geometryProps}/>
                </div>
            );
            function produceTabItem(item) {
                var p = {
                    className: 'tab-item' + (me.state.currentTab === item ? ' active' : ''),
                    'data-tab-item': item,
                    onClick: me.tabChangeHandler
                };
                return (
                    <div {...p}>{item}</div>
                );
            }
        }
    });
});