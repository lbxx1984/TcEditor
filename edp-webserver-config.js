exports.port = 8089;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

// 导入配置
exports.getLocations = function () {
    return [
        {
            location: /\.(es6|jsx)\.js/,
            handler: [
                babel({
                    sourceMaps: 'both'
                }, {
                    forceTransform: true
                })
            ]
        },
        {
            location: /\/$/,
            handler: home( 'index.html' )
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autoless()
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less()
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
