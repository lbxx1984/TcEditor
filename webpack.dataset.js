

const nodePath = require('path');

const getAbsPath = dist => nodePath.resolve(__dirname, dist);

module.exports = {
    'babel-exclude': [
        getAbsPath('dep/three/index'),
        getAbsPath('dep/raphael.2.2.1.min'),
        getAbsPath('dep/FileSaver.1.3.3.min'),
        getAbsPath('dep/jszip.3.1.3.min')
    ],
    'resolve-alias': {
        'core': getAbsPath('src/core'),
        'three' : getAbsPath('dep/three'),
        'raphael': getAbsPath('dep/raphael.2.2.1.min'),
        'FileSystem': getAbsPath('dep/filesystem.0.0.2'),
        'FileSaver': getAbsPath('dep/FileSaver.1.3.3.min'),
        'jszip': getAbsPath('dep/jszip.3.1.3.min')
    }
};