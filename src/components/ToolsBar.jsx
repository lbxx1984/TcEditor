/**
 * @file 工具栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';


const datasourceFilters = {
    pickMesh(datasource, controls) {
        return datasource.map(item => {
            const value = item.value.split(' ').pop();
            return {
                ...item,
                checked: value !== 'space' ? value === controls.mode : controls.space === 'world'
            };
        });
    }
};


export default class ToolsBar extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        tool: PropTypes.string.isRequired,
        datasource: PropTypes.array.isRequired,
        controls: PropTypes.object
    }

    static defaultProps = {
        controls: {}
    }

    constructor(props) {
        super(props);
        this.onButtonClick = this.onButtonClick.bind(this);
    }
    
    onButtonClick(e) {
        this.context.dispatch.apply(null, e.target.dataset.uiCmd.split(' '));
    }

    render() {
        const datasource = typeof datasourceFilters[this.props.tool] === 'function'
            ? datasourceFilters[this.props.tool](this.props.datasource, this.props.controls)
            : this.props.datasource;
        return (
            <div className="tc-tools-bar">
                {buttonRenderer(datasource, this)}
            </div>
        );
    }
}


function buttonRenderer(datasource, me) {
    return datasource.map(function (item, index) {
        const iconProps = {
            'data-ui-cmd': item.value,
            title: item.title,
            className: 'tc-icon ' + item.icon + (item.checked ? ' selected' : ''),
            onClick: me.onButtonClick,
            style: item.hasOwnProperty('color') ? {
                color: item.color
            } : null
        };
        return <div {...iconProps} key={index}></div>;
    });
}
