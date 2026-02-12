export default async function handler(req, res) {
  return res.json({
    authorized: true,
    level: "vip",
    reason: "ok (调试模式，无条件放行)"
  })
}
