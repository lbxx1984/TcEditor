define(['./containerRight.jsx', './containerLeft.jsx'], function (ContainerRight, ContainerLeft) {
    return React.createClass({
        render: function () {
            return (
                <div>
                    <ContainerRight ref="containerright"/>
                    <ContainerLeft {...this.props} ref="containerleft"/>
                </div>
            );
        }
    });
});