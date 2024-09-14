'use strict';

const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const blogRouter = require("./blog");
const brand = require("./brand");
const coupon = require("./coupon");
const order = require("./order");
const insert = require("./insert");

const statisticRouter = require("./statistic");
const brandCategoryRouter = require("./brand")
const cart = require("./cart")
const payment = require("./payment")
const chat = require("./chat")
const message = require("./message")

const { notFound, errHandler } = require("../middlewares/errHander");

const routes = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);

    app.use('/api/statistic', statisticRouter);

    app.use('/api/blogCategory', blogCategoryRouter);
    app.use('/api/prodCategory', productCategoryRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/brand', brand);
    app.use('/api/coupon', coupon);
    app.use('/api/order', order);
    app.use('/api/insert', insert);
    app.use('/api/brandCategory', brandCategoryRouter)

    app.use('/api/cart', cart)
    app.use('/api/payment', payment)
    app.use('/api/chats', chat)
    app.use('/api/message', message)

    app.use(notFound);
    app.use(errHandler);

}
module.exports = routes;