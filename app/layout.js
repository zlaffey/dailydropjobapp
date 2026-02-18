import "./globals.css";

export const metadata = {
  title: "DealDrop",
  description: "Points deal search and subscriber dashboard prototype",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
