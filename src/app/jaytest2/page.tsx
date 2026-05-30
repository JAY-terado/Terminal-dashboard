'use client';
import { useState } from 'react';
import { string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
// 1. Fixed: Group all RizzUI imports together
import { 
  Input, 
  Textarea, 
  Password, 
  Select, 
  type SelectOption, 
  MultiSelect, 
  type MultiSelectOption, 
  Checkbox, 
  Radio, 
  Switch, 
  PinCode, 
  AdvancedRadio, 
  CheckboxGroup, 
  RadioGroup, 
  Button, 
  Modal, 
  Text, 
  Title, 
  ActionIcon,
  FileInput
} from 'rizzui';
import { PiXBold } from "react-icons/pi";

// Form validation schema
const schema = z
  .object({
    // Basic Information
    fullName: z
      .string()
      .min(2, { message: 'Full name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Phone number is required' }),
    dateOfBirth: z.string().min(1, { message: 'Date of birth is required' }),
    website: z
      .string().url({ message: 'Invalid URL' })
      .optional()
      .or(z.literal('')),

    // Password & Security
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Please confirm your password' }),
    pinCode: z.string().length(6, { message: 'PIN code must be 6 digits' }),

    // Location
    country: z.string().min(1, { message: 'Country is required' }),
    city: z.string().min(1, { message: 'City is required' }),

    // Professional Information
    experience: z.string().min(1, { message: 'Experience level is required' }),
    jobType: z.string().min(1, { message: 'Job type is required' }),
    skills: z
      .array(z.string())
      .min(1, { message: 'Select at least one skill' }),
    preferredLocations: z
      .array(z.string())
      .min(1, { message: 'Select at least one location' }),

    // Preferences
    notifications: z.boolean(),
    newsletter: z.boolean(),

    // Additional Information
    bio: z.string().min(10, { message: 'Bio must be at least 10 characters' }),
    resume: z.any().refine((files) => files && files.length > 0, {
      message: 'Resume file is required',
    }),

    // Radio Group
    employmentStatus: z
      .string()
      .min(1, { message: 'Employment status is required' }),

    // Checkbox Group
    interests: z
      .array(z.string())
      .min(1, { message: 'Select at least one interest' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SchemaType = z.infer<typeof schema>;

// Options for selects and multi-selects
const countryOptions: SelectOption[] = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
  { label: 'France', value: 'fr' },
];

const cityOptions: SelectOption[] = [
  { label: 'New York', value: 'ny' },
  { label: 'London', value: 'london' },
  { label: 'Toronto', value: 'toronto' },
  { label: 'Sydney', value: 'sydney' },
  { label: 'Berlin', value: 'berlin' },
  { label: 'Paris', value: 'paris' },
];

const experienceOptions: SelectOption[] = [
  { label: 'Entry Level (0-2 years)', value: 'entry' },
  { label: 'Mid Level (3-5 years)', value: 'mid' },
  { label: 'Senior Level (6-10 years)', value: 'senior' },
  { label: 'Executive (10+ years)', value: 'executive' },
];

const skillsOptions: MultiSelectOption[] = [
  { label: 'React', value: 'react' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'UI/UX Design', value: 'design' },
  { label: 'Project Management', value: 'pm' },
  { label: 'DevOps', value: 'devops' },
  { label: 'Machine Learning', value: 'ml' },
];

const locationOptions: MultiSelectOption[] = [
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'onsite' },
];

const employmentStatusOptions = [
  { label: 'Full-time', value: 'fulltime' },
  { label: 'Part-time', value: 'parttime' },
  { label: 'Contract', value: 'contract' },
  { label: 'Freelance', value: 'freelance' },
];

const interestOptions = [
  { label: 'Technology', value: 'tech' },
  { label: 'Design', value: 'design' },
  { label: 'Business', value: 'business' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Education', value: 'education' },
];

export default function RizzUIForm() {
  const [formData, setFormData] = useState<SchemaType | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [employmentStatus, setEmploymentStatus] = useState<string>('');

  const {
    handleSubmit,
    control,
    register,
    getValues,            
    setValue,   
    formState: { errors },
  } = useForm<SchemaType>({
    defaultValues: {
      notifications: false,
      newsletter: false,
      skills: [],
      preferredLocations: [],
      interests: [],
      employmentStatus: '',
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: SchemaType) => {
    // Form will only trigger this if ALL validation errors are resolved
    const formattedData = {
      ...data,
      resume: data.resume && data.resume.length > 0 ? Array.from(data.resume).map((file: any) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })) : [],
    };
    setFormData(formattedData as any);
    console.log("Successfully submitted data:", formattedData);
    alert(`Success! Application submitted for ${data.fullName}`);
  };

  // 💡 Pro-tip: This log lets you see EXACTLY which fields are failing validation in the browser console!
  console.log("Hook Form Errors:", errors);

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 w-full max-w-5xl mx-auto mb-10"
    >
      {/* Basic Information Section */}
      <div className="space-y-6">
        <div className="mb-4">
          <Title as="h3" className="text-xl font-semibold">
            Basic Information
          </Title>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="John Doe"
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="john.doe@example.com"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            type="tel"
            label="Phone Number"
            placeholder="+1 (555) 123-4567"
            {...register('phone')}
            maxLength={10}
            error={errors.phone?.message}
          />

          <Input
            type="date"
            label="Date of Birth"
            {...register('dateOfBirth')}
            error={errors.dateOfBirth?.message}
          />

          <Input
            type="url"
            label="Website (Optional)"
            placeholder="https://yourwebsite.com"
            {...register('website')}
            error={errors.website?.message}
          />
        </div>
      </div>

      {/* Password & Security Section */}
      <div className="space-y-6">
        <div className="mb-4">
          <Title as="h3" className="text-xl font-semibold">
            Password & Security
          </Title>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Password
            label="Password"
            placeholder="Enter your password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Password
            label="Confirm Password"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="md:col-span-2">
            <Controller
              control={control}
              name="pinCode"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div>
                  <PinCode
                    length={6}
                    setValue={(val) => onChange(val)}
                    error={error?.message}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="space-y-6">
        <div className="mb-4">
          <Title as="h3" className="text-xl font-semibold">
            Location
          </Title>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="country"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Select
                value={value}
                label="Country"
                options={countryOptions}
                onChange={(v: SelectOption) => onChange(v.value)}
                error={error?.message}
                displayValue={(selected: string) =>
                  countryOptions?.find((r) => r.value === selected)?.label ?? ''
                }
              />
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Select
                value={value}
                label="City"
                options={cityOptions}
                onChange={(v: SelectOption) => onChange(v.value)}
                error={error?.message}
                displayValue={(selected: string) =>
                  cityOptions?.find((r) => r.value === selected)?.label ?? ''
                }
              />
            )}
          />
        </div>
      </div>

      {/* Professional Information Section */}
      <div className="space-y-6">
        <div className="mb-4">
          <Title as="h3" className="text-xl font-semibold">
            Professional Information
          </Title>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="experience"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Select
                value={value}
                label="Experience Level"
                options={experienceOptions}
                onChange={(v: SelectOption) => onChange(v.value)}
                error={error?.message}
                displayValue={(selected: string) =>
                  experienceOptions?.find((r) => r.value === selected)?.label ??
                  ''
                }
              />
            )}
          />

          <div>
            <Text className="mb-2 font-medium">Job Type</Text>
            <div className="grid grid-cols-2 gap-4">
              <AdvancedRadio
                value="fulltime"
                contentClassName="p-4"
                {...register('jobType')}
              >
                <Title as="h4" className="text-base font-semibold">
                  Full-time
                </Title>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Permanent position
                </Text>
              </AdvancedRadio>
              <AdvancedRadio
                value="contract"
                contentClassName="p-4"
                {...register('jobType')}
              >
                <Title as="h4" className="text-base font-semibold">
                  Contract
                </Title>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Project-based work
                </Text>
              </AdvancedRadio>
            </div>
            {errors.jobType && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.jobType.message}
              </Text>
            )}
          </div>

          <div className="md:col-span-2">
            <Controller
              control={control}
              name="skills"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <MultiSelect
                  value={value || []}
                  label="Skills"
                  options={skillsOptions}
                  onChange={onChange}
                  error={error?.message}
                  clearable
                />
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Controller
              control={control}
              name="preferredLocations"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <MultiSelect
                  value={value || []}
                  label="Preferred Work Locations"
                  options={locationOptions}
                  onChange={onChange}
                  error={error?.message}
                  clearable
                />
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Text className="mb-2 font-medium">Employment Status</Text>
            <Controller
              control={control}
              name="employmentStatus"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div>
                  <RadioGroup
                    value={employmentStatus}
                    setValue={(val) => {
                      setEmploymentStatus(val);
                      onChange(val);
                    }}
                    className="flex flex-wrap gap-4"
                  >
                    {employmentStatusOptions.map((option) => (
                      <Radio
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </RadioGroup>
                  {error && (
                    <Text className="text-red-500 text-sm mt-1">
                      {error.message}
                    </Text>
                  )}
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Text className="mb-2 font-medium">Interests</Text>
            <Controller
              control={control}
              name="interests"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div>
                  <CheckboxGroup
                    values={interests}
                    setValues={(vals) => {
                      setInterests(vals);
                      onChange(vals);
                    }}
                    className="flex flex-wrap gap-4"
                  >
                    {interestOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        label={option.label}
                        value={option.value}
                      />
                    ))}
                  </CheckboxGroup>
                  {error && (
                    <Text className="text-red-500 text-sm mt-1">
                      {error.message}
                    </Text>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="space-y-6">
        <div className="mb-4">
          <Title as="h3" className="text-xl font-semibold">
            Preferences
          </Title>
        </div>

        <div className="space-y-4">
          <Switch
            label="Enable Email Notifications"
            {...register('notifications')}
          />

          <Switch label="Subscribe to Newsletter" {...register('newsletter')} />
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="space-y-6">
        <div className="mb-4">
          <Title as="h3" className="text-xl font-semibold">
            Additional Information
          </Title>
        </div>

        <div className="space-y-6">
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            rows={4}
            {...register('bio')}
            error={errors.bio?.message}
          />

          <FileInput
            label="Upload Resume"
            accept=".pdf,.doc,.docx"
            helperText="Upload your resume in PDF, DOC, or DOCX format"
            {...register('resume')}
            error={errors?.resume?.message as string}
          />

        </div>
      </div>


      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto min-w-[200px]"
        >
          Submit Application
        </Button>
      </div>
    </form>
  );
}