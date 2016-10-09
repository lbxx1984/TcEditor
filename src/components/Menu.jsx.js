/**
 * @file 菜单
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {



    var React = require('react');   
    var DropDownList = require('fcui2/DropDownList.jsx');
    var _ = require('underscore');


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
                Math.abs(this.props.cameraAngleA) < 2 && this.context.dispatch('changeCamera3D', {cameraAngleA: 40}); 
            }
        },
        render: function () {
            return (
                <div className="tc-menu" style={this.props.style}>
                    {menuFactory(this)}
                </div>
            );
        }
    });


    function menuFactory(me) {
        var doms = [];
        var panelHash = {};
        me.props.panel.map(function (panel) {
            panelHash[panel] = true;
        });
        me.props.menu.map(function (menu) {
            var props = {
                key: 'menu-' + menu.label,
                label: menu.label,
                datasource: menu.children,
                onClick: me.onClick,
                itemRenderer: require('./render/MenuListItem.jsx')
            };
            if (menu.key === 'view') {
                props.datasource = menu.children.map(function (listItem) {
                    return _.extend({}, listItem, {
                        checked: panelHash.hasOwnProperty(listItem.key)
                    });
                });
            }
            doms.push(<DropDownList {...props}/>);
        });
        return doms;
    }


});
