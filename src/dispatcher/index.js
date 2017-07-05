/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
define(function (require) {

    var _ = require('underscore');
    return _.extend(
        {},
        require('./camera'),
        require('./stage'),
        require('./system'),
        require('./geometry'),
        require('./tool'),
        require('./transformer'),
        require('./morpher'),
        require('./view'),
        require('./file')
    );

});
