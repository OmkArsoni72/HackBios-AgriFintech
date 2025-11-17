import './globals.css';
import GeminiChatbot from "./components/GeminiChatbot";


export const metadata = {
  title: 'AgriFinAI',
  description: 'Empowering Indian agriculture with AI-powered financial and crop advisory solutions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkMode = localStorage.getItem('darkMode');
                  if (darkMode === 'true') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 antialiased">
        {children}
        <GeminiChatbot />
      </body>
    </html>
  );
}