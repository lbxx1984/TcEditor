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
        render: function () {
            var item = this.props.item;
            var icon = 'tc-icon ' + (item.isDirectory ? 'icon-folder' : 'icon-file');
            return (
                <td className="file-name" onClick={this.onFileNameClick}>
                    <span className={icon}></span>
                    {item.name}
                </td>
            );
        }
    });

});
