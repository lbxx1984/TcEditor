/**
 * @file 材质编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var Dialog = require('fcui2/Dialog.jsx');
    var CheckBox = require('fcui2/CheckBox.jsx');
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
        onEmissiveChange: function () {
            var me = this;
            var mesh = this.props.mesh;
            dialog.pop({
                contentProps: {
                    value: mesh.tc.materialEmissive,
                    onChange: function (value) {
                        mesh.tc.materialEmissive = value;
                        mesh.material.emissive.setHex(value);
                        me.context.dispatch('updateTimer');
                    }
                },
                content: ColorSetter,
                title: 'Please Choose Material Emissive'
            });
        },
        onWireframeChange: function (e) {
            this.props.mesh.material.wireframe = e.target.checked;
            this.context.dispatch('updateTimer');
        },
        render: function () {
            var expendBtnIcon = this.props.expend ? 'icon-xiashixinjiantou' : 'icon-youshixinjiantou';
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="tc-icon icon-guanbi1" onClick={this.onPanelCloseIconClick}></span>
                        <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
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
        var emissive = mtl.emissive;
        var colorContainerStyle = {
            border: '1px solid #FFF',
            padding: '4px',
            cursor: 'pointer'
        };
        var wireframeProps = {
            checked: mtl.wireframe,
            onChange: me.onWireframeChange
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
                        <span style={colorContainerStyle} onClick={me.onColorClick}>
                            {'R:' + formatRGB(color.r) + ' G:' + formatRGB(color.g) + ' B:' + formatRGB(color.b)}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>emissive:</td>
                    <td>
                        <span style={colorContainerStyle} onClick={me.onEmissiveChange}>
                            {'R:' + formatRGB(emissive.r) + ' G:' + formatRGB(emissive.g) + ' B:' + formatRGB(emissive.b)}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>wireframe:</td>
                    <td><CheckBox {...wireframeProps}/></td>
                </tr>
            </table>
        );
    }


});
