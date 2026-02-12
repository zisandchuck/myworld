export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ authorized: false, reason: 'Method not allowed' })
  }

  try {
    const { userId, username, sign } = req.body
    const SECRET = "eyeskeyforcheck" // 和客户端一致的固定密钥（防伪造核心）
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
    ]

    // 1. 轻量防伪造：校验签名（仅用 userId+密钥，避免复杂参数）
    const correctSign = `${userId}${SECRET}`.slice(0, 32)
    if (sign !== correctSign) {
      return res.json({ authorized: false, reason: "签名错误（防伪造校验）" })
    }

    // 2. 直接使用客户端传来的用户名进行白名单校验（绕过Roblox API）
    const allowed = WHITELIST.includes(username)

    return res.json({
      authorized: allowed,
      level: allowed ? "vip" : "none",
      reason: allowed ? "ok" : "不在白名单（客户端用户名：" + username + "）"
    })

  } catch (e) {
    return res.json({ authorized: false, reason: "服务器错误: " + e.message })
  }
}

