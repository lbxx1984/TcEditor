/**
 * @file 信息栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class InformationBar extends Component {

    static propTypes = {
        mouse3d: PropTypes.object.isRequired,
        style: PropTypes.object.isRequired
    }

    render() {
        const point = this.props.mouse3d;
        return (
            <div className="tc-information-bar" style={this.props.style}>
                <span className="axis-label">x: {point.x.toFixed(2)}</span>
                <span className="axis-label">y: {point.y.toFixed(2)}</span>
                <span className="axis-label">z: {point.z.toFixed(2)}</span>
            </div>
        );
    }

}
