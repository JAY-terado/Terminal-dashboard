'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, Title, Text, Password } from 'rizzui';

// 1. Define your form schema using Zod
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

// Infer the TypeScript type from the schema
type FormValues = z.infer<typeof formSchema>;

export default function JayTestPage() {
  // 2. Initialize the useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,  
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  // submit handlerr
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form Submitted Data:', data);
    alert(`Form submitted successfully for ${data.firstName}! Check console for full data.`);
    reset(); // Reset form after successful submission
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <Title as="h2" className="mb-2 text-center text-2xl font-bold text-gray-900">
          Jay's Test Form
        </Title>
        <Text className="mb-6 text-center text-gray-500">
          React Hook Form and RizzUI
        </Text>

        {/* 4. Connect the form to handleSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="First Name"
            placeholder="John"
            {...register('firstName')}
            error={errors.firstName?.message}
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            {...register('lastName')}
            error={errors.lastName?.message}
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="john.doe@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Password
            label="Password"
            placeholder="Enter a secure password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button
            type="submit"
            className="w-full mt-4"
            size="lg"
            isLoading={isSubmitting}
          >
            Submit Form
          </Button>
        </form>
      </div>
    </div>
  );
}
