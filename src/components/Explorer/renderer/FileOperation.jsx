/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {

    var React = require('react');

    return React.createClass({
        onDeleteBtnClick: function () {
            this.props.onAction('delete', this.props.item);
        },
        render: function () {
            return (
                <td className="file-operation">
                    <span className="tc-icon tc-icon-delete" onClick={this.onDeleteBtnClick}></span>
                </td>
            );
        }
    });

});
