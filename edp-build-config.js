

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
    'deps',
    'compiler'
];


exports.getProcessors = function () {

    // 自定义pressor
    var ReactPressor = require('./compiler/ReactPressor');
    var MoveDeps = require('./compiler/MoveDeps');

    // 创建pressor实例
    var moveDeps = new MoveDeps({               // 移动deps文件中的文件
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
            '!src/main.js',
            '!css/main.less'
        ]
    });

    return {
        'default': [
            moveDeps,
            reactProcessor,
            lessProcessor,
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
