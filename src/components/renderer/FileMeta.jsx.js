/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {

    var React = require('react');
    var uiUtil = require('fcui2/core/util');


    function formatSize(n) {
        var i = 0;
        var unit = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB'];
        while (n > 1024) {n = n / 1024; i++;}
        return n.toFixed(i === 0 ? 0 : 2) + unit[i];
    }


    return React.createClass({
        getInitialState: function (e) {
            return {
                mtime: 0,
                size: '-'
            };
        },
        componentDidMount: function () {
            var me = this;
            me.props.item.getMetadata(function (meta) {
                me.setState({
                    mtime: uiUtil.dateFormat(meta.modificationTime, 'YYYY/MM/DD hh:mm:ss'),
                    size: me.props.item.isDirectory ? '-' : formatSize(meta.size)
                });
            });
        },
        render: function () {
            return (
                <td className="file-meta">
                    {this.state[this.props.field]}
                </td>
            );
        }
    });

});
