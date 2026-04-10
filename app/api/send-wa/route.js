export async function POST(req) {
  const body = await req.json()

  const res = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      Authorization: '8f1yF38pHKLAXraeNrpn'
    },
    body: new URLSearchParams({
      target: body.phone,
      message: body.message
    })
  })

  const result = await res.json()
  console.log(result)

  return Response.json({ success: true })
}