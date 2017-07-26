/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');


    return {
        'transformer-3d-mode-translate': function () {
            this.set('transformer3Dinfo', _.extend({}, this.get('transformer3Dinfo'), {
                mode: 'translate'
            }));
        },
        'transformer-3d-mode-rotate': function () {
            this.set('transformer3Dinfo', _.extend({}, this.get('transformer3Dinfo'), {
                mode: 'rotate'
            }));
        },
        'transformer-3d-mode-scale': function () {
            this.set('transformer3Dinfo', _.extend({}, this.get('transformer3Dinfo'), {
                mode: 'scale'
            }));
        },
        'transformer-3d-size-enlarge': function () {
            var info = this.get('transformer3Dinfo');
            this.set('transformer3Dinfo', _.extend({}, this.get('transformer3Dinfo'), {
                size: info.size + 0.1
            }));
        },
        'transformer-3d-size-narrow': function () {
            var info = this.get('transformer3Dinfo');
            this.set('transformer3Dinfo', _.extend({}, this.get('transformer3Dinfo'), {
                size: Math.max(info.size - 0.1, 0.1)
            }));
        },
        'transformer-3d-space': function () {
            var info = this.get('transformer3Dinfo');
            this.set('transformer3Dinfo', _.extend({}, this.get('transformer3Dinfo'), {
                space: info.space === 'world' ? 'local' : 'world'
            }));
        }
    };


});
