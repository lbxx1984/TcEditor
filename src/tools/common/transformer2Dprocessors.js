define(function (require) {


    return {
        translate: {
            world: function (dx, dy, me) {
                var mesh = me.mesh;
                var info = me.helpInfo;
                var d1 = (info.cosb * dx - info.sinb * dy) / (info.sina * info.cosb - info.sinb * info.cosa);
                var d2 = (info.cosa * dx - info.sina * dy) / (info.cosa * info.sinb - info.cosb * info.sina);
                d1 = me.command === me.axis[1] ? 0 : d1;
                d2 = me.command === me.axis[0] ? 0 : d2;
                dx = d1 * info.sina + d2 * info.sinb;
                dy = d1 * info.cosa + d2 * info.cosb;
                var center = info.screen2axis(info.o[0], info.o[1]);
                var to = info.screen2axis(info.o[0] + dx, info.o[1] + dy);
                var d3 = {x: 0, y: 0, z: 0};
                d3[me.axis[0]] = to[0] - center[0];
                d3[me.axis[1]] = to[1] - center[1];
                mesh.position.set(mesh.position.x + d3.x, mesh.position.y + d3.y, mesh.position.z + d3.z);
                typeof me.onChange === 'function' && me.onChange();
            }
        }
    };


});