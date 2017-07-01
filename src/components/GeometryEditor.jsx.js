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


    var positionProps = {
        width: 80,
        type: 'int',
        step: 1
    };
    var scaleProps = {
        width: 80,
        type: 'float',
        fixed: 2
    };


    function isScaleAvailable(a) {
        a = a + '';
        if (isNaN(a) || a === '' || a === '0' || a.charAt(a.length - 1) === '.') return false;
        a = a * 1;
        if (a <= 0) return false;
        return true; 
    }


    function getMeshParam(mesh) {
        var dataset = {
            posx: 0,
            posy: 0,
            posz: 0,
            scalex: 1,
            scaley: 1,
            scalez: 1
        };
        if (!mesh) dataset;
        dataset.posx = mesh.position.x;
        dataset.posy = mesh.position.y;
        dataset.posz = mesh.position.z;
        dataset.scalex = mesh.scale.x;
        dataset.scaley = mesh.scale.y;
        dataset.scalez = mesh.scale.z;
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
            mesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
            me.context.dispatch('updateTimer');
        };
    }


    function scaleChangeHandlerFactory(me, type) {
        var mesh = me.props.mesh;
        return function (e) {
            var dataset = {};
            dataset['scale' + type] = e.target.value;
            me.setState(dataset);
            if (!isScaleAvailable(e.target.value)) return;
            mesh.scale[type] = +e.target.value;
            mesh.tc.needUpdate = me.props.view === 'view-all' ? 4 : 1;
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
                mesh.tc.needUpdate = view === 'view-all' ? 4 : 1;
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
        var positionXProps = _.extend({}, positionProps, {
            value: me.state.posx,
            onChange: positionChangeHandlerFactory(me, 'x')
        });
        var positionYProps = _.extend({}, positionProps, {
            value: me.state.posy,
            onChange: positionChangeHandlerFactory(me, 'y')
        });
        var positionZProps = _.extend({}, positionProps, {
            value: me.state.posz,
            onChange: positionChangeHandlerFactory(me, 'z')
        });
        var rotationContainerProps = {
            onMouseDown: me.onRotationMouseDown,
            onMouseUp: me.onRotationMouseUp,
            onMouseMove: me.onRotationMouseUp
        };
        var stepProps = {
            className: isNaN(me.state.step) || me.state.step === '' ? 'fcui2-numberbox-reject' : '',
            width: 65,
            type: 'float',
            fixed: 2,
            value: me.state.step,
            onChange: me.onStepChange
        };
        var scaleXProps = _.extend({}, scaleProps, {
            className: isScaleAvailable(me.state.scalex) ? '' : 'fcui2-numberbox-reject',
            value: me.state.scalex,
            onChange: scaleChangeHandlerFactory(me, 'x')
        });
        var scaleYProps = _.extend({}, scaleProps, {
            className: isScaleAvailable(me.state.scaley) ? '' : 'fcui2-numberbox-reject',
            value: me.state.scaley,
            onChange: scaleChangeHandlerFactory(me, 'y')
        });
        var scaleZProps = _.extend({}, scaleProps, {
            className: isScaleAvailable(me.state.scalez) ? '' : 'fcui2-numberbox-reject',
            value: me.state.scalez,
            onChange: scaleChangeHandlerFactory(me, 'z')
        });
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
                    <td>scale:</td>
                    <td style={{lineHeight: '30px'}}>
                        <NumberBox {...scaleXProps}/>&nbsp;x<br/>
                        <NumberBox {...scaleYProps}/>&nbsp;y<br/>
                        <NumberBox {...scaleZProps}/>&nbsp;z
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
