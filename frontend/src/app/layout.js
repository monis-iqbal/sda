import "./globals.css";

export const metadata = {
  title: "FixMate - Home Service Management",
  description: "Book and manage home services easily with FixMate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
