/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import changeView from './changeView';
import closePanel from './closePanel';
import moveCamera from './moveCamera';
import moveCamera2d from './moveCamera2d';
import moveGroup from './moveGroup';
import openPanel from './openPanel';
import popHotkeyInfo from './popHotkeyInfo';
import resetCamera from './resetCamera';
import toggleGroup from './toggleGroup';
import togglePanel from './togglePanel';
import zoomInCamera from './zoomInCamera';
import zoomOutCamera from './zoomOutCamera';


define(function (require) {

    const _ = require('underscore');

    return _.extend(
        {},
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
            moveCamera,
            moveCamera2d,
            moveGroup,
            openPanel,
            popHotkeyInfo,
            resetCamera,
            toggleGroup,
            togglePanel,
            zoomInCamera,
            zoomOutCamera
        }
    );

});
