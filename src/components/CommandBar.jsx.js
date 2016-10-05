/**
 * @file 控制栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');


    return React.createClass({
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {};
        },
        onButtonClick: function (e) {
            this.context.dispatch(e.target.dataset.uiCmd);
            console.log(e.target.dataset.uiCmd);
        },
        render: function () {
            return (
                <div className="tc-command-bar">
                    {mainFactory(this)}
                </div>
            );
        }
    });


    function mainFactory(me) {
        var doms = [];
        me.props.datasource.map(function (item, index) {
            var key = 'key-' + index;
            if (typeof item === 'string') {
                doms.push(<div key={key} className="command-label">{item}</div>);
                return;
            }
            var containerProps = {
                key: key,
                className: 'command-' + (item.icon ? 'icon' : 'text') + '-button',
                title: item.title,
                onClick: me.onButtonClick
            };
            var innerProps = {
                className: item.icon ? 'iconfont ' + item.icon : ''
            };
            containerPropsFilter(containerProps, item, me);
            innerPropsFilter(innerProps, item, me);
            doms.push(
                <div {...containerProps} data-ui-cmd={item.value}>
                    <span {...innerProps} data-ui-cmd={item.value}>
                        {item.label}
                    </span>
                </div>
            );
        });
        return doms;
    }


    function innerPropsFilter(props, item, me) {
        if (item.value === 'stage-helperVisible') {
            props.className = me.props.gridVisible ? 'iconfont icon-kejian' : 'iconfont icon-bukejian';
        }
    }


    function containerPropsFilter(props, item, me) {
        props.className += item.value === me.props.view || item.value === me.props.tool ? ' checked-item' : '';
    }


});
