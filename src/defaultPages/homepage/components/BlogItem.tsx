import MarkdownViewer from "@/components/MarkdownViewer";
import Link from "next/link";

interface Blog {
  title: string;
  content: string;
  id: number;
}

export default function BlogItem({ blog }: { blog: Blog }) {
  return (
    <div key={blog.id}
      className="
            bg-neutral-700
            pt-2
            pb-6
            px-8
            rounded-lg
            shadow-md
            hover:shadow-lg
            transition-shadow
            duration-200
            flex
            flex-col
            justify-between
            min-h-[200px]
            md:min-h-[250px]
            my-4"
    >
      <h2 className="text-xl font-bold text-white line-clamp-2 mt-4">
        {blog.title}
      </h2>

      <div className="text-white text-sm line-clamp-3 mb-6">
        <MarkdownViewer content={blog.content} />
      </div>
      <Link
        className="cursor-pointer text-white font-semibold underline hover:text-amber-600"
        href={`/blog/${blog.id}`}
      >
        Leer más
      </Link>
    </div>
  );
}
