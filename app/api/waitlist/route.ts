export const runtime = 'edge'

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  return Response.json({
    message: 'Thanks — you have been added to the waitlist preview list.',
  })
}
