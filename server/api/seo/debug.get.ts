export default defineEventHandler(async () => {
  try {
    const storage = useStorage('assets:server')
    const keys = await storage.getKeys()

    // Try different path patterns
    const tests = {
      keys: keys,
      'seo-data:backlinks.json': await storage.getItem('seo-data:backlinks.json'),
      'seo-data:backlinks': await storage.getItem('seo-data:backlinks'),
      'seo-data/backlinks.json': await storage.getItem('seo-data/backlinks.json'),
      'seo-data/backlinks': await storage.getItem('seo-data/backlinks'),
    }

    return tests
  } catch (error: any) {
    return { error: error.message }
  }
})
