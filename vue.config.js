module.exports = {
    devServer: {
            proxy: {
                '/v1': {
                    target: '172.22.7.42:3000/v1'
                },
            }
        }
}