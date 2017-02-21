/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var Dialog = require('fcui2/Dialog.jsx');
    var AnchorColorSetter = require('../components/dialogContent/MorpherAnchorColorSetter.jsx');

    var dialog = new Dialog();


    return {
        'morpher-3d-anchor-color': function () {
            var info = _.extend({}, this.get('morpher3Dinfo'));
            var me = this;
            dialog.pop({
                contentProps: {},
                content: AnchorColorSetter,
                title: 'Please Choose Anchor Color'
            });
            // info.anchorColor = 0xff0000;
            // this.set('morpher3Dinfo', info);
        },
        'morpher-3d-size-enlarge': function () {
            var info = _.extend({}, this.get('morpher3Dinfo'));
            info.anchorSize = info.anchorSize / 1.1;
            info.anchorSize = Math.max(info.anchorSize, 500);
            this.set('morpher3Dinfo', info);
        },
        'morpher-3d-size-narrow': function () {
            var info = _.extend({}, this.get('morpher3Dinfo'));
            info.anchorSize = info.anchorSize * 1.1;
            info.anchorSize = Math.min(info.anchorSize, 1000);
            this.set('morpher3Dinfo', info);
        }
    };


});
