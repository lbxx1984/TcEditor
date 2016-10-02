/**
 * @file 控制栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');   


    return React.createClass({
        // @override
        getDefaultProps: function () {
            return {};
        },
        // @override
        getInitialState: function () {
            return {};
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
                doms.push(
                    <div key={key} className="command-label">{item}</div>
                );
                return;
            }
            if (typeof item.label === 'string') {
                doms.push(
                    <div key={key} className="command-text-button" title={item.title}>
                        <span>{item.label}</span>
                    </div>
                );
                return;
            }
            if (typeof item.icon === 'string') {
                doms.push(
                    <div key={key} className="command-icon-button">
                        <span className={'iconfont ' + item.icon}></span>
                    </div>
                );
            }
        });
        return doms;
    }

});
