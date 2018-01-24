/**
 * @file 控制栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class CommandBar extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        style: PropTypes.object
    }

    static defaultProps = {
        style: {}
    }

    constructor(props) {
        super(props);
        this.onButtonClick = this.onButtonClick.bind(this);
    }

    onButtonClick(e) {
        this.context.dispatch.apply(null, e.target.dataset.uiCmd.split(' '));
    }

    render() {
        return (
            <div className="tc-command-bar" style={this.props.style}>
                {mainFactory(this)}
            </div>
        );
    }

}


function mainFactory(me) {
    const doms = [];
    const {view, tool, gridVisible, datasource} = me.props;
    datasource.map(function (item, index) {
        if (typeof item === 'string') {
            doms.push(<div key={index} className="command-label">{item}</div>);
            return;
        }   
        const containerProps = {
            key: index,
            className: 'command-' + (item.icon ? 'icon' : 'text') + '-button' + (item.disabled ? '-disabled' : ''),
            title: item.title,
            onClick: !item.disabled ? me.onButtonClick : null
        };
        const innerProps = {
            className: item.icon ? 'tc-icon ' + item.icon : ''
        };
        containerProps.className += item.value === view || item.value === tool ? ' checked-item' : '';
        if (item.value === 'stage-helperVisible') {
            innerProps.className = gridVisible ? 'tc-icon tc-icon-visible' : 'tc-icon tc-icon-invisible';
        }
        doms.push(
            <div {...containerProps} data-ui-cmd={item.value}>
                <span {...innerProps} data-ui-cmd={item.value}>
                    {item.label}
                </span>
            </div>
        );
    });
    return doms;
}
