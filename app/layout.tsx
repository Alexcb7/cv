import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen w-screen overflow-x-hidden bg-black text-white">
        {children}
      </body>
    </html>
  );
}
