/**
 * @file 物体列表
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
            return (
                <div>
                    {this.props.meshes.length}
                    {this.props.index}
                    {this.props.item.type}
                </div>
            );
        }
    });


});
