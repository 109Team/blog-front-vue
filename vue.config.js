module.exports = {
    devServer: {
            proxy: {
                '/v1': {
                    target: '127.0.0.1:3000/v1'
                },
            }
        }
}