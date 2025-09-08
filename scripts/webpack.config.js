const path = require('path');

module.exports = {
    entry: './3DWebGL.ts',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts'],
    },
    output: {
        filename: '3DWebGL.js',
        path: path.resolve(__dirname, 'dist'),
    },
};