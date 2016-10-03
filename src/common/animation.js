/**
 * @file 3D刷新单元
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var stages = {};
    var count = 0;
    var running = false;


    function animate() {
        if (count === 0) {
            running = false;
            return;
        }
        requestAnimationFrame(animate); 
        for (var key in stages) {
            if (!stages.hasOwnProperty(key) || typeof stages[key] !== 'function') {
                continue;
            }
            stages[key]();
        }
    }


    return {
        add: function (key, animation) {
            count += stages.hasOwnProperty(key) ? 0 : 1;
            stages[key] = animation;
            if (running) {
                return;
            }
            if (count) {
                animate();
            }
        },
        remove: function (key) {
            count--;
            delete stages[key];
        }
    };


});
