

const nodePath = require('path');

const getAbsPath = dist => nodePath.resolve(__dirname, dist);

module.exports = {
    'babel-exclude': [
        getAbsPath('dep/three.84.min'),
        getAbsPath('dep/raphael.2.2.1.min'),
        getAbsPath('dep/FileSaver.1.3.3.min'),
        getAbsPath('dep/jszip.3.1.3.min')
    ],
    'resolve-alias': {
        'core': getAbsPath('src/core'),
        'three' : getAbsPath('dep/three'),
        'fcui2': getAbsPath('dep/fcui2/src'),
        'raphael': getAbsPath('dep/raphael.2.2.1.min'),
        'file-system': getAbsPath('dep/filesystem.0.0.2'),
        'FileSaver': getAbsPath('dep/FileSaver.1.3.3.min'),
        'jszip': getAbsPath('dep/jszip.3.1.3.min'),
        'underscore': getAbsPath('dep/underscore.1.8.5')
    }
};