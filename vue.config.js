const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const resolve = (dir) => {
  return path.join(__dirname, dir)
}

let devServer = {
  hot: true,
  port: 80,
  open: true,
  noInfo: false,
  overlay: {
    warnings: true,
    errors: true
  }
}

module.exports = {
  assetsDir: 'static',
  outputDir: 'dist',
  lintOnSave: true,
  devServer: devServer,
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@': resolve('src')
        }
      },
      optimization:
        process.env.NODE_ENV === 'production'
          ? {
              minimize: true,
              minimizer: [
                new TerserPlugin({
                  terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                      drop_console: true
                    }
                  }
                })
              ]
            }
          : {}
    }
  },
  // chainWebpack(config) {
  //   config.when(process.env.NODE_ENV !== 'development', (config) => {
  //     config.performance.set('hints', false)
  //     config.devtool('none')
  //     config.optimization.splitChunks({
  //       chunks: 'all',
  //       cacheGroups: {
  //         libs: {
  //           name: 'chunk-libs',
  //           test: /[\\/]node_modules[\\/]/,
  //           priority: 10,
  //           chunks: 'initial'
  //         },
  //         elementUI: {
  //           name: 'chunk-elementUI',
  //           priority: 20,
  //           test: /[\\/]node_modules[\\/]_?element-ui(.*)/
  //         },
  //         fortawesome: {
  //           name: 'chunk-fortawesome',
  //           priority: 20,
  //           test: /[\\/]node_modules[\\/]_?@fortawesome(.*)/
  //         },
  //         commons: {
  //           name: 'chunk-commons',
  //           test: resolve('src/components'),
  //           minChunks: 3,
  //           priority: 5,
  //           reuseExistingChunk: true
  //         }
  //       }
  //     })
  //   })
  // },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    extract: false,
    requireModuleExtension: true,
    sourceMap: false,
    loaderOptions: {}
  }
}
