import { createApi } from "unsplash-js"
import nodeFetch from "node-fetch"

// Initialize the Unsplash API with your access key
const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
  fetch: nodeFetch as unknown as typeof fetch,
})

// Function to get a relevant image from Unsplash based on a topic
export async function getUnsplashImage(topic: string): Promise<string | null> {
  try {
    // Clean up the topic for better search results
    const searchTerm = topic
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .filter((word) => !["and", "or", "the", "in", "on", "at", "for", "with", "to"].includes(word))
      .join(" ")

    // Add web development to the search term for more relevant results
    const query = `${searchTerm} web development programming coding`

    // Search for images
    const result = await unsplashApi.search.getPhotos({
      query,
      perPage: 10,
      orientation: "landscape",
    })

    if (result.errors) {
      console.error("Error fetching Unsplash image:", result.errors[0])
      return null
    }

    // Get a random image from the results
    const photos = result.response?.results
    if (!photos || photos.length === 0) {
      // Fallback to generic web development images
      const fallbackResult = await unsplashApi.search.getPhotos({
        query: "web development coding",
        perPage: 10,
        orientation: "landscape",
      })

      const fallbackPhotos = fallbackResult.response?.results
      if (!fallbackPhotos || fallbackPhotos.length === 0) {
        return null
      }

      const randomIndex = Math.floor(Math.random() * fallbackPhotos.length)
      return fallbackPhotos[randomIndex].urls.regular
    }

    const randomIndex = Math.floor(Math.random() * photos.length)
    return photos[randomIndex].urls.regular
  } catch (error) {
    console.error("Error in getUnsplashImage:", error)
    return null
  }
}
