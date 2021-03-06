

function worldTranslator(dx, dy, me) {
    const {mesh, helpInfo: info} = me; 
    // (dx, dy)在a轴和b轴的投影
    let d1 = (info.cosb * dx - info.sinb * dy) / (info.sina * info.cosb - info.sinb * info.cosa);
    let d2 = (info.cosa * dx - info.sina * dy) / (info.cosa * info.sinb - info.cosb * info.sina);
    // 根据命令清理投影
    d1 = me.command === me.axis[1] ? 0 : d1;
    d2 = me.command === me.axis[0] ? 0 : d2;
    // 重新换算回(dx, dy)
    dx = d1 * info.sina + d2 * info.sinb;
    dy = d1 * info.cosa + d2 * info.cosb;
    // 移动物体
    const center = info.screen2axis(info.o[0], info.o[1]);
    const to = info.screen2axis(info.o[0] + dx, info.o[1] + dy);
    const d3 = {x: 0, y: 0, z: 0};
    d3[me.axis[0]] = to[0] - center[0];
    d3[me.axis[1]] = to[1] - center[1];
    mesh.position.set(mesh.position.x + d3.x, mesh.position.y + d3.y, mesh.position.z + d3.z);
    typeof me.onChange === 'function' && me.onChange();
}

function localTranslator(dx, dy, me) {
    const {mesh, helpInfo: info} = me; 
    const d = Math.sqrt(dx * dx + dy * dy) * me.cameraRadius / 1000;
    const a = me.command
    const b = findRuleB(me.command, info);
    // (dx, dy)在a轴和b轴的投影
    /* eslint-disable max-len */
    let d1 = (info['cos' + b] * dx - info['sin' + b] * dy) / (info['sin' + a] * info['cos' + b] - info['sin' + b] * info['cos' + a]);
    let d2 = (info['cos' + a] * dx - info['sin' + a] * dy) / (info['cos' + a] * info['sin' + b] - info['cos' + b] * info['sin' + a]);
    // 根据命令清理投影
    d1 = me.command === a ? d1 : 0;
    d2 = me.command === b ? d2 : 0;
    d1 = d1 === 0 ? 0 : (d1 / Math.abs(d1) * d);
    d2 = d2 === 0 ? 0: (d1 / Math.abs(d2) * d);
    if (isNaN(d1) || isNaN(d2)) return;
    // 移动物体
    let target = {a: 0, b: 0, c: 0};
    target[a] += d1;
    target[b] += d2;
    target = info.local2world(target.a, target.b, target.c);
    mesh.position.set(target.x, target.y, target.z);
    typeof me.onChange === 'function' && me.onChange();
    // 获取一个可用的其他轴
    function findRuleB(x, obj) {
        let y = '';
        ['a', 'b', 'c'].map(item => {
            if (item === x || isNaN(obj['sin' + item]) || isNaN(obj['cos' + item])) return;
            y = item;
        });
        return y;
    };
}

function localRotater(dx, dy, me) {
    const mesh = me.mesh;
    const d = Math.sqrt(dx * dx + dy * dy);
    mesh['rotate' + me.command.toUpperCase()]((dx > 0 ? 1 : -1) * d * 0.01744);
    typeof me.onChange === 'function' && me.onChange();
}


export default {
    translate: {
        world: worldTranslator,
        local: localTranslator
    },
    rotate: {
        local: localRotater,
        world: localRotater
    }
};
