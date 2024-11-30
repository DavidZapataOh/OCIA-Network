import { Inter } from 'next/font/google'
import './globals.css'
import { headers } from "next/headers";
import ContextProvider from '@/context'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'OCIA Network',
  description: 'On-Chain Intelligent Agent',
}

export default function RootLayout({ children }) {
  const cookies = headers().get('cookie');
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>
      </body>
    </html>
  )
}
