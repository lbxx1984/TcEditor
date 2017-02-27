/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var _ = require('underscore');
    var Grid2D = require('../tools/Grid2D');
    

    return React.createClass({

        contextTypes: {
            dispatch: React.PropTypes.func
        },

        // @override
        getDefaultProps: function () {
            return {
                rotation: 0,
                lookAt: {x:0, y:0, z:0},
                zoom: 1000
            };
        },

        componentDidMount: function () {
            this.grid2D = new Grid2D({
                axis: this.props.axis,
                cameraRadius: this.props.cameraRadius,
                cameraLookAt: this.props.cameraLookAt,
                cameraAngleA: this.props.cameraAngleA,
                cameraAngleB: this.props.cameraAngleB,
                container: this.refs.container,
                canvas: this.refs.grid,
                lineColor: this.props.colorGrid
            });
            this.grid2D.render();
        },

        componentWillReceiveProps: function (nextProps) {
        },

        componentWillUnmount: function () {

        },

        render: function () {
            var containerProps = {
                className: 'tc-stage',
                ref: 'container',
                style: this.props.style
            };
            return (
                <div {...containerProps}>
                    <canvas ref="grid" className="fixed-canvas"/>
                </div>
            );
        }
    });

});
