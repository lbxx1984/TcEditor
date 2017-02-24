/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   
    var _ = require('underscore');


    return React.createClass({

        contextTypes: {
            dispatch: React.PropTypes.func
        },

        // @override
        getDefaultProps: function () {
            return {

            };
        },

        componentDidMount: function () {

        },

        componentWillReceiveProps: function (nextProps) {

        },

        componentWillUnmount: function () {

        },

        render: function () {
            return (
                <div>
                    {this.props.view}
                </div>
           );
        }
    });

});
