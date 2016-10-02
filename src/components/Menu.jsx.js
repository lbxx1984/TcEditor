/**
 * @file 菜单
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   
    var DropDownList = require('fcui2/DropDownList.jsx');


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
                <div className="tc-menu">
                    {menuFactory(this)}
                </div>
            );
        }
    });


    function menuFactory(me) {
        var doms = [];
        me.props.menu.map(function (menu) {
            doms.push(
                <DropDownList key={'menu-' + menu.label} label={menu.label} datasource={menu.children}/>
            );
        });
        return doms;
    }


});
