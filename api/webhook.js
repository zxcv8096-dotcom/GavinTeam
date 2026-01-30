// 檔案路徑：api/webhook.js
export default async function handler(req, res) {
  // 這是我們自己設定的通關密語 (稍後在 Meta 後台要填一模一樣的)
  const VERIFY_TOKEN = "gavinteam_secret_token_2026"; 

  // ============================================================
  // 處理 Meta 的「握手驗證」 (第一次綁定時會用到)
  // ============================================================
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        // 回傳 challenge 碼給 Meta，代表我們活著
        return res.status(200).send(challenge);
      } else {
        return res.status(403).json({ error: '密碼錯誤' });
      }
    }
  }

  // ============================================================
  // 處理「收到通知」 (之後有人留言會跑這裡)
  // ============================================================
  if (req.method === 'POST') {
    console.log("收到 Meta 通知:", req.body);
    return res.status(200).send('EVENT_RECEIVED');
  }

  return res.status(405).send({ error: 'Method Not Allowed' });
}
