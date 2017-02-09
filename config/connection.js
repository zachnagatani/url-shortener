const user = require('./user');

module.exports = {
    getDbConnectionString: () => {
        return 'mongodb://' + user.user + ':' + user.password + '@ds147599.mlab.com:47599/url-shortener';
    }
};