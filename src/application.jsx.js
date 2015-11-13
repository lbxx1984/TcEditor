define(function (require) {
    var ContainerRight = require('layout/containerRight.jsx');
    var ContainerLeft = require('layout/containerLeft.jsx');
    return React.createClass({
        render: function () {
            return (
                <div>
                    <ContainerRight {...this.props} ref="containerright"/>
                    <ContainerLeft {...this.props} ref="containerleft"/>
                </div>
            );
        }
    });
});