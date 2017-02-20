/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');


    return {
        'morpher-3d-anchor-color': function () {
            var info = _.extend({}, this.get('morpher3Dinfo'));
            info.anchorColor = 0xff0000;
            this.set('morpher3Dinfo', info);
        },
        'morpher-3d-size-enlarge': function () {
            alert(2);
        },
        'morpher-3d-size-narrow': function () {
            alert(3);
        }
    };


});
