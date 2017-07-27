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
    var math = require('../core/math.js');


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


    function getMeshParam(props) {
        var mesh = props.mesh;
        var dataset = {
            posx: 0,
            posy: 0,
            posz: 0,
            scalex: 1,
            scaley: 1,
            scalez: 1,
            vectorx: 0,
            vectory: 0,
            vectorz: 0
        };
        if (!mesh) dataset;
        if (props.selectedVectorIndex > -1) {
            var matrix = math.getRotateMatrix(mesh);
            var vector = mesh.geometry.vertices[props.selectedVectorIndex];
            var pos = math.local2world(vector.x, vector.y, vector.z, matrix, mesh);
            dataset.vectorx = parseInt(pos[0], 10);
            dataset.vectory = parseInt(pos[1], 10);
            dataset.vectorz = parseInt(pos[2], 10);
        }
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


    function vectorChangeHandlerFactory(me, type) {
        var mesh = me.props.mesh;
        var index = me.props.selectedVectorIndex;
        return function (e) {
            var dataset = {};
            dataset['vector' + type] = e.target.value;
            me.setState(dataset);
            if (isNaN(e.target.value) || e.target.value === '') return;
            var vector = {
                x: me.state.vectorx,
                y: me.state.vectory,
                z: me.state.vectorz
            };
            vector[type] = +e.target.value;
            var pos = math.world2local(vector.x, vector.y, vector.z, mesh);
            mesh.geometry.vertices[index].x = pos[0];
            mesh.geometry.vertices[index].y = pos[1];
            mesh.geometry.vertices[index].z = pos[2];
            mesh.geometry.verticesNeedUpdate = true;
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
            }, getMeshParam(this.props));
        },
        componentWillReceiveProps: function (nextProps) {
            if (!nextProps.mesh) return;
            if (
                nextProps.timer !== this.props.timer || nextProps.mesh !== this.props.mesh
                || nextProps.selectedVectorIndex !== this.props.selectedVectorIndex
            ) {
                this.setState(getMeshParam(nextProps));
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
            var expendBtnIcon = this.props.expend ? 'icon-down' : 'icon-right';
            return (
                <div className="tc-meshlist">
                    <div className="tc-panel-title-bar">
                        <span className="tc-icon icon-close" onClick={this.onPanelCloseIconClick}></span>
                        <span className={'tc-icon ' + expendBtnIcon} onClick={this.onPanelToggleIconClick}></span>
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
                            <span data-type="X" data-value="-1" className="tc-icon icon-left"></span>x
                            <span data-type="X" data-value="1" className="tc-icon icon-right"></span><br/>
                            <span data-type="Y" data-value="-1" className="tc-icon icon-left"></span>y
                            <span data-type="Y" data-value="1" className="tc-icon icon-right"></span><br/>
                            <span data-type="Z" data-value="-1" className="tc-icon icon-left"></span>z
                            <span data-type="Z" data-value="1" className="tc-icon icon-right"></span>
                        </div>
                    </td>
                </tr>
                {me.props.selectedVectorIndex > -1 ? vectorEditorFactory(me) : null}
            </table>
        );
    }


    function vectorEditorFactory(me) {
        var xProps = _.extend({}, positionProps, {
            value: me.state.vectorx,
            onChange: vectorChangeHandlerFactory(me, 'x')
        });
        var yProps = _.extend({}, positionProps, {
            value: me.state.vectory,
            onChange: vectorChangeHandlerFactory(me, 'y')
        });
        var zProps = _.extend({}, positionProps, {
            value: me.state.vectorz,
            onChange: vectorChangeHandlerFactory(me, 'z')
        });
        return (
            <tr style={{marginTop: 5}}>
                <td>Vector:</td>
                <td style={{lineHeight: '30px'}}>
                    <NumberBox {...xProps}/>&nbsp;x<br/>
                    <NumberBox {...yProps}/>&nbsp;y<br/>
                    <NumberBox {...zProps}/>&nbsp;z
                </td>
            </tr>
        );
    }

});