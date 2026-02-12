export default async function handler(req, res) {
  // 不做任何验证，直接返回成功
  return res.json({
    authorized: true,
    level: "TEST",
    reason: "后端测试成功"
  });
}
