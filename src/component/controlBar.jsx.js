define(['React'], function (React) {
    return React.createClass({
        getInitialState: function () {
            return this.props.defaultState;
        },
        render: function () {
            var me = this;
            var clickHandler = this.props.clickHandler;

            function buttonClickHandler(event) {
                var dom = event.target;
                var dataset = dom.dataset;
                switch (dataset.uiType) {
                    case 'checkbox':
                        var value = ~~dataset.uiValue;
                        var style = dataset.uiStyle.split('|');
                        var className = dom.className;
                        className = className.replace(style[value], '');
                        value = (value === 0) ? 1: 0;
                        className += style[value];
                        dom.className = className;
                        dom.dataset.uiValue = value;
                        clickHandler(dataset.uiCmd, value);
                        break;
                    case 'button':
                        clickHandler(dataset.uiCmd);
                        break;
                    case 'radio':
                        var state = {};
                        state[dataset.uiGroup] = dataset.uiValue;
                        me.setState(state);
                        clickHandler(dataset.uiCmd);
                        break;
                    default:
                        break;
                }
            }

            function button(item) {
                var prop = {
                    className: 'control-bar-button iconfont' + item.class,
                    'data-ui-cmd': item.cmd,
                    'data-ui-type': item.type,
                    title: item.title,
                    onClick: buttonClickHandler
                };
                if (item.type === 'checkbox') {
                    prop['data-ui-value'] = item.value;
                    prop.className += item.styles[~~item.value];
                    prop['data-ui-style'] = item.styles.join('|');
                }
                else if (item.type === 'radio') {
                    prop['data-ui-group'] = item.group;
                    prop['data-ui-value'] = item.value;
                    prop.className += item.value === me.state[item.group] ? ' active' : '';
                }
                return <div {...prop}>{item.label}</div>;
            }

            function prepare(item) {
                var itemClass = item.enable === 'always' ? 'control-bar-item-inline' : 'control-bar-item-nextline';
                if (item.enable !== 'always' && me.state.enablebar.indexOf(item.enable + '|') < 0) {
                    itemClass += ' disable';
                }
                return (
                    <div className={itemClass}>
                        <div className="control-bar-label">{item.label}</div>
                        {item.children.map(button)}
                    </div>
                );
            }

            return (
                <div className="control-bar">{this.props.datasource.map(prepare)}</div>
            );
        }
    });
});