const HtmlWebpackPlugin = require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'development',

    entry: {
        main: './src/index.js'
    },

    output: {
        filename: 'main.js',
    },

    watchOptions: {
        ignored: '/node_modules/',
    },

    plugins: [
        new HtmlWebpackPlugin({
            // template: "src/server/html/template.html"
        })
    ],

    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: [
                    {
                        loader: "style-loader",
                        options: { injectType: "singletonStyleTag" },
                    },
                    'css-loader'
                ],
            },
            {
                test: /\.(png|jpe?g|gif|glb|gltf|fbx|tga|ogg|mp3|wav|ttf)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                }
            }
        ],
    },
};