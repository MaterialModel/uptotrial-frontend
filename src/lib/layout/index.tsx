import type { ReactNode } from 'react';

import { ThemeProvider } from 'next-themes';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Meta } from './components/meta';

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider attribute="class" enableSystem={true} defaultTheme="system">
      <Meta />
      <div className="flex min-h-screen w-full flex-col bg-white dark:bg-black dark:text-white">
        <Header />
        <main className="wrapper">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};
