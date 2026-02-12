// 测试模式：所有请求都直接通过
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      authorized: false, 
      reason: '仅支持POST请求' 
    });
  }

  try {
    // 直接返回通过，不做任何校验
    return res.json({
      authorized: true,
      level: "test_vip",
      reason: "测试模式，所有请求都通过"
    });

  } catch (error) {
    return res.json({
      authorized: false,
      reason: "服务器内部错误：" + error.message
    });
  }
}

