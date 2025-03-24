import { ReactNode } from 'react';
import '../app/styles/globals.css'; // Optional: If you have global styles

export const metadata = {
  title: 'Employee Management',
  description: 'A simple employee management app built with Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}