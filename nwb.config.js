module.exports = {
    type: 'react-component',
    webpack: {
        html: {
            template: 'demo/src/index.html'
        }
    },
    build: {
        externals: {
            'react': 'React'
        },
        global: 'Tootti',
        jsNext: false,
        umd: true
    },
    babel: {
        stage: 0,
    }
}
