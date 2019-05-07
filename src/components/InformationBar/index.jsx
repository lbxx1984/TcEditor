/**
 * @file 信息栏
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.less';

export default class InformationBar extends Component {

    static propTypes = {
        mouse3d: PropTypes.object.isRequired
    }

    render() {
        const point = this.props.mouse3d;
        return (
            <div className="tc-information-bar">
                <span className="axis-label">x: {point.x.toFixed(2)}</span>
                <span className="axis-label">y: {point.y.toFixed(2)}</span>
                <span className="axis-label">z: {point.z.toFixed(2)}</span>
            </div>
        );
    }

}
