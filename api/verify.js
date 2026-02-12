export default async function handler(req, res) {
  // 处理 GET，方便浏览器调试
  if (req.method === 'GET') {
    return res.json({
      authorized: false,
      reason: '请使用 POST 请求'
    });
  }

  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      authorized: false,
      reason: 'Method not allowed'
    });
  }

  try {
    // 1. 先检查请求体是否存在
    if (!req.body) {
      return res.json({
        authorized: false,
        reason: '请求体为空'
      });
    }

    // 2. 尝试解析 JSON，捕获解析错误
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return res.json({
        authorized: false,
        reason: 'JSON 解析失败: ' + parseError.message
      });
    }

    const { userId, username, sign } = body;

    // 3. 检查必要字段
    if (!userId || !username || !sign) {
      return res.json({
        authorized: false,
        reason: `缺少参数: userId=${userId}, username=${username}, sign=${sign}`
      });
    }

    // 4. 验证签名
    const SECRET = "eyeskeyforcheck";
    const expectedSign = (userId.toString() + SECRET).substring(0, 32);
    if (sign !== expectedSign) {
      return res.json({
        authorized: false,
        reason: `签名不匹配: 期望 "${expectedSign}", 收到 "${sign}"`
      });
    }

    // 5. 验证白名单
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
      return res.json({
        authorized: false,
        reason: `用户 "${username}" 不在白名单中`
      });
    }

    // 全部通过
    return res.json({
      authorized: true,
      level: "VIP",
      reason: `欢迎回来, ${username}!`
    });

  } catch (error) {
    return res.json({
      authorized: false,
      reason: "服务器内部错误: " + error.message
    });
  }
}
