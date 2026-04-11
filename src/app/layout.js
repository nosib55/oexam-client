import { Inter } from 'next/font/google';
import './globals.css';
import LoadingWrapper from '@/components/shared/LoadingWrapper';
import Chatbot from '@/components/shared/Chatbot';


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} !overflow-x-hidden`}>
        <LoadingWrapper>
          {children}
        </LoadingWrapper>
        <Chatbot />
      </body>
    </html>
  );
}
