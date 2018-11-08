/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

const api = me => me.props.me.props.onAction;


export default class FileName extends Component {

    static propTypes = {
        data: PropTypes.object,
        clipboard: PropTypes.string,
        me: PropTypes.object
    }

    constructor(args) {
        super(args);
        this.onFileNameClick = this.onFileNameClick.bind(this);
        this.onFileEditClick = this.onFileEditClick.bind(this);
        this.onFileCutClick = this.onFileCutClick.bind(this);
        this.onFileCopyClick = this.onFileCopyClick.bind(this);
    }

    onFileNameClick() {
        api(this)('select', this.props.data);
    }

    onFileEditClick(e) {
        e.stopPropagation();
        api(this)('rename', this.props.data);
    }

    onFileCutClick(e) {
        e.stopPropagation();
        api(this)('cut', this.props.data);
    }

    onFileCopyClick(e) {
        e.stopPropagation();
        api(this)('copy', this.props.data);
    }

    render() {
        const {isDirectory, fullPath, name} = this.props.data;
        const {clipboard} = this.props.me.props;
        const icon = 'tc-icon ' + (isDirectory ? 'tc-icon-folder' : 'tc-icon-file');
        const labelStyle = fullPath === clipboard ? {color: 'grey'} : null;
        return (
            <td className="file-name" style={labelStyle} onClick={this.onFileNameClick}>
                <span className="tc-icon tc-icon-edit" onClick={this.onFileEditClick}></span>
                <span className="tc-icon tc-icon-cut" onClick={this.onFileCutClick}></span>
                <span className="tc-icon tc-icon-copy" onClick={this.onFileCopyClick}></span>
                <span className={icon}></span>
                {name}
            </td>
        );
    }
}
