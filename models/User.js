'use strict';

class User {
    static moduleName = 'User module';

    constructor() {
        console.log(User.moduleName);
    }
}

module.exports = User;
