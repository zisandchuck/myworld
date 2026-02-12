export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ authorized: false, reason: 'Method not allowed' })
  }

  try {
    const { userId, username, signature, timestamp, nonce } = req.body

    // 1. 时间戳校验
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - timestamp) > 300) {
      return res.json({ authorized: false, reason: "请求已过期" })
    }

    // 2. 防重放
    if (globalThis._usedNonces === undefined) {
      globalThis._usedNonces = new Set()
    }
    if (globalThis._usedNonces.has(nonce)) {
      return res.json({ authorized: false, reason: "请求已被使用" })
    }
    globalThis._usedNonces.add(nonce)
    setTimeout(() => globalThis._usedNonces.delete(nonce), 300000)

    // 3. 白名单
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

    const SECRET = "eyeskeyforcheck"

    // 4. 签名校验
    const correctSig = `${userId}${timestamp}${nonce}${SECRET}`.slice(0, 32)
    if (signature !== correctSig) {
      return res.json({ authorized: false, reason: "校验失败" })
    }

    // 5. 去 Roblox 验证 userId 和 username 是否匹配
    const rblxResponse = await fetch(`https://users.roblox.com/v1/users/${userId}`)
    if (!rblxResponse.ok) {
      return res.json({ authorized: false, reason: "无法验证身份" })
    }
    const rblxData = await rblxResponse.json()
    const verifiedUsername = rblxData.name

    // 6. 验证白名单（用后端拿到的真实用户名）
    const allowed = WHITELIST.includes(verifiedUsername)

    return res.json({
      authorized: allowed,
      level: allowed ? "vip" : "none",
      reason: allowed ? "ok" : "不在白名单"
    })

  } catch (e) {
    return res.json({ authorized: false, reason: "服务器错误: " + e.message })
  }
}

