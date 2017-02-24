/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');


    return {
        'view-xoz': function () {
            this.set('view', 'view-xoz');
        },
        'view-xoy': function () {
            this.set('view', 'view-xoy');
        },
        'view-zoy': function () {
            this.set('view', 'view-zoy');
        },
        'view-3d': function () {
            this.set('view', 'view-3d');
        }
    };


});
