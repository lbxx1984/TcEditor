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
            posz: 0
        };
        if (!mesh) dataset;
        dataset.posx = mesh.position.x;
        dataset.posy = mesh.position.y;
        dataset.posz = mesh.position.z;
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


    return React.createClass({
        // @override
        contextTypes: {
            dispatch: React.PropTypes.func
        },
        getInitialState: function () {
            return _.extend({
                step: 1
            }, getMeshParam(this.props.mesh));
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
        onStepChange: function (e) {
            this.setState({step: e.target.value});
        },
        onRotationMouseDown: function (e) {
            var type = e.target.dataset.type;
            var value = +e.target.dataset.value;
            var step = this.state.step;
            var mesh = this.props.mesh;
            var dispatch = this.context.dispatch;
            var view = this.props.view;
            if (!type || !mesh || isNaN(step) || step === '') return;
            step *= value / 57.3;
            moving();
            clearInterval(this.timer);
            this.timer = setInterval(moving, 100);
            function moving() {
                mesh['rotate' + type](step);
                mesh.tc.needUpdate = view === 'view-all' ? 3 : 1;
                dispatch('updateTimer');
            }
        },
        onRotationMouseUp: function (e) {
            clearInterval(this.timer);
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
        var stepProps = {
            className: isNaN(me.state.step) || me.state.step === '' ? 'fcui2-numberbox-reject' : '',
            width: 100,
            type: 'float',
            fixed: 2,
            value: me.state.step,
            onChange: me.onStepChange
        };
        var rotationContainerProps = {
            onMouseDown: me.onRotationMouseDown,
            onMouseUp: me.onRotationMouseUp,
            onMouseMove: me.onRotationMouseUp
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
                        <span style={{float: 'right'}}>
                            step:&nbsp;<NumberBox {...stepProps}/>&nbsp;
                        </span>
                        <div {...rotationContainerProps}>
                            <span data-type="X" data-value="-1" className="iconfont icon-zuoshixinjiantou"></span>x
                            <span data-type="X" data-value="1" className="iconfont icon-youshixinjiantou"></span><br/>
                            <span data-type="Y" data-value="-1" className="iconfont icon-zuoshixinjiantou"></span>y
                            <span data-type="Y" data-value="1" className="iconfont icon-youshixinjiantou"></span><br/>
                            <span data-type="Z" data-value="-1" className="iconfont icon-zuoshixinjiantou"></span>z
                            <span data-type="Z" data-value="1" className="iconfont icon-youshixinjiantou"></span>
                        </div>
                    </td>
                </tr>
            </table>
        );
    }


});
