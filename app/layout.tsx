import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://realderma.kr';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '리얼더마 - 진짜 피부과 찾기',
    template: '%s | 리얼더마',
  },
  description:
    '건강보험 진료 데이터 기반으로 검증된 진짜 피부과를 찾아보세요. 미용 전문이 아닌 피부질환 치료 피부과를 지도에서 확인하세요.',
  keywords: ['피부과', '진짜 피부과', '피부과 찾기', '피부과 지도', '건강보험 피부과', '피부과 추천', '동네 피부과'],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '리얼더마',
    title: '리얼더마 - 진짜 피부과 찾기',
    description: '건강보험 진료 데이터 기반으로 검증된 진짜 피부과를 찾아보세요.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: '리얼더마 - 진짜 피부과 찾기',
    description: '건강보험 진료 데이터 기반으로 검증된 진짜 피부과를 찾아보세요.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full`} suppressHydrationWarning>
      <head>
        <meta name="naver-site-verification" content="your-naver-verification-code" />
      </head>
      <body className="h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '리얼더마',
              url: SITE_URL,
              description: '건강보험 진료 데이터 기반으로 검증된 진짜 피부과를 찾아보세요.',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <ThemeProvider>
          {children}
          {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
              crossOrigin="anonymous"
              strategy="lazyOnload"
            />
          )}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `}
              </Script>
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
