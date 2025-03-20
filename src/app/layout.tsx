import Navbar from "@/components/Navbar";
import "@/app/globals.css";

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
      </body>
    </html>
  );
}
