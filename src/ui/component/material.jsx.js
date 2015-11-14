define(function (require) {
    return React.createClass({
        render: function () {
            return (
                <div className="tab-content" style={{display:this.props.display}}>
                </div>
            );
        }
    });
});
