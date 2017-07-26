/**
 * @file 工具栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var _ = require('underscore');


    var datasourceFilters = {
        'tool-pickGeometry': function (datasource, controls) {
            return datasource.map(function (item ,index) {
                item = _.extend({}, item);
                var value = item.value.split('-').pop();
                item.checked = value !== 'space' ? value === controls.mode : controls.space === 'world';
                return item;
            });
        }
    };


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
        },
        render: function () {
            var datasource = typeof datasourceFilters[this.props.tool] === 'function'
                ? datasourceFilters[this.props.tool](this.props.datasource, this.props.controls)
                : this.props.datasource;
            return (
                <div className="tc-tools-bar">
                    {buttonFactory(datasource, this)}
                </div>
            );
        }
    });


    function buttonFactory(datasource, me) {
        var result = [];
        datasource.map(function (item, index) {
            var iconProps = {
                key: 'tools-' + index,
                'data-ui-cmd': item.value,
                title: item.title,
                className: 'tc-icon ' + item.icon + (item.checked ? ' selected' : ''),
                onClick: me.onButtonClick
            };
            if (item.hasOwnProperty('color')) {
                iconProps.style = {
                    color: item.color
                };
            }
            result.push(<div {...iconProps}></div>);
        });
        return result;
    }


});
