'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'src/lib/hook';
import { RootState } from 'src/lib/store';
import { tokenLoginUser } from 'src/lib/reducers/userSlice';
import Header from '@layouts/default/header';
import Footer from '@layouts/footer/footer';
import MobileNavigation from '@layouts/mobile-navigation/mobile-navigation';

export default function DefaultLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthorized, loading } = useAppSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    const checkAuthorization = async () => {
      const result = await dispatch(tokenLoginUser()).unwrap();
  
      if (!result) {
        router.replace('/login/signin');
      }
    };
  
    checkAuthorization();
  }, []);
  

  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} />
      <main
        className="relative flex-grow"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>
      <Footer lang={lang} />
      <MobileNavigation lang={lang} />
    </div>
  );
}
