/**
 * 菜单下拉项
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');


    return React.createClass({
        onClick: function (e) {
            if (this.props.disabled) return;
            e.target = this.refs.container;
            e.target.value = this.props.value
            this.props.onClick(e);
        },
        render: function () {
            var containerProp = {
                ref: 'container',
                className: 'list-normal-item' + (this.props.disabled ? ' list-normal-item-disabled' : ''),
                onClick: this.onClick
            };
            return (
                <div {...containerProp}>
                    {
                        this.props.hasOwnProperty('checked')
                        ? <span className="tc-menu-checked">{this.props.checked ? '√' : ''}</span>
                        : null
                    }
                    <span>{this.props.label}</span>
                    {this.props.hotKey ? <span className="tc-menu-hotkey">{this.props.hotKey}</span> : null}
                </div>
            );
        }
    });

});
