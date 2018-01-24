/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import changeView from './changeView';
import closePanel from './closePanel';
import moveGroup from './moveGroup';
import openPanel from './openPanel';
import popHotkeyInfo from './popHotkeyInfo';
import toggleGroup from './toggleGroup';
import togglePanel from './togglePanel';

define(function (require) {

    const _ = require('underscore');

    return _.extend(
        {},
        require('./camera'),
        require('./stage'),
        require('./system'),
        require('./geometry'),
        require('./tool'),
        require('./transformer'),
        require('./morpher'),
        require('./file'),
        {
            changeView,
            closePanel,
            moveGroup,
            openPanel,
            popHotkeyInfo,
            toggleGroup,
            togglePanel
        }
    );

});
