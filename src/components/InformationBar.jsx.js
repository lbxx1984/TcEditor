/**
 * @file 信息栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {};
        },
        render: function () {
            var point = this.props.mouse3d;
            return (
                <div className="tc-information-bar">
                    <span className="axis-label">x: {point.x.toFixed(2)}</span>
                    <span className="axis-label">y: {point.y.toFixed(2)}</span>
                    <span className="axis-label">z: {point.z.toFixed(2)}</span>
                </div>
            );
        }
    });


});
