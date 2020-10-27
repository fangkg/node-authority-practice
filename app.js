const Koa = require('koa');
const app = new Koa();
const session = require('koa-session');

// 密钥
app.keys = ['some key'];

// 引入redis存储
const redisStore = require('koa-redis');
const redis = require('redis');
const redisClient = redis.createClient(6379, 'localhost');
const wrapper = require('co-redis');
const client = wrapper(redisClient);

const SESS_CONFIG = {
    key: 'sess',
    maxAge: 86400000,
    httpOnly: true,
    signed: false,
    // 存储
    store: redisStore({client})
};

// 使用中间件
app.use(session(SESS_CONFIG, app));
// 观察session
app.use(async (ctx, next) => {
    const  keys = await client.keys('*');
    keys.forEach(async key => {
        console.log(await client.get(key));
    })
    await next();
})

// 测试
app.use(ctx => {
    if (ctx.path === '/favicon.ico') {
        return
    } else {
        // 获取
        let n = ctx.session.count || 0;

        // 设置
        ctx.session.count = ++n;
        ctx.body = `第${n}次访问！`;
    }
})

app.listen(3000);
