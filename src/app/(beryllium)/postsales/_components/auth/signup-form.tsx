'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, Input, Checkbox, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import * as z from 'zod';
import { routes } from '@/config/routes';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number should be at least 10 digits'),
  companyName: z.string().min(1, 'Company name is required'),
  isAgreed: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function PostSalesSignupForm() {
  const router = useRouter();
  const [reset, setReset] = useState({});

  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    console.log('Signup data:', data);
    toast.success('Account created successfully! Please sign in.');
    router.push(`${routes.postsales.login}?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <Form<SignupFormValues>
      validationSchema={signupSchema}
      onSubmit={onSubmit}
      useFormProps={{
        defaultValues: {
          isAgreed: false,
        },
      }}
    >
      {({ register, formState: { errors } }: UseFormReturn<SignupFormValues>) => (
        <div className="space-y-5">
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your name"
            rounded="pill"
            size="lg"
            {...register('fullName')}
            error={errors.fullName?.message}
          />
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            rounded="pill"
            size="lg"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            type="text"
            label="Phone Number"
            placeholder="Enter your phone"
            rounded="pill"
            maxLength={10}
            size="lg"
            {...register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />
          <Input
            type="text"
            label="Company Name"
            placeholder="Enter your company"
            rounded="pill"
            size="lg"
            {...register('companyName')}
            error={errors.companyName?.message}
          />
          <div className="flex items-start pb-2">
            <Checkbox
              {...register('isAgreed')}
              className="mt-0.5"
              label={
                <Text className="text-sm">
                  By signing up, you agree to our{' '}
                  <Link href="/" className="font-semibold text-primary hover:underline">
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link href="/" className="font-semibold text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Text>
              }
            />
          </div>
          {errors.isAgreed && (
            <Text className="mt-0.5 text-xs text-red">
              {errors.isAgreed.message}
            </Text>
          )}
          <Button
            className="w-full text-base font-medium"
            type="submit"
            size="lg"
            rounded="pill"
          >
            Create Account <PiArrowRightBold className="ms-2 h-5 w-5" />
          </Button>
          <div className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              href={routes.postsales.login}
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </Form>
  );
}
