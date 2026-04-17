import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'たまごっちベビー',
  description: '赤ちゃん育成ゲーム',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-dvh">
        {children}
      </body>
    </html>
  );
}
