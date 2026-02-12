export const config = {
  runtime: 'edge', // 明确指定 Edge Runtime
};

export default async function handler(request) {
  // 处理 GET，方便浏览器调试
  if (request.method === 'GET') {
    return new Response(JSON.stringify({
      authorized: false,
      reason: '请使用 POST 请求'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 只允许 POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({
      authorized: false,
      reason: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // 1. 解析 JSON 请求体
    const body = await request.json();
    const { userId, username, sign } = body;

    // 2. 检查必要字段
    if (!userId || !username || !sign) {
      return new Response(JSON.stringify({
        authorized: false,
        reason: `缺少参数: userId=${userId}, username=${username}, sign=${sign}`
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // 3. 验证签名
    const SECRET = "eyeskeyforcheck";
    const expectedSign = (userId.toString() + SECRET).substring(0, 32);
    if (sign !== expectedSign) {
      return new Response(JSON.stringify({
        authorized: false,
        reason: `签名不匹配: 期望 "${expectedSign}", 收到 "${sign}"`
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // 4. 验证白名单
    const WHITELIST = [
      "zis96961",
      "zis9694",
      "sjwuxnshi",
      "lamluoyi",
      "114514robloxt",
      "nnmm12511",
      "gxv_gxg",
      "laobider123456",
      "cTc_acQ",
      "cTcacQ",
      "vvvvssss88",
      "hdhdjd87648",
      "zis96967",
      "zis9494" // 你的账号
    ];

    if (!WHITELIST.includes(username)) {
      return new Response(JSON.stringify({
        authorized: false,
        reason: `用户 "${username}" 不在白名单中`
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // 全部通过
    return new Response(JSON.stringify({
      authorized: true,
      level: "VIP",
      reason: `欢迎回来, ${username}!`
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      authorized: false,
      reason: "服务器内部错误: " + error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

