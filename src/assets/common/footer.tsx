import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 px-6 py-4 text-sm text-gray-400">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} VolX Trading Platform</span>
        <Link
          href="/privacy"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
