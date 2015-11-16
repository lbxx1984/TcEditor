define(function (require) {
    return React.createClass({
        render: function () {
            var props = {
                className: 'property-bar',
                'data-is-property-bar': true,
                style: {
                    display: this.props.mesh ? 'block' : 'none'
                }
            }
            return (
                <div {...props}>
                    <div></div>
                </div>
            );
        }
    });
});