module.exports = {
    'auth':'Bearer aJv94tghSBKRW1TEFvvrwQ',
    mongo: {
        name: 'zhihu',
        host: '127.0.0.1',
        port: 27017,
        username: 'cc',
        password: '12345',
        url: function() {
            return ['mongodb://',
                this.username, ':',
                this.password, '@',
                this.host, ':', this.port, '/', this.name].join('');
        }
    },
    mongoOptions: {
        server: {
            poolSize: 1,
            socketOptions: {
                auto_reconnect: true
            }
        }
    },
    spider: {
        errHistory: 1,
        errArticle: 2,
        errComments: 3
    }
}