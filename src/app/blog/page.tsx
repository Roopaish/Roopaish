import { Metadata } from "next"
import Link from "next/link"
import BlogCard from "@/components/blog-card"
import { Separator } from "@/components/ui/separator"
import { blogs, categories } from "@site/content"

type Props = { searchParams: { tags?: string | string[]; category?: string } }

function getBlogs({ tags, category }: Props["searchParams"]) {
  return blogs
    ?.filter((b) => {
      if (Array.isArray(tags) && tags.length > 0) {
        return b.tags.some((tag) => tags?.includes(tag))
      } else if (typeof tags === "string" && tags.length > 0) {
        return b.tags.includes(tags)
      } else {
        return true
      }
    })
    .filter((b) => {
      if (category) {
        return b.categories.includes(category)
      } else {
        return true
      }
    })
}

export function generateMetadata({ searchParams }: Props): Metadata {
  const category = categories.find((c) => c.slug === searchParams.category)
  if (category == null)
    return {
      title: "Read blogs by roopaish",
      description: `Explore blogs on topics like ${categories.flatMap((c) => c.name).join(", ")}`,
    }
  return {
    title: category.meta?.title ?? category?.name,
    description: category?.meta?.description ?? category?.description,
  }
}

export default async function Blog({ searchParams }: Props) {
  const allBlogs = getBlogs({ ...searchParams })

  return (
    <div className="mt-32 pt-6 md:pt-44">
      <div className="container">
        <h1 className="font-sans text-3xl font-bold md:text-5xl">
          Read:
          <br />
          The Tech blog
        </h1>

        <div className="relative mt-16 grid grid-cols-6 justify-between">
          <div className="col-span-6 md:col-span-4">
            {allBlogs?.map((b, i) => (
              <BlogCard key={i} expand={i === 0 ? true : false} {...b} />
            ))}

            {allBlogs?.length === 0 && (
              <>
                <h1 className="text-2xl md:text-4xl">
                  No blogs found for <br />
                  <code>{JSON.stringify(searchParams)}</code>
                  <br />
                </h1>
              </>
            )}
          </div>
          <div className="col-span-6 mx-auto mt-24 h-full w-full md:col-span-2 md:pl-10 lg:pl-32">
            <div className="sticky top-10">
              <Categories />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Categories() {
  return (
    <div className="w-full">
      <h3 className="mb-2 text-base font-medium">All Categories</h3>
      <Separator orientation="horizontal" className="bg-slate-400" />
      <ul className="mt-4 text-sm text-slate-200">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/blog?category=${c.slug}`}
              className="mb-1 block hover:underline"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
