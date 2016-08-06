const path = require('path');
console.log('********', __dirname);
console.log('********', path.resolve(__dirname, '../'));

module.exports = {
    module: {
        loaders: [
            {
                test: /\.css?$/,
                loaders: [ 'style', 'raw' ],
                include: path.resolve(__dirname, '../'),
            }
        ]
    }
}