import PostSalesSignupForm from '../_components/auth/signup-form';
import AuthWrapperOne from '@/app/shared/auth-layout/auth-wrapper-one';
import AuthCarousel from '../_components/auth/auth-carousel';
import PageAnimateWrapper from '@/app/shared/page-animate-wrapper';
import UnderlineShape from '@core/components/shape/underline';
import { metaObject } from '@/config/site.config';

export const metadata = {
  ...metaObject('Post-Sales Signup | Real Estate'),
};

export default function PostSalesSignUp() {
  return (
    <PageAnimateWrapper>
      <AuthWrapperOne
      title={
        <>
          Join our{' '}
          <span className="relative inline-block">
            Post-Sales
          </span>{' '}
          Network.
        </>
      }
      description="Create your professional account to start managing luxury real estate transactions and client handovers efficiently."
      bannerTitle="Unlock elegant property management workflows."
      bannerDescription="Join a community of elite real estate professionals using our sophisticated Post-Sales portal to drive client satisfaction and operational excellence."
      isSocialLoginActive={true}
      pageImage={<AuthCarousel />}
    >
      <PostSalesSignupForm />
      </AuthWrapperOne>
    </PageAnimateWrapper>
  );
}
