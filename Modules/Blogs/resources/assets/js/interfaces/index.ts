export interface BlogProps {
  id: number
  image: string
  heroImage?: string
  title: { ar: string; en: string }
  summary: { ar: string; en: string }
  content: { ar: string; en: string }
  category?: string
  readTime?: string
  published?: boolean
  created_at?: string
}