/**
 * @file 菜单
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropDownList from 'fcui2/src/DropDownList.jsx';
import MenuItem from './MenuListItem.jsx';


export default class Menu extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        style: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        this.context.dispatch.apply(null, e.target.value.split(' '));
    }

    render() {
        return (
            <div className="tc-menu" style={this.props.style}>
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
