import { Link } from "@inertiajs/react";
const Pagination = ({ links }: { links: any[] }) => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {links.map((link, index) => (
        <Link
          preserveScroll
          preserveState
          key={index}
          href={link.url || ""}
          dangerouslySetInnerHTML={{ __html: link.label }}
          className={`
                        px-4 py-2 rounded-xl text-sm font-medium transition-all
                        ${link.active
              ? "bg-arch-accent text-arch-card"
              : "bg-arch-card text-arch-dark hover:bg-arch-light"}
                        ${!link.url && "opacity-50 pointer-events-none"}
                    `}
        />
      ))}
    </div>
  );
}
export default Pagination