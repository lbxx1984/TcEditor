/**
 * @file 弹出快捷键说明窗体
 * @author Brian Li
 * @email lbxxlht@163.com
 */

import HotkeyInfo from '../components/HotkeyInfo';
import Dialog from 'tcui/Dialog';

export default function() {
    const dialog = new Dialog();
    dialog.pop({
        title: 'Hotkey Config',
        content: HotkeyInfo
    });
}
