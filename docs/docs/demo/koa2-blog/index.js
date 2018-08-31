import koa from 'koa';
import convert from 'koa-convert';
import onerror from 'koa-onerror';
import serve from 'koa-static';
import mongoose from 'mongoose';
import historyApiFallback from './middleware/historyApiFallback';
import config from './configs';
import middleware from './middleware';
import api from './api';
import path from 'path';
import fs from 'fs';
// import { createBundleRenderer } from 'vue-server-renderer';
const resolve = file => path.resolve(__dirname, file);

mongoose.Promise = Promise;
// connect mongodb
mongoose.connect(config.mongodb.url, config.mongodbSecret);
mongoose.connection.on('error', console.error);

const isProd = process.env.NODE_ENV === 'production';
const router = require('koa-router')();
const routerInfo = require('koa-router')();

const app = new koa();

// middleware
app.use(middleware());
onerror(app);

// api/router
app.use(api());

app.use(serve('./client/static'));

// 创建渲染器，开启组件缓存
// let renderer;
//
// function createRenderer(bundle, template) {
//     return createBundleRenderer(bundle, {
//         template,
//         cache: require('lru-cache')({
//             max: 1000,
//             maxAge: 1000 * 60 * 15,
//         }),
//         runInNewContext: false,
//     });
// }

// 提示webpack还在工作

app.use(routerInfo.routes());

app
    .use(router.routes())
    .use(router.allowedMethods());

// create server
app.listen(config.app.port, () => {
    console.log('The server is running at http://localhost:' + config.app.port);
});

export default app;
