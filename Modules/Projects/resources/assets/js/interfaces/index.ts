export type Project = {
  name: string,
  description: string,
  images: [{ image: string, project_id: string }],
  created_at: string,
}