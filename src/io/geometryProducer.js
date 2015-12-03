define(function (require) {

    var body = {
        PlaneGeometry: [
            'return new ',
            'THREE.PlaneGeometry(param.width, param.height, param.widthSegments, param.heightSegments);'
        ].join('')
    };

    return function (type) {
        var func = body.hasOwnProperty(type) ? new Function('param', body[type]) : function () {};
        return func;
    };

});
