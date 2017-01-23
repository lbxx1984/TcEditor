/**
 * @file 工具栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');


    return React.createClass({
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onButtonClick: function (e) {
            this.context.dispatch(e.target.dataset.uiCmd);
        },
        render: function () {
            return (
                <div className="tc-tools-bar">
                    {JSON.stringify(this.props.datasource)}
                </div>
            );
        }
    });


});
