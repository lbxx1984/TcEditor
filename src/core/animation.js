/**
 * @file 3D刷新单元
 * @author Brian Li
 * @email lbxxlht@163.com
 */
const stages = {};
let count = 0;
let running = false;

function animate() {
    if (count === 0) {
        running = false;
        return;
    }
    requestAnimationFrame(animate); 
    Object.keys(stages).map(key => {
        stages[key]();
    });
}

function add(key, animation) {
    count += stages.hasOwnProperty(key) ? 0 : 1;
    stages[key] = animation;
    if (running) {
        return;
    }
    if (count) {
        animate();
    }
}

function remove(key) {
    count--;
    delete stages[key];
}

export default {
    add,
    remove
}
