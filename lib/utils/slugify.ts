import slugify from "slugify";

const options: Parameters<typeof slugify>[1] = {
  lower: true,
  strict: true,
  remove: /[*+~.()'"!:@]/g,
};

export function generateSlug(title: string, id?: string): string {
  const normalizedTitle =
    typeof title === "string" && title.trim().length > 0 ? title : "product";
  const slug = slugify(normalizedTitle, options) || "product";

  return id ? `${slug}-${id}` : slug;
}
