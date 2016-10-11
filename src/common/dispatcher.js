/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {

    var _ = require('underscore');
    return _.extend(
        {},
        require('../commands/camera'),
        require('../commands/stage'),
        require('../commands/system'),
        require('../commands/geometry'),
        require('../commands/tool')
    );

});
