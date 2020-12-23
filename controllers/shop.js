const Product = require('../models/product');
const Category = require('../models/category');

exports.getIndex = (req, res) => {

    Product.findAll()
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/index', {
                        title: 'Shopping',
                        products: products,
                        categories: categories,
                        path: '/'
                    });
                })
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getProducts = (req, res) => {

    Product.findAll()
        .then(products => {
            Category.findAll()
                .then(categories => {
                    res.render('shop/products', {
                        title: 'Products',
                        products: products,
                        categories: categories,
                        path: '/'
                    });
                })
        })
        .catch((err) => {
            console.log(err);
        });
}

exports.getProductsByCategoryId = (req, res) => {
    const categoryid = req.params.categoryid;
    const model = [];

    Category.findAll()
        .then(categories => {
            model.categories = categories;
            return Product.findByCategoryId(categoryid);
        })
        .then(products => {
            res.render('shop/products', {
                title: 'Products',
                products: products,
                categories: model.categories,
                selectedCategory: categoryid,
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        })
}

exports.getProduct = (req, res) => {

    Product.findById(req.params.productid)
        .then(product => {
            res.render('shop/product-detail', {
                title: product.name,
                product: product,
                path: '/products'
            });
        })
        .catch((err) => {
            console.log(err);
        });
}


exports.getCart = (req, res) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                title: 'Cart',
                path: '/cart',
                products: products
            });
        }).catch(err => {
            console.log(err);
        });
}

exports.postCart = (req, res) => {

    const productId = req.body.productId;

    Product.findById(productId)
        .then((product) => {
            return req.user.addToCart(product)
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch((err) => {
            console.log(err);
        })


    // let quantity = 1;
    // let userCart;

    // req.user
    //     .getCart()
    //     .then(cart => {
    //         userCart = cart;
    //         return cart.getProducts({
    //             where: {
    //                 id: productId
    //             }
    //         });

    //     })
    //     .then(products => {
    //         let product;

    //         if (products.length > 0) {
    //             product = products[0];
    //         }

    //         if (product) {
    //             quantity += product.cartItem.quantity;
    //             return product;
    //         }
    //         return Product.findByPk(productId);

    //     })
    //     .then(product => {
    //         userCart.addProduct(product, {
    //             through: {
    //                 quantity: quantity
    //             }
    //         })
    //     })
    //     .then(() => {
    //         res.redirect('/cart');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
}

exports.postCartItemDelete = (req, res) => {
    const productid = req.body.productid;

    req.user
        .deleteCartItem(productid)
        .then(() => {
            res.redirect('/cart');
        });
}

exports.getOrders = (req, res) => {

    req.user
        .getOrders()
        .then(orders => {
            res.render('shop/orders', {
                title: 'Orders',
                path: '/orders',
                orders: orders
            })
        })
        .catch(err => console.log(err))


}

exports.postOrder = (req, res) => {
    req.user
        .addOrder()
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(err));
}