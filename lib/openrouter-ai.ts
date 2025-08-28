interface BlogPostData {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  topic: string;
  category: string;
}

// Define the comprehensive blog categories from the requirements
const BLOG_CATEGORIES = {
  "Web Development": {
    topics: [
      "Frontend Development (React, Vue, Angular, Next.js, Tailwind, UI/UX, performance optimization)",
      "Backend Development (Node.js, Django, Laravel, APIs, databases, GraphQL)",
      "Full-Stack Development (end-to-end guides, MERN, MEAN, JAMstack)",
      "Web Security & Attacks (OWASP Top 10, SQL injection, XSS, CSRF, authentication, HTTPS, zero-trust, encryption)",
      "Testing & Debugging (unit tests, integration tests, Cypress, Jest, QA practices)",
      "Web Performance Optimization (caching, CDNs, image optimization, lazy loading, Core Web Vitals)",
      "Emerging Web Tech (WebAssembly, Progressive Web Apps, AI in web apps, Web3/Blockchain apps)",
    ],
  },
  "Mobile App Development": {
    topics: [
      "iOS Development (Swift, SwiftUI, UIKit, Xcode best practices)",
      "Android Development (Kotlin, Jetpack Compose, Android Studio)",
      "Cross-Platform Frameworks (Flutter, React Native, Xamarin, Ionic)",
      "Mobile UI/UX Design (Material Design, Human Interface Guidelines, accessibility)",
      "App Performance & Optimization (memory usage, battery efficiency, offline-first)",
      "Mobile Security (encryption, secure APIs, authentication, biometrics, app signing)",
      "App Store Deployment (Google Play, App Store, ASO – App Store Optimization, app monetization)",
      "Future of Mobile (AR/VR apps, AI-driven apps, IoT integration, super apps)",
    ],
  },
  "Professional Deployment & DevOps": {
    topics: [
      "DevOps Fundamentals (CI/CD, GitHub Actions, GitLab CI, Jenkins, automation)",
      "Cloud Deployment (AWS, Azure, GCP, serverless, Kubernetes, Docker, microservices)",
      "Infrastructure as Code (Terraform, Ansible, Pulumi)",
      "Monitoring & Logging (Prometheus, Grafana, ELK stack, error tracking with Sentry)",
      "App Scaling & Performance (load balancing, caching layers, distributed systems)",
      "Security in Deployment (DevSecOps, secrets management, DDoS protection, SSL/TLS, compliance)",
      "Cost Optimization (cloud billing strategies, serverless savings, autoscaling)",
      "Deployment Case Studies (real-world setups for web apps, mobile apps, SaaS products)",
    ],
  },
  "Software Engineering & Best Practices": {
    topics: [
      "Software Architecture (MVC, MVVM, microservices, event-driven, hexagonal)",
      "Design Patterns (Singleton, Observer, Factory, Strategy)",
      "Agile & Project Management (Scrum, Kanban, CI/CD workflows, team collaboration)",
      "Code Quality & Maintainability (clean code, refactoring, technical debt)",
      "Testing Strategies (TDD, BDD, automated testing pipelines)",
      "Version Control (Git workflows, branching strategies, GitHub/GitLab best practices)",
      "Career Growth (developer roadmap, interview prep, freelancing, consulting, personal branding)",
    ],
  },
  "Tech Trends & Industry Insights": {
    topics: [
      "Artificial Intelligence in Apps (chatbots, GPT integration, recommendation engines)",
      "Blockchain & Web3 Development (dApps, smart contracts, crypto payments)",
      "Edge & Serverless Computing (Cloudflare Workers, AWS Lambda, Vercel Edge)",
      "Emerging Frameworks & Tools (new JS frameworks, AI-powered IDEs, low-code/no-code tools)",
      "Industry News & Case Studies (major releases, best practices from top companies, case analysis)",
    ],
  },
  "Security & Compliance": {
    topics: [
      "Web App Security (OWASP, HTTPS, CORS, JWT, OAuth2, API security)",
      "Mobile Security (obfuscation, reverse engineering protection, secure storage)",
      "DevOps Security (DevSecOps) (secrets management, IAM, intrusion detection)",
      "Compliance & Regulations (GDPR, HIPAA, PCI-DSS, SOC2)",
      "Penetration Testing & Tools (Burp Suite, Metasploit, ethical hacking basics)",
    ],
  },
};

