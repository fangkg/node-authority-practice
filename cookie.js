const http = require('http');
const session = {};
http.createServer((req, res) => {
    if (req.url === '/favicon.ico') {
        res.end('');
        return
    }

    // 观察
    console.log('cookie:', req.headers.cookie);
    // 设置cookie
    // res.setHeader('Set-Cookie', 'cookie1=abc');
    // res.end('Hello Cookie');

    const sessionKey = 'sid';
    const cookie = req.headers.cookie;
    if (cookie && cookie.indexOf(sessionKey) > -1) {
        // 登陆过
        res.end('Come back');
        const pattern = new RegExp(`${sessionKey}=([^;]+);?\s*`);
        const sid = pattern.exec(cookie)[1];
        console.log('session:', sid, session[sid]);
    } else {
        // 首次登录 产生一个整数
        const sid = (Math.random() * 9999).toFixed();
        // 设置sid
        res.setHeader('Set-Cookie', `${sessionKey}=${sid}`);
        session[sid] = {
            name: 'laowang'
        }
        res.end('Hello');
    }
}).listen(3000);

// cookie容易被篡改 容量限制