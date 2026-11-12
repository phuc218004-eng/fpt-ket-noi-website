
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  try {
    const { name, phone, address, plan, note } = req.body || {};

    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin"
      });
    }

    const scriptUrl = process.env.APPS_SCRIPT_URL;
    const secret = process.env.LEAD_SECRET;

    if (!scriptUrl || !secret) {
      throw new Error("Thiếu cấu hình môi trường Vercel");
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: secret,
        name,
        phone,
        address,
        plan,
        note
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      console.error("Apps Script error:", result);
      throw new Error(
        result.error || result.message || "Google Sheets không nhận được dữ liệu"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Đã lưu thông tin khách hàng"
    });

  } catch (error) {
    console.error("Lead API error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Gửi yêu cầu thất bại"
    });
  }
}
