/**
 * @file 菜单
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DropDownList from 'tcui/DropDownList';
import MenuItem from './MenuListItem';
import './style.less';


export default class Menu extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        hasPanelBar: PropTypes.bool.isRequired
    }

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        this.context.dispatch.apply(null, e.target.value.split(' '));
    }

    render() {
        const className = `tc-menu ${this.props.hasPanelBar ? 'has-panel-bar' : ''}`;
        return (
            <div className={className}>
                {menuRenderer(this)}
            </div>
        );
    }

}


function menuRenderer(me) {
    const {panel, menu} = me.props;
    const panelHash = panel.reduce((r, i) => Object.assign({}, r, {[i.type]: 1}), {});
    return menu.map(item => {
        const props = {
            label: item.label,
            datasource: item.children,
            onClick: me.onClick,
            itemRenderer: MenuItem
        };
        if (item.key === 'view') {
            props.datasource = item.children.map(listItem => {
                return {
                    ...listItem,
                    checked: panelHash.hasOwnProperty(listItem.key)
                };
            });
        }
        if (item.key === 'geometry') {
            props.datasource = item.children.map(listItem => {
                return {
                    ...listItem,
                    checked: listItem.value.indexOf(me.props.tool) > -1
                };
            });
        }
        return <DropDownList {...props} key={'menu-' + item.label}/>;
    });
}
