export default async function handler(req, res) {
  // 只允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ authorized: false, reason: 'Method not allowed' })
  }

  try {
    const { userId, username, signature } = req.body

    // 你的白名单（UserId）
    const WHITELIST = [
    "zis96961",
    "zis9494", 
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

    // 密钥（自己改一个复杂点的）
    const SECRET = "eyeskeyforcheck"

    // 简单防篡改校验
    const correctSig = `${userId}${SECRET}`.slice(0, 32)
    if (signature !== correctSig) {
      return res.json({ authorized: false, reason: "校验失败" })
    }

    // 验证白名单
    const allowed = WHITELIST.includes(Number(userId))

    return res.json({
      authorized: allowed,
      level: allowed ? "vip" : "none",
      reason: allowed ? "ok" : "不在白名单"
    })

  } catch (e) {
    return res.json({ authorized: false, reason: "服务器错误" })
  }
}

