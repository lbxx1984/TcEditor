/**
 * 2D变换工具
 */
import renderer from './renderer';
import processer from './processor';


function containerMouseDownHandler(evt) {
    if (!this.mesh || !this.command) return;
    this.container.addEventListener('mouseup', this.containerMouseUpHandler);
    this.container.addEventListener('mousemove', this.containerMouseMoveHandler);
    this.mouseX = evt.clientX;
    this.mouseY = evt.clientY;
}

function containerMouseMoveHandler(evt) {
    if (!this.mesh || !this.command || !processer[this.mode] || !processer[this.mode][this.space]) return;
    const dx = evt.clientX - this.mouseX;
    const dy = evt.clientY - this.mouseY;
    this.mouseX = evt.clientX;
    this.mouseY = evt.clientY;
    processer[this.mode][this.space](dx, dy, this);
}

function containerMouseUpHandler() {
    this.command = '';
    this.container.removeEventListener('mouseup', this.containerMouseUpHandler);
    this.container.removeEventListener('mousemove', this.containerMouseMoveHandler);
}


export default class Transformer2D {
    constructor(param) {
        Object.assign(this, param, {
            mesh: null,
            helpers: [],
            containerMouseDownHandler: containerMouseDownHandler.bind(this),
            containerMouseUpHandler: containerMouseUpHandler.bind(this),
            containerMouseMoveHandler: containerMouseMoveHandler.bind(this)
        });
        this.container.addEventListener('mousedown', this.containerMouseDownHandler);
    }

    attach(mesh) {
        while (this.helpers.length) this.helpers.pop().remove();
        this.mesh = mesh;
        if (!mesh) return;
        if (!renderer[this.mode] || !renderer[this.mode][this.space]) return;
        renderer[this.mode][this.space](this);
    }

    detach() {
        while (this.helpers.length)
            this.helpers.pop().remove();
        this.mesh = null;
    }
}
