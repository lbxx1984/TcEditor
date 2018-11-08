/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class FileOperation extends Component {

    static propTypes = {
        data: PropTypes.object,
        me: PropTypes.object
    }

    constructor(args) {
        super(args);
        this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
    }

    onDeleteBtnClick() {
        this.props.me.props.onAction('delete', this.props.data);
    }

    render() {
        return (
            <td className="file-operation">
                <span className="tc-icon tc-icon-delete" onClick={this.onDeleteBtnClick}></span>
            </td>
        );
    }

}
