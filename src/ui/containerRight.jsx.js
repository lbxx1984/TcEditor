define(['./mousePositionBar.jsx'], function (MousePositionBar) {
    return React.createClass({
        getInitialState: function () {
            return {
                mouse3d: {x: 0, y: 0, z: 0}
            };
        },
        render: function () {
            var mousePositionBarProps = {
                mouse3d: this.state.mouse3d
            };
            return (
                <div className="container-right">
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <br/><br/><br/><br/><br/><br/><br/>asd
                    <MousePositionBar {...mousePositionBarProps}/>
                </div>
            );
        }
    });
});