export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json()

    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': '8f1yF38pHKLAXraeNrpn',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: phone,
        message: message
      })
    })

    const result = await res.text()

    console.log("FONNTE RESULT:", result)

    return Response.json({
      success: true,
      result
    })

  } catch (err) {
    console.error(err)

    return Response.json(
      { success: false, error: String(err) },
      { status: 500 }
    )
  }
}