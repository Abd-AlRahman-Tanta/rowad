export type Project = {
  id?: string,
  name: string,
  description: string,
  images: [{ image: string, project_id: string }],
  created_at: string,
}