/**
 * @file 灯光列表
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import util from 'fcui2/core/util';


function getLabelDom(target) {
    while(!target.dataset.level && target.parentNode) target = target.parentNode;
    return target.dataset.level ? target : null;
}


export default class LightList extends Component {

    static contextTypes = {
        dispatch: PropTypes.func
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        expend: PropTypes.bool.isRequired
    }

    constructor(props) {
        super(props);
        this.onPanelCloseIconClick = this.onPanelCloseIconClick.bind(this);
        this.onPanelToggleIconClick = this.onPanelToggleIconClick.bind(this);
        this.onDelIconClick = this.onDelIconClick.bind(this);
        this.onVisibleIconClick = this.onVisibleIconClick.bind(this);
        this.onLockIconClick = this.onLockIconClick.bind(this);
        this.onLabelClick = this.onLabelClick.bind(this);
    }

    onPanelCloseIconClick() {
        this.context.dispatch('view-close-panel', this.props.type);
    }

    onPanelToggleIconClick() {
        this.context.dispatch('view-toggle-panel', this.props.type);
    }

    onVisibleIconClick(e) {
        this.context.dispatch('visibleLight', getLabelDom(e.target).dataset.key);
    }

    onLockIconClick(e) {
        this.context.dispatch('lockLight', getLabelDom(e.target).dataset.key);
    }

    onDelIconClick(e) {
        this.context.dispatch('deleteLight', getLabelDom(e.target).dataset.key);
    }

    onLabelClick(e) {
        this.context.dispatch('tool-select-light-by-key', getLabelDom(e.target).dataset.key);
    }

    render() {
        const expendBtnIcon = this.props.expend ? 'tc-icon-down' : 'tc-icon-right';
        return (
            <div className="tc-meshlist">
                <div className="tc-panel-title-bar">
                    <span className="tc-icon tc-icon-close" onClick={this.onPanelCloseIconClick}></span>
                    <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                    Light List
                </div>
                <div className="tc-panel-content-container">
                    {this.props.expend ? listRenderer(this) : null}
                </div>
            </div>
        );
    }
}


function listRenderer(me) {
    let selectedLight = me.props.selectedLight;
    if (selectedLight && selectedLight.tc) {
        selectedLight = selectedLight.tc.lightKey;
    }
    return Object.keys(me.props.lights).map(key => {
        const light = me.props.lights[key];
        const tc = light.tc;
        const name = tc.name || light.type.replace('Light', ' ') + util.dateFormat(tc.birth, 'DD/MM hh:mm:ss');
        const containerProps = {
            className: 'mesh-container' + (key ===  selectedLight ? ' mesh-selected' : ''),
            'data-id': light.uuid,
            'data-key': key,
            'data-level': 'light'
        };
        const labelProps = {
            className: 'main-label',
            onClick: me.onLabelClick
        };
        const delIconProps = {
            className: 'tc-icon tc-icon-delete',
            onClick: me.onDelIconClick
        };
        const lockedIconProps = {
            className: 'tc-icon ' + (tc.locked ? 'tc-icon-lock' : 'tc-icon-unlock'),
            onClick: me.onLockIconClick
        };
        const visibleIconProps = {
            className: 'visible-icon tc-icon ' + (light.visible ? 'tc-icon-visible' : 'tc-icon-invisible'),
            onClick: me.onVisibleIconClick
        };
        return (
            <div {...containerProps} key={key}>
                <span {...delIconProps}></span>
                <span {...visibleIconProps}></span>
                <span {...lockedIconProps}></span>
                <div {...labelProps}>{name}</div>
            </div>
        );
    });
}
