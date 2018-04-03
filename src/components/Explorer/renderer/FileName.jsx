/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class FileName extends Component {

    static propTypes = {
        onAction: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired,
        clipboard: PropTypes.string.isRequired
    }

    constructor(args) {
        super(args);
        this.onFileNameClick = this.onFileNameClick.bind(this);
        this.onFileEditClick = this.onFileEditClick.bind(this);
        this.onFileCutClick = this.onFileCutClick.bind(this);
        this.onFileCopyClick = this.onFileCopyClick.bind(this);
    }

    onFileNameClick() {
        this.props.onAction('select', this.props.item);
    }

    onFileEditClick(e) {
        e.stopPropagation();
        this.props.onAction('rename', this.props.item);
    }

    onFileCutClick(e) {
        e.stopPropagation();
        this.props.onAction('cut', this.props.item);
    }

    onFileCopyClick(e) {
        e.stopPropagation();
        this.props.onAction('copy', this.props.item);
    }

    render() {
        const item = this.props.item;
        const icon = 'tc-icon ' + (item.isDirectory ? 'tc-icon-folder' : 'tc-icon-file');
        const labelStyle = item.fullPath === this.props.clipboard ? {
            color: 'grey'
        } : null;
        return (
            <td className="file-name" style={labelStyle} onClick={this.onFileNameClick}>
                <span className="tc-icon tc-icon-edit" onClick={this.onFileEditClick}></span>
                <span className="tc-icon tc-icon-cut" onClick={this.onFileCutClick}></span>
                <span className="tc-icon tc-icon-copy" onClick={this.onFileCopyClick}></span>
                <span className={icon}></span>
                {item.name}
            </td>
        );
    }
}
