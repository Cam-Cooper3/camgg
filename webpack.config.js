const path = require('path');

module.exports = {
  entry: './public/script.js',  // The main frontend file
  output: {
    filename: 'bundle.js',  // The bundled output file
    path: path.resolve(__dirname, 'public')
  },
  mode: 'development'
};
