define(function (require) {
    return React.createClass({
        render: function () {

            var clickHandler = this.props.clickHandler;

            function menulist(item) {
                var prop = {
                    className: 'menu-item',
                    onClick: clickHandler,
                    'data-ui-cmd': item.cmd
                };
                return (
                    <div {...prop}>
                        {item.label}
                        <div className="menu-item-hotkey">{item.hotKey}</div>
                    </div>
                );
            }

            function prepare(item) {
                if (item.children instanceof Array && item.children.length > 0) {
                    return (
                        <div className="menu-button">
                            <div data-ui-cmd={item.cmd} onClick={clickHandler}>{item.label}</div>
                            <div className="menu-list">{item.children.map(menulist)}</div>
                        </div>
                    );
                }
                return (
                    <div className="menu-button">
                        <div data-ui-cmd={item.cmd} onClick={clickHandler}>{item.label}</div>
                    </div>
                );
            }

            return <div className="menu">{this.props.datasource.map(prepare)}</div>;
        }
    });
});
