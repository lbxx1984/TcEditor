define(function (require) {
    return React.createClass({
        render: function () {

            var clickHandler = this.props.clickHandler;
            var active = this.props.activetab;

            function prepare(item) {
                var prop = {
                    className: 'tab-button' + (item.cmd.split('-')[1] === active ? ' active' : ''),
                    'data-ui-cmd': item.cmd,
                    onClick: clickHandler
                }
                return (
                    <div {...prop}>{item.label}</div>
                );
            }

            return (
                <div className="tab-navigator">{this.props.datasource.map(prepare)}</div>
            );
        }
    });
});
