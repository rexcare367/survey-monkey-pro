export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Survey Monkey Pro. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <a
            href="#"
            className="hover:text-black dark:hover:text-zinc-50 transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-black dark:hover:text-zinc-50 transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-black dark:hover:text-zinc-50 transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

