

var path = require('path');


exports.input = __dirname;
exports.output = path.resolve(__dirname, 'build');
exports.exclude = [
    'edp-build-config.js',
    'edp-midlayer-react.js',
    'edp-webserver-config.js',
    'module.conf',
    '.gitignore',
    'package.json',
    '*.conf',
    '*.md',
    '*.log',
    'node_modules',
    'old_code',
    'deps',
    'compiler'
];


exports.getProcessors = function () {

    // 自定义pressor
    var ReactPressor = require('./compiler/ReactPressor');
    var MergeDeps = require('./compiler/MergeDeps');
    var EncodeTTF = require('./compiler/EncodeTTF');

    // 创建pressor实例
    var encodeTTF = new EncodeTTF({
        files: ['main.less']                    // 将ttf文件以base64编码读入，并写如iconfont.less中
    });
    var mergeDeps = new MergeDeps({               // 移动deps文件中的文件
        files: ['index.html']
    });         
    var reactProcessor = new ReactPressor({     // react编译
        files: ['*.jsx.js']
    });
    var jsCompressor = new JsCompressor({       // JS压缩
        files: ['main.js']
    }); 
    var lessProcessor = new LessCompiler({      // less编译
        files: ['main.less']
    });
    var moduleCompiler = new ModuleCompiler({   // AMD模块编译
        configFile: 'build.conf'
    });
    var outputCleaner = new OutputCleaner({     // 清理垃圾
        files: [
            '*.less',
            '*.js',
            '*.eot',
            '*.svg',
            '*.ttf',
            '*.woff',
            '!src/main.js',
            '!css/main.less'
        ]
    });

    return {
        'default': [
            mergeDeps,
            reactProcessor,
            lessProcessor,
            encodeTTF,
            moduleCompiler,
            jsCompressor,
            outputCleaner
        ]
    };
};


exports.injectProcessor = function (processors) {
    for (var key in processors) {
        global[key] = processors[key];
    }
};
