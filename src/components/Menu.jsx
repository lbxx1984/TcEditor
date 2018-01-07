/**
 * @file 菜单
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropDownList from 'fcui2/DropDownList.jsx';
import MenuItem from './renderer/MenuListItem.jsx';


export default class Menu extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        const value = e.target.value;
        // 工具类命令
        if (value.indexOf(';tool') > -1) {
            this.context.dispatch('changeSystemTool', value.replace(';tool', ''));
            return;
        }
        // 一次性执行命令
        if (value.indexOf('view-') === 0) {
            this.context.dispatch('changePanelConfig', value);
            return;
        }
        this.context.dispatch(e.target.value);
    }

    render() {
        return (
            <div className="tc-menu">
                {menuRenderer(this)}
            </div>
        );
    }

}


function menuRenderer(me) {
    const panelHash = {};
    me.props.panel.map(function (panel) {
        panelHash[panel.type] = true;
    });
    return me.props.menu.map(menu => {
        const props = {
            skin: 'black',
            label: menu.label,
            datasource: menu.children,
            onClick: me.onClick,
            itemRenderer: MenuItem
        };
        if (menu.key === 'view') {
            props.datasource = menu.children.map(function (listItem) {
                return {
                    ...listItem,
                    checked: panelHash.hasOwnProperty(listItem.key)
                };
            });
        }
        return <DropDownList {...props} key={'menu-' + menu.label}/>;
    });
}
