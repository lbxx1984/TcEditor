import React from 'react';
import BaseComponent from './BaseComponent';

const LAYER_CLOSE_TIME_OUT = 200;

export default class AnchorComponent extends BaseComponent {

    constructor(args) {
        super(args);
        this.layerTimer = null;
        this.openLayer = this.openLayer.bind(this);
        this.closeLayer = this.closeLayer.bind(this);
        this.state.layerAnchor = null;
    }

    openLayer() {
        clearTimeout(this.layerTimer);
        this.setState({
            layerAnchor: this.refs.rootContainer
        });
    }

    closeLayer() {
        this.layerTimer = setTimeout(() => {
            this.setState({layerAnchor: null});
        }, LAYER_CLOSE_TIME_OUT);
    }
    
}
