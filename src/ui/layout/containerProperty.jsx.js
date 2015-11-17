define(function (require) {

    var GeometryPropertyBar = require('../component/GeometryPropertyBar.jsx');

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
        render: function () {
            var props = {
                className: 'container-property',
                style: {display: this.props.mesh ? 'block' : 'none'}
            };
            var geometryProps = {
                mesh: this.props.mesh || this.state.defaultMesh,
                display: this.state.currentTab === 'geometry' ? 'block' : 'none'
            };
            var materialProps = {
                mesh: this.props.mesh || this.state.defaultMesh,
                display: this.state.currentTab === 'material' ? 'block' : 'none'
            };
            var me = this;

            function changeTab(e) {
                me.setState({currentTab: e.target.dataset.tabItem});
            }

            function produceTabItem(item) {
                var p = {
                    className: 'tab-item' + (me.state.currentTab === item ? ' active' : ''),
                    'data-tab-item': item,
                    onClick: changeTab
                };
                return (
                    <div {...p}>{item}</div>
                );
            }

            return (
                <div {...props}>
                    <div className="tab-bar" data-is-property-bar="true">
                        {this.state.tabItems.map(produceTabItem)}
                    </div>
                    <GeometryPropertyBar {...geometryProps}/>
                </div>
            );
        }
    });
});