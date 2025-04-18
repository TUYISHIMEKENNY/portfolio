import { removeSubscriber } from "@/lib/email"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return new Response("Subscriber ID is required", { status: 400 })
    }

    const result = await removeSubscriber(id)

    if (!result.success) {
      return new Response("Failed to unsubscribe", { status: 400 })
    }

    // Return a simple HTML page confirming unsubscription
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unsubscribed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; }
          .container { border: 1px solid #e0e0e0; border-radius: 5px; padding: 40px 20px; margin-top: 50px; }
          h1 { color: #4a6cf7; }
          .button { display: inline-block; background-color: #4a6cf7; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Successfully Unsubscribed</h1>
          <p>You have been successfully unsubscribed from Ngoma Benjamin's newsletter.</p>
          <p>We're sorry to see you go. If you change your mind, you can always subscribe again.</p>
          <a href="https://ngomabenjamin.com" class="button">Return to Website</a>
        </div>
      </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  } catch (error) {
    console.error("Error in newsletter unsubscribe API:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
