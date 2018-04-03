/**
 * 2D舞台渲染器
 */
import Mesh2D from './Mesh2D';
import wrapMathFunction from './util/wrapMathFunction';


function line(x0, y0, x1, y1, ctx) {
    const d = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1));
    const r = 1;
    const sina = (x1 - x0) / d;
    const cosa = (y1 - y0) / d;
    ctx.moveTo(x0 + r * cosa, y0 - r * sina);
    ctx.lineTo(x1 + r * cosa, y1 - r * sina);
    ctx.lineTo(x1 - r * cosa, y1 + r * sina);
    ctx.lineTo(x0 - r * cosa, y0 + r * sina);
    ctx.lineTo(x0 + r * cosa, y0 - r * sina);
}

function setupMesh(mesh3d, mesh2d) {
    mesh2d = mesh2d || {};
    Object.keys(mesh3d).map(key => {
        if (!mesh2d[key]) mesh2d[key] = new Mesh2D({mesh3d: mesh3d[key]});
    });
    Object.keys(mesh2d).map(key => {
        if (!mesh3d[key]) delete mesh2d[key];
    });
    return mesh2d;
}


export default class Renderer2D {

    constructor(param) {
        Object.assign(this, param);
    }

    render(mouseX, mouseY) {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        const axis = this.axis;
        const axis2screen = wrapMathFunction('axis2screen', this);
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        if (Object.keys(this.mesh3d).length === 0) return;
        this.mesh2d = setupMesh(this.mesh3d, this.mesh2d);
        let hoverMesh3D = null;
        Object.keys(this.mesh2d).map(key => {
            const item = this.mesh2d[key];
            const mesh = item.mesh3d;
            if (!mesh.visible) return;
            const vertices = item.vertices;
            let color = mesh.material.color.getHex().toString(16);
            while (color.length < 6)
                color = '0' + color;
            ctx.beginPath();
            ctx.lineStyle = 2;
            ctx.fillStyle = '#' + color;
            mesh.geometry.faces.map(face => {
                const x = axis[0];
                const y = axis[1];
                const a = axis2screen(vertices[face.a][x], vertices[face.a][y]);
                const b = axis2screen(vertices[face.b][x], vertices[face.b][y]);
                const c = axis2screen(vertices[face.c][x], vertices[face.c][y]);
                line(a[0], a[1], b[0], b[1], ctx);
                line(b[0], b[1], c[0], c[1], ctx);
                line(c[0], c[1], a[0], a[1], ctx); 
            });
            hoverMesh3D = !isNaN(mouseX) && !isNaN(mouseY) && ctx.isPointInPath(mouseX, mouseY)
                ? mesh : hoverMesh3D;
            ctx.fill();    
        });
        return hoverMesh3D;
    }

    getObject2dByMouse2D(x, y) {
        x = x - this.container.offsetLeft;
        y = y - this.container.offsetTop;
        return this.render(x, y);
    }

}
