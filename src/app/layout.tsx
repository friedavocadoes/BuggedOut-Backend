import Navbar from "@/components/Navbar";
import "@/app/globals.css";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <title>BuggedOut | The Bug Bounty</title>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
