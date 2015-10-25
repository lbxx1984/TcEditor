define(['layout/containerRight.jsx', 'layout/containerLeft.jsx'], function (ContainerRight, ContainerLeft) {
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