
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  try {
    const { name, phone, address, plan, note } = req.body || {};

    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin bắt buộc"
      });
    }

    const response = await fetch(process.env.APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: process.env.LEAD_SECRET,
        name,
        phone,
        address,
        plan,
        note
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Không thể lưu thông tin khách hàng");
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Gửi yêu cầu thất bại"
    });
  }
}
