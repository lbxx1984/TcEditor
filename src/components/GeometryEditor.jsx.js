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


    function getMeshParam(mesh) {
        var dataset = {
            posx: 0,
            posy: 0,
            posz: 0,
            rotx: 0,
            roty: 0,
            rotz: 0
        };
        if (!mesh) dataset;
        dataset.posx = mesh.position.x;
        dataset.posy = mesh.position.y;
        dataset.posz = mesh.position.z;
        var rotation = mesh.getWorldRotation()
        dataset.rotx = rotation.x;
        dataset.roty = rotation.y;
        dataset.rotz = rotation.z;
        return dataset;
    }


    function positionChangeHandlerFactory(me, type) {
        var mesh = me.props.mesh;
        return function (e) {
            var dataset = {};
            dataset['pos' + type] = e.target.value;
            me.setState(dataset);
            if (isNaN(e.target.value) || e.target.value === '') return;
            var pos = {
                x: mesh.position.x,
                y: mesh.position.y,
                z: mesh.position.z
            };
            pos[type] = +e.target.value;
            mesh.position.set(pos.x, pos.y, pos.z);
            mesh.tc.needUpdate = me.props.view === 'view-all' ? 3 : 1;
            me.context.dispatch('updateTimer');
        };
    }


    function rotationChangeHandlerFactory(me, type) {
        var mesh = me.props.mesh;
        return function (e) {
            var dataset = {};
            dataset['rot' + type.toLowerCase()] = e.target.value;
            me.setState(dataset);
            if (isNaN(e.target.value) || e.target.value === '') return;
            mesh['rotate' + type](e.target.value / 57.3);
            mesh.tc.needUpdate = me.props.view === 'view-all' ? 3 : 1;
            me.context.dispatch('updateTimer');
        };
    }


    return React.createClass({
        // @override
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        getInitialState: function () {
            return getMeshParam(this.props.mesh);
        },
        componentWillReceiveProps: function (nextProps) {
            if (!nextProps.mesh) return;
            if (nextProps.timer !== this.props.timer || nextProps.mesh !== this.props.mesh) {
                this.setState(getMeshParam(nextProps.mesh));
                return;
            }
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
            width: 100,
            type: 'int',
            step: 1,
            value: me.state.posx,
            onChange: positionChangeHandlerFactory(me, 'x')
        };
        var positionYProps = {
            width: 100,
            type: 'int',
            step: 1,
            value: me.state.posy,
            onChange: positionChangeHandlerFactory(me, 'y')
        };
        var positionZProps = {
            width: 100,
            type: 'int',
            step: 1,
            value: me.state.posz,
            onChange: positionChangeHandlerFactory(me, 'z')
        };
        var rotationXProps = {
            width: 100,
            type: 'float',
            fixed: 4,
            value: me.state.rotx,
            onChange: rotationChangeHandlerFactory(me, 'X')
        };
        var rotationYProps = {
            width: 100,
            type: 'float',
            fixed: 4,
            value: me.state.roty,
            onChange: rotationChangeHandlerFactory(me, 'Y')
        };
        var rotationZProps = {
            width: 100,
            type: 'float',
            fixed: 4,
            value: me.state.rotz,
            onChange: rotationChangeHandlerFactory(me, 'Z')
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
                        <NumberBox {...positionYProps}/>&nbsp;y<br/>
                        <NumberBox {...positionZProps}/>&nbsp;z
                    </td>
                </tr>
                <tr>
                    <td>rotation:</td>
                    <td style={{lineHeight: '30px'}}>
                        <NumberBox {...rotationXProps}/>&nbsp;x<br/>
                        <NumberBox {...rotationYProps}/>&nbsp;y<br/>
                        <NumberBox {...rotationZProps}/>&nbsp;z
                    </td>
                </tr>
            </table>
        );
    }


});
