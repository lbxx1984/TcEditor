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
            this.getMeta(this.props.item);
        },
        componentWillReceiveProps(nextProps) {
            if (nextProps.item !== this.props.item) this.getMeta(nextProps.item);
        },
        getMeta(item) {
            var me = this;
            item.getMetadata(function (meta) {
                me.setState({
                    mtime: uiUtil.dateFormat(meta.modificationTime, 'YYYY/MM/DD hh:mm:ss'),
                    size: me.props.item.isDirectory ? '-' : formatSize(meta.size)
                });
            });
        },
        render: function () {
            return (
                <td className="file-meta" key={this.props.item.fullPath}>
                    {this.state[this.props.field]}
                </td>
            );
        }
    });

});
