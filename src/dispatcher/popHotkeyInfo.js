/**
 * @file 弹出快捷键说明窗体
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import HotkeyInfo from '../components/HotkeyInfo';
import dialog from 'tcui/dialog';

export default function() {
    dialog.pop({
        title: 'Hotkey Config',
        content: HotkeyInfo
    });
}
