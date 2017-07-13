/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {

    var React = require('react');

    return React.createClass({
        onFileNameClick: function (e) {
            this.props.onAction('select', this.props.item);
        },
        onFileEditClick: function (e) {
            e.stopPropagation();
            this.props.onAction('rename', this.props.item);
        },
        onFileCutClick: function (e) {
            e.stopPropagation();
            this.props.onAction('cut', this.props.item);
        },
        onFileCopyClick: function (e) {
            e.stopPropagation();
            this.props.onAction('copy', this.props.item);
        },
        render: function () {
            var item = this.props.item;
            var icon = 'tc-icon ' + (item.isDirectory ? 'icon-folder' : 'icon-file');
            var labelStyle = {};
            if (item.fullPath === this.props.selected) {
                labelStyle.fontWeight = 700;
            }
            if (item.fullPath === this.props.clipboard) {
                labelStyle.color = 'grey';
            }
            return (
                <td className="file-name" style={labelStyle} onClick={this.onFileNameClick}>
                    <span className="tc-icon icon-edit" onClick={this.onFileEditClick}></span>
                    <span className="tc-icon icon-cut" onClick={this.onFileCutClick}></span>
                    <span className="tc-icon icon-copy" onClick={this.onFileCopyClick}></span>
                    <span className={icon}></span>
                    {item.name}
                </td>
            );
        }
    });

});
