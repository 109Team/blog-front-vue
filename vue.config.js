
const configfiles = {
    development: {
        configs: ['/config/config.dev.js']
    },
    production: {
        configs: ['/config/config.prod.js']
    }
}
module.exports = {

    // pwa 配置
    pwa: {
        workboxOptions: {
            exclude: [
                /\.map$/,
                /img\/icons\//,
                /favicon\.ico$/,
                /manifest\.json$/,
                /config\//
            ]
        }
    },

    // 插件配置
    chainWebpack: config => {

        config.plugins.delete('prefetch')

        config.plugin('html').tap(args => {
            args[0]['configs'] = configfiles[process.env.NODE_ENV]['configs'];
            return args;
        })

    },

    // 开发服务配置
    devServer: {
        proxy: {
            '/v1': {
                target: '127.0.0.1:3000/v1'
            },
        }
    }
}