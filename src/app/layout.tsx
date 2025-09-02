// import { Inter } from 'next/font/google'
// import { Providers } from '@/components/providers'
// import { cn } from '@/lib/utils'
// import './globals.css'

// const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'CollabIDE - Real-time Collaborative Code Editor',
//   description: 'Code together in real-time with powerful collaboration features',
//   keywords: ['code editor', 'collaboration', 'real-time', 'programming'],
//   authors: [{ name: 'CollabIDE Team' }],
//   openGraph: {
//     title: 'CollabIDE - Collaborative Code Editor',
//     description: 'Real-time collaborative coding platform',
//     type: 'website',
//   },
//   icons: {
//     icon: '/logo.png', // or '/favicon.png' or '/favicon.svg'
//   },
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body className={cn(inter.className, 'antialiased')}>
//         <Providers>
//           {children}
//         </Providers>
//       </body>
//     </html>
//   )
// }

import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { cn } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CollabIDE - Real-time Collaborative Code Editor',
  description: 'Code together in real-time with powerful collaboration features',
  keywords: ['code editor', 'collaboration', 'real-time', 'programming'],
  authors: [{ name: 'CollabIDE Team' }],
  openGraph: {
    title: 'CollabIDE - Collaborative Code Editor',
    description: 'Real-time collaborative coding platform',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch session once on server-side to prevent multiple client requests
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'antialiased')}>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
