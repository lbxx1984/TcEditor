/**
 * @file 物体编辑器
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var TextBox = require('fcui2/TextBox.jsx');
    var NumberBox = require('fcui2/NumberBox.jsx');

    var _ = require('underscore');
    var uiUtil = require('fcui2/core/util');


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
        onNameChange: function (e) {
            this.props.mesh.tc.name = e.target.value;
            this.context.dispatch('updateTimer');
        },
        render: function () {
            var expendBtnIcon = this.props.expend ? 'icon-xiashixinjiantou' : 'icon-youshixinjiantou';
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="iconfont icon-guanbi1" onClick={this.onPanelCloseIconClick}></span>
                        <span className={'iconfont ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
                        Geometry Properties
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
        var geo = mesh.geometry;
        var nameEditorProps = {
            value: typeof mesh.tc.name === 'string'
                ? mesh.tc.name
                : (mesh.geometry.type.replace('Geometry', ' ') + uiUtil.dateFormat(mesh.tc.birth, 'DD/MM hh:mm:ss')),
            onChange: me.onNameChange
        };
        var positionXProps = {
            width: 100
        };
        return (
            <table className="tc-geometry-editor">
                <tr>
                    <td>type:</td>
                    <td>{geo.type}</td>
                </tr>
                <tr>
                    <td>name:</td>
                    <td><TextBox {...nameEditorProps}/></td>
                </tr>
                <tr style={{marginTop: 5}}>
                    <td>position:</td>
                    <td style={{lineHeight: '30px'}}>
                        <NumberBox {...positionXProps}/>&nbsp;x<br/>
                        <NumberBox {...positionXProps}/>&nbsp;y<br/>
                        <NumberBox {...positionXProps}/>&nbsp;z
                    </td>
                </tr>
            </table>
        );
    }


});
