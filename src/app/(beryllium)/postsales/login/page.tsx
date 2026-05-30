import PostSalesLoginForm from '../_components/auth/login-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import AuthCarousel from '../_components/auth/auth-carousel';
import UnderlineShape from '@core/components/shape/underline';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Post-Sales Login | Real Estate'),
};

import { Suspense } from 'react';
import PageAnimateWrapper from '@/app/shared/page-animate-wrapper';

export default function PostSalesSignIn() {
  return (
    <PageAnimateWrapper>
      <AuthWrapperOne
      className="h-screen overflow-hidden"
      title={
        <>
          Secure Access to{' '}
          <span className="relative inline-block">
            Post-Sales
          </span>{' '}
          Portal.
        </>
      }
      // description="Enter your email to receive a secure one-time password (OTP) and access your luxury real estate management tools instantly."
      // bannerTitle="Simplifying post-sales real estate management."
      // bannerDescription="Streamline your workflow with our advanced luxury real estate dashboard designed specifically for elegant post-sales operations and client satisfaction."
      isSocialLoginActive={false}
      pageImage={<AuthCarousel />}
    >

      <Suspense fallback={<div>Loading...</div>}>
        <PostSalesLoginForm />
      </Suspense>
      </AuthWrapperOne>
    </PageAnimateWrapper>
  );
}
