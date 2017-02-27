/**
 * @file 2D 舞台
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var React = require('react');
    var _ = require('underscore');
    var Grid2D = require('../tools/Grid2D');
    

    function updateGrid(nextProps, me) {
        if (
            nextProps.axis.join('') !== me.props.axis.join('')
            || nextProps.cameraRadius !== me.props.cameraRadius
            || nextProps.cameraLookAt !== me.props.cameraLookAt
            || nextProps.cameraAngleA !== me.props.cameraAngleA
            || nextProps.cameraAngleB !== me.props.cameraAngleB
            || nextProps.gridColor !== me.props.gridColor
        ) {
            me.grid2D.axis = nextProps.axis;
            me.grid2D.cameraRadius = nextProps.cameraRadius;
            me.grid2D.cameraLookAt = nextProps.cameraLookAt;
            me.grid2D.cameraAngleA = nextProps.cameraAngleA;
            me.grid2D.cameraAngleB = nextProps.cameraAngleB;
            me.grid2D.lineColor = nextProps.gridColor;
            me.grid2D.render();
        }
    }


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
                lineColor: this.props.gridColor
            });
            this.grid2D.render();
        },

        componentWillReceiveProps: function (nextProps) {
            updateGrid(nextProps, this);
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
