// 這是 GavinTeam 的自動回覆機器人核心 (Vercel Serverless Function)
export default async function handler(req, res) {
  // 1. 設定 Meta (FB/IG) 的驗證權杖 (您自己設定的密碼)
  const VERIFY_TOKEN = "gavinteam_secret_token_2026"; 

  // ============================================================
  // A. 處理 Meta 的「握手驗證」 (第一次綁定時會用到)
  // ============================================================
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        return res.status(200).send(challenge);
      } else {
        return res.status(403).json({ error: '驗證失敗，Token 不對' });
      }
    }
  }

  // ============================================================
  // B. 處理「收到留言」的自動化邏輯 (有人留言時會觸發)
  // ============================================================
  if (req.method === 'POST') {
    const body = req.body;

    // 確認是來自 FB/IG 的事件
    if (body.object === 'page' || body.object === 'instagram') {
      
      // 遍歷每一個通知
      for (const entry of body.entry) {
        const webhook_event = entry.messaging ? entry.messaging[0] : null;
        
        // 這裡就是您要寫「邏輯」的地方
        // 例如：判斷留言內容是否包含 "+1"
        console.log("收到事件:", webhook_event);

        // TODO: 這裡要呼叫 Graph API 去發送私訊
        // 因為這需要您的「粉絲頁存取權杖 (Page Access Token)」，我們下一步設定
      }

      return res.status(200).send('EVENT_RECEIVED');
    } else {
      return res.status(404).send();
    }
  }

  // 其他狀況
  return res.status(405).json({ error: 'Method Not Allowed' });
}
