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

    // 2. Roblox API 校验：确保 userId 和用户名真实匹配（防伪造账号）
    let verifiedUsername
    try {
      const rblxResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`)
      if (!rblxResponse.ok) throw new Error("Roblox API 访问失败")
      const rblxData = await rblxResponse.json()
      verifiedUsername = rblxData.name // 取 Roblox 官方返回的用户名
    } catch (apiErr) {
      return res.json({ authorized: false, reason: "Roblox 身份验证失败: " + apiErr.message })
    }

    // 3. 白名单校验：用官方用户名匹配（避免客户端传假用户名）
    const allowed = WHITELIST.includes(verifiedUsername)

    return res.json({
      authorized: allowed,
      level: allowed ? "vip" : "none",
      reason: allowed ? "ok" : "不在白名单（官方用户名：" + verifiedUsername + "）"
    })

  } catch (e) {
    return res.json({ authorized: false, reason: "服务器错误: " + e.message })
  }
}

