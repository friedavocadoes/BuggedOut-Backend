import { GitHub, Instagram, Linkedin } from "react-feather/";

export function Footer() {
  return (
    <footer className="py-6 text-center text-sm text-gray-500 bg-zinc-900 z-50">
      <div className="container mx-auto">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-4">
            <a
              href="https://github.com/friedavocadoes"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              <GitHub className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com/gnawthm"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/gautham-madhu/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-700"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          <p>© {new Date().getFullYear()} Gautham & Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
