
define(function (require) {

    var React = require('react');

    return {
        produceItems: function (me) {
            if (!(me.props.datasource instanceof Array) || !me.props.datasource.length) return '';
            var doms = [];
            var value = me.___getValue___();
            value = isNaN(value) ? 0 : value * 1;
            for (var i = 0; i < me.props.datasource.length; i++) {
                var props = {
                    key: i,
                    className: 'fcui2-wizard-item',
                    onClick: me.onClick,
                    'data-ui-cmd': i,
                    style: {
                        width: parseFloat(100 / me.props.datasource.length).toFixed(2) + '%',
                        zIndex: me.props.datasource.length - i
                    }
                };
                if (me.props.disabled) {
                    props.className += ' fcui2-wizard-item-disabled';
                }
                else if (i < value + 1) {
                    props.className += ' fcui2-wizard-item-active';
                }
                else {
                    props.className += ' fcui2-wizard-item-normal';
                }
                doms.push(
                    <div {...props}>
                        <span data-ui-cmd={i}>{me.props.datasource[i]}</span>
                        <div data-ui-cmd={i} className="fcui2-wizard-arrow-bg"></div>
                        <div data-ui-cmd={i} className="fcui2-wizard-arrow"></div>
                    </div>
                );
            }
            return doms;
        }
    };

});
