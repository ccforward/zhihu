module.exports = {
    auth: '',
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
    log: {
        isOpenningHTTP: true,
        isOpenningNode: true,
        openBae: false
    },
    mail: {
        user: '**@gmail.com',
        pass: ''
    },
    spider: {
        fire: false,
        openTask: false,
        start: '20151231',
        end: '20151001',
        interval: 10
    }
}