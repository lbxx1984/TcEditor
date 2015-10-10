define([
    'React', './containerRight.jsx', './containerLeft.jsx'
], function (React, RightContainer, MainContainer) {
    return React.createClass({
        getInitialState: function () {
            return {};
        },
        render: function () {
            return (
                <div>
                    <RightContainer/>
                    <MainContainer {...this.props}/>
                </div>
            );
        }
    });
});