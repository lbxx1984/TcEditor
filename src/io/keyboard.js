define(function (Require) {
    var keyHash = {
        8: 'backspace',
        9: 'tab',
        12: 'clear',
        13: 'enter',
        16: 'shift',
        17: 'control',
        18: 'alt',
        19: 'pause',
        20: 'capslock',
        27: 'escape',
        32: 'space',
        33: 'pageUp',
        34: 'pageDown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        41: 'select',
        42: 'print',
        43: 'execute',
        45: 'insert',
        46: 'delete',
        47: 'help',
        48: '0',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6',
        55: '7',
        56: '8',
        57: '9',
        65: 'a',
        66: 'b',
        67: 'c',
        68: 'd',
        69: 'e',
        70: 'f',
        71: 'g',
        72: 'h',
        73: 'i',
        74: 'j',
        75: 'k',
        76: 'l',
        77: 'm',
        78: 'n',
        79: 'o',
        80: 'p',
        81: 'q',
        82: 'r',
        83: 's',
        84: 't',
        85: 'u',
        86: 'v',
        87: 'w',
        88: 'x',
        89: 'y',
        90: 'z',
        96: 's0',
        97: 's1',
        98: 's2',
        99: 's3',
        100: 's4',
        101: 's5',
        102: 's6',
        103: 's7',
        104: 's8',
        105: 's9',
        106: 's*',
        107: 's+',
        109: 's-',
        110: 's.',
        111: 's/',
        112: 'f1',
        113: 'f2',
        114: 'f3',
        115: 'f4',
        116: 'f5',
        117: 'f6',
        118: 'f7',
        119: 'f8',
        120: 'f9',
        121: 'f10',
        122: 'f11',
        123: 'f12',
        124: 'f13',
        125: 'f14',
        126: 'f15',
        127: 'f16',
        128: 'f17',
        129: 'f18',
        130: 'f19',
        131: 'f20',
        132: 'f21',
        133: 'f22',
        134: 'f23',
        135: 'f24',
        144: 'numLock',
        145: 'scrollLock',
        186: ';',
        187: '=',
        188: '<',
        189: '-',
        190: '>',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\''
    };

    // 此处配置在全局屏蔽
    var preventDefaultAll = [
        'ctrl+s',
        'ctrl+o'
    ];
    // 此处配置INPUT中不屏蔽，document上屏蔽
    var preventDefaultIgnoreInput = [
        'backspace'
    ];

    return {
        translate: function (e) {
            var result = keyHash.hasOwnProperty(e.keyCode) ? keyHash[e.keyCode] : 'unknow';
            if (e.shiftKey) {
                result = 'shift+' + result;
            }
            if (e.altKey) {
                result = 'alt+' + result;
            }
            if (e.ctrlKey) {
                result = 'ctrl+' + result;
            }
            return result;
        },
        preventDefault: function (e) {
            var key = this.translate(e);
            if (preventDefaultAll.indexOf(key) > -1) {
                return true;
            }
            return preventDefaultIgnoreInput.indexOf(key) > -1 && e.target.tagName !== 'INPUT';
        }
    };
});
