/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {


    var _ = require('underscore');
    var Dialog = require('fcui2/Dialog.jsx');
    var ColorSetter = require('../components/dialogContent/ColorSetter.jsx');

    var dialog = new Dialog();


    return {
        'morpher-3d-anchor-color': function () {
            var me = this;
            dialog.pop({
                contentProps: {
                    value: this.get('morpher3Dinfo').anchorColor,
                    onChange: function (value) {
                        var info = _.extend({}, me.get('morpher3Dinfo'));
                        var mesh = me.get('selectedMesh');
                        mesh && mesh.tc && (mesh.tc.anchorColor = value);
                        info.anchorColor = value;
                        me.set('morpher3Dinfo', info)
                    }
                },
                content: ColorSetter,
                title: 'Please Choose Anchor Color'
            });
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
        },
        'morpher-3d-pick-anchor': function (anchor) {
            this.fill({
                selectedVectorIndex: anchor.tc.index,
                selectedVector: anchor
            });
        },
        'morpher-2d-pick-anchor': function (i) {
            this.set('selectedVectorIndex', i);
        }
    };


});
