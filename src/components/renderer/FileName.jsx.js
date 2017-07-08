/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {

    var React = require('react');

    return React.createClass({
        onClick: function (e) {
            
        },
        render: function () {
            var item = this.props.item;
            var icon = 'tc-icon ' + (item.isDirectory ? 'icon-folder' : 'icon-file');
            return (
                <td className="file-name">
                    <span className={icon}></span>
                    {item.name}
                </td>
            );
        }
    });

});
