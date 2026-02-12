export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      authorized: false,
      reason: '仅支持 POST 请求'
    });
  }

  try {
    // 正确解析 JSON 请求体
    const body = await req.json();
    const { userId, username, sign } = body;

    // 检查必要字段是否存在
    if (!userId || !username || !sign) {
      return res.json({
        authorized: false,
        reason: '缺少必要参数: userId, username, sign 不能为空'
      });
    }

    // 你的密钥（和客户端保持一致）
    const SECRET = "eyeskeyforcheck";
    // 你的白名单（用户名列表，确保你的账号在列）
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
      "zis9494" // 你的用户名 zis9494
    ];

    // 1. 验证签名是否正确
    const expectedSign = (userId.toString() + SECRET).substring(0, 32);
    if (sign !== expectedSign) {
      return res.json({
        authorized: false,
        reason: `签名验证失败: 期望 "${expectedSign}", 收到 "${sign}"`
      });
    }

    // 2. 验证用户名是否在白名单中
    if (!WHITELIST.includes(username)) {
      return res.json({
        authorized: false,
        reason: `用户 "${username}" 不在白名单中`
      });
    }

    // 所有验证通过，返回成功
    return res.json({
      authorized: true,
      level: "VIP",
      reason: `欢迎回来, ${username}!`
    });

  } catch (error) {
    // 捕获所有异常，返回详细错误信息
    console.error("服务器错误详情:", error);
    return res.json({
      authorized: false,
      reason: "服务器错误: " + error.message
    });
  }
}

