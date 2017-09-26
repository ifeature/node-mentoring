'use strict';

class Product {
    static moduleName = 'Product module';

    constructor() {
        console.log(Product.moduleName);
    }
}

module.exports = Product;
