const path = require('path');

module.exports = {
    entry: './public/script.js',  // Your main frontend file
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    mode: 'development',
    watch: true
};
