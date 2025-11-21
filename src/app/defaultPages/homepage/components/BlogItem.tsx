import MarkdownViewer from "@/components/MarkdownViewer";
import Link from "next/link";

interface Blog {
  title: string;
  content: string;
  id: number;
}

export default function BlogItem({ blog }: { blog: Blog }) {
  return (
    <div
      key={blog.id}
      className="
        bg-card
        border-2
        text-card-foreground
        pt-4
        pb-6
        px-4
        sm:px-6
        md:px-8
        rounded-lg
        shadow-md
        hover:shadow-[0_4px_6px_rgba(0,0,0,0.15)]
        dark:hover:shadow-[0_4px_6px_rgba(255,255,255,0.1)]
        transition-shadow
        duration-200
        flex
        flex-col
        justify-between
        min-h-[180px]
        sm:min-h-[200px]
        md:min-h-[220px]
        my-2
        sm:my-4
      "
    >
      <h2
        className="
      text-lg
      sm:text-xl
      md:text-2xl 
      font-bold 
      line-clamp-2 
      mt-2
      sm:mt-4
    "
      >
        {blog.title}
      </h2>

      <div
        className="
      text-sm
      sm:text-base
      md:text-lg
      opacity-90
      line-clamp-3
      my-4
      sm:mb-6
    "
      >
        <MarkdownViewer content={blog.content} />
      </div>

      <Link
        className="
          cursor-pointer 
          font-semibold 
          underline 
          text-primary 
          hover:opacity-80
          text-sm
          sm:text-base
          transition-colors
          duration-200
        "
        href={`/blog/${blog.id}`}
      >
        Leer más
      </Link>
    </div>

  );
}