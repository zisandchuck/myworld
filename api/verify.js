// 适配Roblox官方HttpService:PostAsync请求，仅校验签名+白名单
export default async function handler(req, res) {
  // 仅允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      authorized: false, 
      reason: '仅支持POST请求' 
    });
  }

  try {
    // 核心配置（和Lua客户端完全一致，不要改）
    const SECRET = "eyeskeyforcheck";
    // 你的白名单（保留所有需要授权的用户名，确保你的账号在列）
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
      "zis96967"
    ];

    // 获取客户端传的参数（userId/用户名/签名）
    const { userId, username, sign } = req.body;
    // 校验参数是否完整
    if (!userId || !username || !sign) {
      return res.json({
        authorized: false,
        reason: "请求参数不完整"
      });
    }

    // 生成服务端正确签名，和Lua客户端规则完全一致
    const correctSign = `${userId}${SECRET}`.slice(0, 32);
    // 校验签名（防伪造请求，核心）
    if (sign !== correctSign) {
      return res.json({
        authorized: false,
        reason: "签名错误，拒绝访问"
      });
    }

    // 白名单校验（用户名在列表里即通过）
    const isAllowed = WHITELIST.includes(username);
    return res.json({
      authorized: isAllowed,
      level: isAllowed ? "vip" : "none",
      reason: isAllowed ? "验证通过" : `用户名${username}不在白名单`
    });

  } catch (error) {
    // 捕获所有异常，避免服务器500错误
    return res.json({
      authorized: false,
      reason: "服务器内部错误：" + error.message
    });
  }
}

