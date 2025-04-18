import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Define web development categories
const webDevCategories = [
  "frontend",
  "backend",
  "fullstack",
  "javascript",
  "react",
  "nextjs",
  "nodejs",
  "database",
  "performance",
  "security",
  "css",
  "html",
  "api",
  "testing",
  "devops",
]

// Define web development topics for inspiration
const webDevTopics = [
  "Modern JavaScript Features",
  "React Hooks Deep Dive",
  "Next.js App Router",
  "CSS Grid and Flexbox",
  "TypeScript Best Practices",
  "Node.js Performance Optimization",
  "RESTful API Design",
  "GraphQL vs REST",
  "Database Optimization Techniques",
  "Authentication Strategies",
  "Web Security Best Practices",
  "Responsive Design Patterns",
  "State Management in React",
  "Server Components in Next.js",
  "Serverless Functions",
  "Testing React Applications",
  "CI/CD Pipelines",
  "Web Accessibility (a11y)",
  "Progressive Web Apps (PWAs)",
  "Microservices Architecture",
  "Docker for Web Developers",
  "WebSockets and Real-time Applications",
  "Web Performance Metrics",
  "SEO for Developers",
  "Headless CMS Integration",
]

// Function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Function to generate a blog post using Gemini AI
export async function generateBlogPost(timeOfDay: "morning" | "evening") {
  try {
    // Select a random category and topic
    const category = getRandomItem(webDevCategories)
    const topicSuggestion = getRandomItem(webDevTopics)

    // Create a prompt for the AI
    const prompt = `
      You are a professional web developer writing an educational blog post about ${category} development.
      
      Write a comprehensive, informative blog post about a topic related to ${topicSuggestion} or something similar in the ${category} category.
      
      The blog post should:
      1. Have a catchy, specific title (not generic)
      2. Be well-structured with clear headings
      3. Include code examples where appropriate (using markdown code blocks)
      4. Explain concepts clearly for intermediate developers
      5. Provide practical tips and best practices
      6. Be around 800-1200 words
      
      Format the entire post in Markdown.
      
      Also provide:
      - A brief excerpt (2-3 sentences) summarizing the post
      - 5 relevant tags for the post
      - The main topic of the post in a single word or short phrase (for image search)
      
      Format your response as a JSON object with the following structure:
      {
        "title": "The blog post title",
        "content": "The full blog post content in Markdown",
        "excerpt": "A brief summary of the post",
        "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "topic": "Main topic for image search",
        "category": "${category}"
      }
    `

    // Generate content using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from the response, handling potential markdown code blocks
    let jsonText = text

    // Check if the response is wrapped in markdown code blocks
    if (text.includes("```json") || text.includes("```")) {
      // Extract content between code blocks
      const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (codeBlockMatch && codeBlockMatch[1]) {
        jsonText = codeBlockMatch[1].trim()
      }
    }

    // Additional cleanup to handle potential issues
    jsonText = jsonText
      .replace(/^```json/gm, "")
      .replace(/```$/gm, "")
      .trim()

    // Parse the cleaned JSON
    let blogData
    try {
      blogData = JSON.parse(jsonText)
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      console.log("Raw response:", text)
      console.log("Cleaned response:", jsonText)

      // Return fallback content with error details
      return {
        title: `${timeOfDay === "morning" ? "Morning" : "Evening"} Web Development Tips`,
        content: `# JSON Parsing Error in AI Response

## Content Generation Issue

We encountered an error while parsing the AI-generated content. The AI response was not in the expected JSON format.

### Error Details:
\`\`\`
${parseError.message}
\`\`\`

### Raw AI Response:
\`\`\`
${text.substring(0, 500)}${text.length > 500 ? "..." : ""}
\`\`\`

Please try again later or contact the administrator with this error information.`,
        excerpt: "An error occurred while generating blog content.",
        tags: ["webdev", "error", "configuration"],
        topic: "Error Handling",
        category: "troubleshooting",
      }
    }

    // Ensure all required fields are present
    return {
      title: blogData.title || `${timeOfDay === "morning" ? "Morning" : "Evening"} Web Development Tips`,
      content: blogData.content || "Content generation failed. Please try again.",
      excerpt: blogData.excerpt || "An educational blog post about web development.",
      tags: blogData.tags || ["webdev", "programming", "tutorial", category],
      topic: blogData.topic || topicSuggestion,
      category: blogData.category || category,
    }
  } catch (error) {
    console.error("Error generating blog post with Gemini AI:", error)

    // Check if the API key is missing or invalid
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
      console.error("Missing or empty Gemini API key")

      // Return more informative fallback content
      return {
        title: `${timeOfDay === "morning" ? "Morning" : "Evening"} Web Development Tips`,
        content: `# API Configuration Required

## Gemini AI Integration Issue

The automated blog post generation system requires a valid Gemini API key to function properly. 

### Troubleshooting Steps:

1. Ensure you have added your Gemini API key to the environment variables
2. Verify the API key is correct and has not expired
3. Check the server logs for specific error messages
4. Ensure you have sufficient quota/credits in your Gemini AI account

Once configured correctly, the system will automatically generate informative web development content.`,
        excerpt: "Configuration required for automated blog post generation.",
        tags: ["webdev", "programming", "tutorial", "configuration"],
        topic: "API Configuration",
        category: "configuration",
      }
    }

    // For other errors, return a more detailed fallback
    return {
      title: `${timeOfDay === "morning" ? "Morning" : "Evening"} Web Development Tips`,
      content: `# Web Development Tips

## Content Generation Error

We encountered an error while generating this blog post content. Our system uses Gemini AI to create informative articles about web development topics.

### Possible Causes:

- Temporary API service disruption
- Rate limiting or quota issues
- Network connectivity problems
- Content filtering or moderation flags

Please try again later or check the server logs for more detailed error information.

Error details: ${error.message || "Unknown error"}`,
      excerpt: "An educational blog post about web development.",
      tags: ["webdev", "programming", "tutorial"],
      topic: "Web Development",
      category: getRandomItem(webDevCategories),
    }
  }
}
