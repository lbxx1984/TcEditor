/**
 * @file 材质编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var Dialog = require('fcui2/Dialog.jsx');
    var ColorSetter = require('./dialogContent/ColorSetter.jsx');
    var dialog = new Dialog();
    var _ = require('underscore');


    function formatRGB(v) {
        return parseInt(v * 255, 10);
    }


    return React.createClass({
        // @override
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        onPanelCloseIconClick: function () {
            this.context.dispatch('view-close-panel', this.props.type);
        },
        onPanelToggleIconClick: function () {
            this.context.dispatch('view-toggle-panel', this.props.type);
        },
        onColorClick: function () {
            var me = this;
            var mesh = this.props.mesh;
            dialog.pop({
                contentProps: {
                    value: mesh.tc.materialColor,
                    onChange: function (value) {
                        mesh.tc.materialColor = value;
                        mesh.material.color.setHex(value);
                        me.context.dispatch('updateTimer');
                    }
                },
                content: ColorSetter,
                title: 'Please Choose Material Color'
            });
        },
        render: function () {
            var expendBtnIcon = this.props.expend ? 'icon-xiashixinjiantou' : 'icon-youshixinjiantou';
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="iconfont icon-guanbi1" onClick={this.onPanelCloseIconClick}></span>
                        <span className={'iconfont ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                        Material Properties
                    </div>
                    <div className="tc-panel-content-container">
                        {this.props.expend ? editorFactory(this) : null}
                    </div>
                </div>
            );
        }
    });


    function editorFactory(me) {
        var mesh = me.props.mesh;
        var mtl = mesh.material;
        var color = mtl.color;
        var colorContainerProps = {
            style: {
                border: '1px solid #FFF',
                padding: '5px',
                cursor: 'pointer'
            },
            onClick: me.onColorClick
        };
        return (
            <table className="tc-geometry-editor">
                <tr>
                    <td>type:</td>
                    <td>{mtl.type}</td>
                </tr>
                <tr>
                    <td>color:</td>
                    <td>
                        <span {...colorContainerProps}>
                            {'R:' + formatRGB(color.r) + ' G:' + formatRGB(color.g) + ' B:' + formatRGB(color.b)}
                        </span>
                    </td>
                </tr>
            </table>
        );
    }


});
