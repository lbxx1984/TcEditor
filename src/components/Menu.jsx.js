/**
 * @file 菜单
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   
    var DropDownList = require('fcui2/DropDownList.jsx');


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
        onClick: function (e) {
            var value = e.target.value;
            if (value.indexOf(';tool') > -1) {
                this.context.dispatch('changeSystemTool', value.replace(';tool', ''));
            }
        },
        render: function () {
            return (
                <div className="tc-menu">
                    {menuFactory(this)}
                </div>
            );
        }
    });


    function menuFactory(me) {
        var doms = [];
        me.props.menu.map(function (menu) {
            var props = {
                key: 'menu-' + menu.label,
                label: menu.label,
                datasource: menu.children,
                onClick: me.onClick
            };
            doms.push(<DropDownList {...props}/>);
        });
        return doms;
    }


});
