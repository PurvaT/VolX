import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="bg-gray-900 px-6 py-3 text-sm text-gray-400 border-b border-gray-700">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={index} className={item.href ? "" : "text-gray-200"}>
            {item.href ? (
              <Link href={item.href} className="text-blue-400 hover:text-blue-300 transition-colors">
                {item.label}
              </Link>
            ) : (
              item.label
            )}
            {index < items.length - 1 && <span className="ml-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
