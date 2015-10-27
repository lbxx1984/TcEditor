var reactTools = require('react-tools');

function ReactPressor( options ) {
    AbstractProcessor.call( this, options );
}

ReactPressor.prototype = new AbstractProcessor();

ReactPressor.prototype.name = 'ReactPressor';

ReactPressor.prototype.process = function (file, processContext, callback) {
    file.setData(reactTools.transform(file.data));
    callback();
};

module.exports = ReactPressor;