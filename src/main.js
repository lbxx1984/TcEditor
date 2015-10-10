require.config({
    paths: {
        three: '../deps/three/three.min.r72',
        React: '../deps/react.min'
    }
});
define(['React', './component/application.jsx'], function (React, App) {
    var props = {
        commandRouting: function (e) {
            console.log(e);
        }
    };
    React.render(
        React.createElement(App, props),
        document.body
    );
});