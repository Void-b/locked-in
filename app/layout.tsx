import './globals.css'

export const metadata = {
  title: 'Locked-In Challenge',
  description: 'Daily submission app with authentication and admin panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
