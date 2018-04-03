/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';


export default class FileOperation extends Component {

    static propTypes = {
        onAction: PropTypes.func.isRequired,
        item: PropTypes.object.isRequired
    }

    constructor(args) {
        super(args);
        this.onDeleteBtnClick = this.onDeleteBtnClick.bind(this);
    }

    onDeleteBtnClick() {
        this.props.onAction('delete', this.props.item);
    }

    render() {
        return (
            <td className="file-operation">
                <span className="tc-icon tc-icon-delete" onClick={this.onDeleteBtnClick}></span>
            </td>
        );
    }

}
