const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = {
    devtool: 'inline-source-maps',
    entry: [
        './src/index.js'
    ],
    module: {
        rules: [
            {
                test: /.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ 'env', 'stage-2' ]
                    }
                }
            },
            {
                test: /.html?$/,
                loader: 'html-loader'
            }
        ]
    },
    resolve: {
        extensions: [ ".js", ".html", ".css" ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
};
