const path = require('path');

module.exports = {
    entry: './public/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../public')  // Update to reflect new directory structure
    },
    mode: 'development',
    watch: true  // Enable automatic re-bundling on file changes
};
