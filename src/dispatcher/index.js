/**
 * @file 修改model的句柄
 * @author Brian Li
 * @email lbxxlht@163.com
 */
import changeCamera3D from './changeCamera3D';
import changeMouse3D from './changeMouse3D';
import changeView from './changeView';
import clearSelected from './clearSelected';
import closePanel from './closePanel';
import enlargeGrid from './enlargeGrid';
import moveCamera from './moveCamera';
import moveCamera2D from './moveCamera2D';
import moveGroup from './moveGroup';
import narrowGrid from './narrowGrid';
import openPanel from './openPanel';
import popHotkeyInfo from './popHotkeyInfo';
import resetCamera from './resetCamera';
import toggleGroup from './toggleGroup';
import toggleHelper from './toggleHelper';
import togglePanel from './togglePanel';
import updateTimer from './updateTimer';
import zoomInCamera from './zoomInCamera';
import zoomOutCamera from './zoomOutCamera';


define(function (require) {

    const _ = require('underscore');

    return _.extend(
        {},
        require('./system'),
        require('./geometry'),
        require('./tool'),
        require('./transformer'),
        require('./morpher'),
        require('./file'),
        {
            changeCamera3D,
            changeMouse3D,
            changeView,
            clearSelected,
            closePanel,
            enlargeGrid,
            moveCamera,
            moveCamera2D,
            moveGroup,
            narrowGrid,
            openPanel,
            popHotkeyInfo,
            resetCamera,
            toggleGroup,
            toggleHelper,
            togglePanel,
            updateTimer,
            zoomInCamera,
            zoomOutCamera
        }
    );

});
