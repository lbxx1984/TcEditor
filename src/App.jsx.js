/**
 * @file 应用入口
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var Menu = require('./components/Menu.jsx');
    var CommandBar = require('./components/CommandBar.jsx');


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
                <div style={{fontFamily: '微软雅黑'}}>
                    <Menu menu={this.props.menu}/>
                    <CommandBar datasource={this.props.command}/>
                </div>
            );
        }
    });


});
