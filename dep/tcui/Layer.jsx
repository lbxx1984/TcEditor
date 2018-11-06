import React from 'react';
import PropTypes from 'prop-types';
import PortalComponent from './core/PortalComponent';
import getDomPosition from './util/getDomPosition';
import './css/Layer.less';


function getLayerPosition(layer, anchor, layerLocation) {
    const layerHeight = layer.offsetHeight;
    const layerWidth = layer.offsetWidth;
    const anchorHeight = anchor.offsetHeight;
    const anchorWidth = anchor.offsetWidth;
    const anchorPosition = getDomPosition(anchor);
    const tempPosition = {
        top: anchorPosition.top - layerHeight,
        bottom: anchorPosition.top + anchorHeight,
        left: anchorPosition.left + anchorWidth - layerWidth,
        right: anchorPosition.left
    };
    const clockPosition = {
        '1': [tempPosition.right, tempPosition.top],
        '2': [tempPosition.right + anchorWidth, tempPosition.top],
        '3': [tempPosition.right + anchorWidth, tempPosition.bottom - layerHeight + 1],
        '3.5': [tempPosition.right + anchorWidth, anchorPosition.top + anchorHeight / 2 - layerHeight / 2],
        '4': [tempPosition.right + anchorWidth, anchorPosition.top],
        '5': [tempPosition.right + anchorWidth, tempPosition.bottom + 1],
        '6': [tempPosition.right, tempPosition.bottom],
        '6.5': [anchorPosition.left + anchorWidth / 2 - layerWidth / 2, tempPosition.bottom],
        '7': [tempPosition.left, tempPosition.bottom],
        '8': [anchorPosition.left - layerWidth, tempPosition.bottom],
        '9': [anchorPosition.left - layerWidth, anchorPosition.top],
        '9.5': [anchorPosition.left - layerWidth, anchorPosition.top + anchorHeight / 2 - layerHeight / 2],
        '10': [anchorPosition.left - layerWidth, tempPosition.bottom - layerHeight + 1],
        '11': [anchorPosition.left - layerWidth, tempPosition.top],
        '12': [tempPosition.left, tempPosition.top],
        '12.5': [anchorPosition.left + anchorWidth / 2 - layerWidth / 2, tempPosition.top]
    };
    // clock positioning
    const clock = layerLocation.split(' ')
        .reduce((r, i) => r ? r : (!isNaN(i) && clockPosition.hasOwnProperty(i) ? i : ''), '');
    if (clock !== '') {
        return {
            left: clockPosition[clock][0],
            top: clockPosition[clock][1],
            clockPosition: clock
        };
    }
    // words positioning
    const topIndex = layerLocation.indexOf('top');
    const bottomIndex = layerLocation.indexOf('bottom');
    const leftIndex = layerLocation.indexOf('left');
    const rightIndex = layerLocation.indexOf('right');
    const result = {
        left: -9999,
        top: -9999,
        clockPosition: ''
    };
    // up
    if (topIndex > -1 && bottomIndex < 0) { 
        result.top = tempPosition.top;
    }
    // down
    else if (bottomIndex > -1 && topIndex < 0) {
        result.top = tempPosition.bottom;
    }
    // up then down
    else if (topIndex < bottomIndex) {
        result.top = anchorPosition.y - layerHeight > 0 ? tempPosition.top : tempPosition.bottom;
    }
    // down then up
    else {
        result.top = anchorPosition.y + anchorHeight + layerHeight >= document.documentElement.clientHeight
            ? tempPosition.top : tempPosition.bottom;
    }
    // left
    if (leftIndex > -1 && rightIndex < 0) {
        result.left = tempPosition.left;
    }
    // right
    else if (rightIndex > -1 && leftIndex < 0) {
        result.left = tempPosition.right;
    }
    // left then right
    else if (leftIndex < rightIndex) {
        result.left = anchorPosition.left + anchorWidth - layerWidth > 0
            ? tempPosition.left : tempPosition.right
    }
    // right then left
    else {
        result.left = anchorPosition.x + layerWidth >= document.documentElement.clientWidth
            ? tempPosition.left : tempPosition.right;
    }
    return result;
}


export default class Layer extends PortalComponent {

    static propTypes = {
        location: PropTypes.string,
        open: PropTypes.object,
        onOffset: PropTypes.func
    }

    static defaultProps = {
        location: 'bottom top',
        hideMask: true
    }

    constructor(args) {
        super(args);
        this.fixedPositionTimer = null;
        this.fixedPosition = this.fixedPosition.bind(this);
    }

    fixedPosition() {
        const {open, location, onOffset} = this.props;
        const layer = this.dom;
        const pos = getLayerPosition(layer, open, String(location));
        typeof onOffset === 'function' && onOffset(pos);
        layer.style.left = pos.left + 'px';
        layer.style.top = pos.top + 'px';
    }

    onShow() {
        this.fixedPositionTimer = setInterval(this.fixedPosition, 200);
    }

    onHide() {
        const layer = this.dom;
        layer.style.left = '-9999px';
        layer.style.top = '-9999px';
        clearInterval(this.fixedPositionTimer);
    }
}