// Content types for variety
const CONTENT_TYPES = [
  "Tutorial",
  "Tips and Tricks",
  "Getting Started Guide",
  "Best Practices",
  "Deep Dive",
  "Case Study",
];

// Function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to generate SEO-optimized title
function generateSEOTitle(
  contentType: string,
  topic: string,
  category: string
): string {
  const year = new Date().getFullYear();
  const titleTemplates = [
    `${contentType}: ${topic} in ${year}`,
    `Complete ${contentType} for ${topic}`,
    `${topic} ${contentType} - ${category} Guide`,
    `Master ${topic}: ${contentType} for Developers`,
    `${topic} Explained: ${contentType} with Examples`,
    `${year} ${contentType}: ${topic} Best Practices`,
  ];

  return getRandomItem(titleTemplates);
}

// Function to generate a blog post using OpenRouter AI
export async function generateBlogPost(
  timeOfDay: "morning" | "evening"
): Promise<BlogPostData> {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    // Select random category and topic
    const categoryNames = Object.keys(BLOG_CATEGORIES);
    const selectedCategory = getRandomItem(categoryNames);
    const categoryData =
      BLOG_CATEGORIES[selectedCategory as keyof typeof BLOG_CATEGORIES];
    const selectedTopic = getRandomItem(categoryData.topics);
    const contentType = getRandomItem(CONTENT_TYPES);

    // Extract main topic from the detailed topic string
    const mainTopic = selectedTopic.split("(")[0].trim();

    // Generate SEO-optimized title
    const seoTitle = generateSEOTitle(contentType, mainTopic, selectedCategory);

    // Create comprehensive prompt for high-quality content
    const prompt = `You are an expert technical writer and ${selectedCategory.toLowerCase()} specialist. Write a comprehensive, high-quality ${contentType.toLowerCase()} about "${selectedTopic}".

REQUIREMENTS:
1. **Content Type**: ${contentType}
2. **Category**: ${selectedCategory}
3. **Target Audience**: Intermediate to advanced developers
4. **Length**: 1200-1800 words
5. **Format**: Markdown with proper headings, code blocks, and structure

STRUCTURE YOUR ARTICLE:
1. **Engaging Introduction** (2-3 paragraphs)
   - Hook the reader with a compelling opening
   - Explain why this topic matters
   - Preview what they'll learn

2. **Main Content** (Well-organized sections with H2/H3 headings)
   - Detailed explanations with examples
   - Code snippets where relevant (use proper syntax highlighting)
   - Best practices and common pitfalls
   - Real-world applications

3. **Practical Examples** 
   - Include working code examples
   - Step-by-step implementations
   - Before/after comparisons where applicable

4. **Advanced Tips** (For experienced developers)
   - Performance considerations
   - Security implications
   - Scalability factors

5. **Conclusion** 
   - Summarize key takeaways
   - Next steps for readers
   - Additional resources

WRITING STYLE:
- Clear, authoritative, and educational
- Use technical terms appropriately with explanations
- Include actionable advice
- Make it engaging and easy to follow
- Add personal insights and professional experience

SEO REQUIREMENTS:
- Use the main topic naturally throughout
- Include related keywords from the category
- Create scannable content with proper headings
- Add relevant technical terms

Return your response as a JSON object with this exact structure:
{
  "title": "${seoTitle}",
  "content": "Full markdown content here",
  "excerpt": "Compelling 2-3 sentence summary that makes readers want to click",
  "tags": ["5 relevant SEO tags"],
  "topic": "${mainTopic}",
  "category": "${selectedCategory}"
}`;

    // Make request to OpenRouter API
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_BASE_URL ||
            "https://ngoma-benjamin.threezeroonellc.com",
          "X-Title": "Ngoma Benjamin Blog Auto-Generator",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat-v3.1",
          messages: [
            {
              role: "system",
              content:
                "You are an expert technical writer specializing in software development content. You create comprehensive, educational articles that teach complex topics clearly and provide practical value to developers.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 4000,
          top_p: 0.9,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `OpenRouter API error: ${response.status} - ${
          errorData.error?.message || response.statusText
        }`
      );
    }

    const completion = await response.json();
    const aiContent = completion.choices?.[0]?.message?.content?.trim();

    if (!aiContent) {
      throw new Error("No content received from OpenRouter API");
    }

    // Parse the AI’s JSON response
    let blogData: BlogPostData;
    try {
  let jsonText = aiContent.trim()

  // 🧹 If the whole response is wrapped in ```json ... ```
  if (jsonText.startsWith("```")) {
    const match = jsonText.match(/```json\s*([\s\S]*?)```/i)
      || jsonText.match(/```\s*([\s\S]*?)```/i)

    if (match) {
      jsonText = match[1].trim()
    }
  }

  // 🧹 Extract the first valid JSON object
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("No JSON object found in AI response")

  blogData = JSON.parse(jsonMatch[0]) as BlogPostData
  console.log("Parsed blog data from OpenRouter:", blogData)

} catch (parseError) {
  console.error("Error parsing OpenRouter response:", parseError)
  console.log("Raw response:", aiContent)

      // Fallback: wrap raw response into BlogPostData
      blogData = {
        title: seoTitle,
        content: aiContent.content || "Am cooked",
        excerpt: `Learn about ${mainTopic} in this comprehensive ${contentType.toLowerCase()} covering best practices and practical examples.`,
        tags: [
          mainTopic.toLowerCase().replace(/\s+/g, "-"),
          selectedCategory.toLowerCase().replace(/\s+/g, "-"),
          contentType.toLowerCase().replace(/\s+/g, "-"),
          "development",
          "programming",
        ],
        topic: mainTopic,
        category: selectedCategory,
      };
    }

    // Validate and ensure all required fields
    return {
      title: blogData.title || seoTitle,
      content:
        blogData.content ||
        `# ${seoTitle}\n\nContent generation in progress...`,
      excerpt:
        blogData.excerpt ||
        `Learn about ${mainTopic} in this comprehensive guide.`,
      tags: Array.isArray(blogData.tags)
        ? blogData.tags
        : [
            mainTopic.toLowerCase(),
            selectedCategory.toLowerCase(),
            "development",
          ],
      topic: blogData.topic || mainTopic,
      category: blogData.category || selectedCategory,
    };
  } catch (error) {
    console.error("Error generating blog post with OpenRouter:", error);

    // Return fallback content with error information
    const fallbackCategory = getRandomItem(Object.keys(BLOG_CATEGORIES));
    return {
      title: `${
        timeOfDay === "morning" ? "Morning" : "Evening"
      } Development Insights`,
      content: `# Content Generation Error

## OpenRouter AI Integration Issue

We encountered an error while generating blog content using OpenRouter AI with the DeepSeek model.

### Error Details:
\`\`\`
${error instanceof Error ? error.message : "Unknown error"}
\`\`\`

### Troubleshooting:
1. Verify OpenRouter API key is configured correctly
2. Check API quota and billing status
3. Ensure network connectivity
4. Review server logs for detailed error information

Please try again later or contact the administrator.`,
      excerpt: "An error occurred during automated blog content generation.",
      tags: ["error", "troubleshooting", "openrouter", "ai"],
      topic: "Error Handling",
      category: fallbackCategory,
    };
  }
}
