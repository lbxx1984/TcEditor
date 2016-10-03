/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');


    return {
        // 修改3D舞台焦距
        changeCameraRadius3D: function (v) {
            this.set('stage', _.extend({}, this.get('stage'), {cameraRadius3D: v}));
        }
    };


});
