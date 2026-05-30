'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, PinCode, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { PiArrowRightBold, PiEnvelopeSimple } from 'react-icons/pi';
import * as z from 'zod';
import { routes } from '@/config/routes';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().refine((val) => {
    const isEmail = z.string().email().safeParse(val).success;
    const isPhone = /^\+?[1-9]\d{1,14}$/.test(val); // Simple E.164-ish regex
    return isEmail || isPhone;
  }, {
    message: 'Please enter a valid email address or phone number',
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export default function PostSalesLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');

  const onEmailSubmit: SubmitHandler<LoginFormValues> = (data) => {
    console.log('Sending OTP to:', data.email);
    setEmail(data.email);
    setStep('otp');
  };

  const onOtpSubmit: SubmitHandler<OtpFormValues> = (data) => {
    console.log('Verifying OTP:', data.otp, 'for email:', email);
    toast.success('OTP verified successfully!');
    // Successful verification
    router.push(routes.postsales.dashboard);
  };

  if (step === 'email') {
    return (
      <Form<LoginFormValues>
        validationSchema={loginSchema}
        onSubmit={onEmailSubmit}
        useFormProps={{
          defaultValues: {
            email: emailParam,
          },
        }}
      >
        {({ register, formState: { errors } }: UseFormReturn<LoginFormValues>) => (
          <div className="space-y-5">
            <Input
              type="email"
              label="Email Address or Phone Number"
              placeholder="Enter your email or Phone number"
              rounded="pill"
              size="lg"
              {...register('email')}
              error={errors.email?.message}
              prefix={<PiEnvelopeSimple className="h-5 w-5 text-gray-500" />}
            />
            <Button
              className="w-full text-base font-medium"
              type="submit"
              size="lg"
              rounded="pill"
            >
              Get OTP <PiArrowRightBold className="ms-2 h-5 w-5" />
            </Button>
            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href={routes.postsales.signup}
                className="font-semibold text-primary hover:underline"
              >
                Sign Up
              </Link>
            </div>
            <Text className="text-center text-sm text-gray-500">
              We&apos;ll send a 6-digit one-time password to your email.
            </Text>
          </div>
        )}
      </Form>
    );
  }

  return (
    <Form<OtpFormValues>
      validationSchema={otpSchema}
      onSubmit={onOtpSubmit}
      useFormProps={{
        defaultValues: {
          otp: '123456',
        },
      }}
    >
      {({ setValue, watch, formState: { errors } }: UseFormReturn<OtpFormValues>) => (
        <div className="space-y-8">
          <div className="text-center">
            <Text className="text-gray-500">
              Please enter the 6-digit code sent to <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </Text>
          </div>
          <div className="flex flex-col items-center justify-center">
            <PinCode
              variant="outline"
              defaultValue="123456"
              setValue={(value) => setValue('otp', String(value), { shouldValidate: true })}
              size="lg"
              length={6}
            />
          </div>
          <Button
            className="w-full text-base font-medium"
            type="button"
            size="lg"
            rounded="pill"
            onClick={() => {
              toast.success('OTP verified successfully!');
              router.push(routes.postsales.dashboard);
            }}
          >
            Verify & Sign In
          </Button>
          <div className="text-center">
            <Button
              variant="text"
              onClick={() => setStep('email')}
              className="text-primary hover:underline"
            >
              Change Email
            </Button>
            <span className="mx-2 text-gray-400">|</span>
            <Button
              variant="text"
              className="text-primary hover:underline"
              onClick={() => console.log('Resending OTP...')}
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
}
