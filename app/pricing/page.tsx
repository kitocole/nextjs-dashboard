// app/pricing/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      title: 'Starter',
      monthly: '$9/mo',
      annual: '$90/yr',
      features: ['Basic Dashboard', '1 User', 'Email Support'],
      cta: 'Get Starter',
    },
    {
      title: 'Pro',
      monthly: '$29/mo',
      annual: '$290/yr',
      features: ['Advanced Dashboard', 'Up to 5 Users', 'Priority Support', 'Custom Reports'],
      cta: 'Get Pro',
      highlighted: true,
    },
    {
      title: 'Business',
      monthly: '$99/mo',
      annual: '$990/yr',
      features: [
        'Full Dashboard Suite',
        'Unlimited Users',
        'Dedicated Account Manager',
        'Premium Integrations',
      ],
      cta: 'Get Business',
    },
  ];

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center px-6 py-16">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">Pricing Plans</h1>
      <p className="mb-12 max-w-2xl text-center text-gray-600 dark:text-gray-400">
        Choose the plan that&apos;s right for you and start building your SaaS today.
      </p>

      {/* Toggle */}
      <div className="mb-8 flex items-center gap-4">
        <span
          onClick={() => setAnnual(false)}
          className={`cursor-pointer ${
            !annual
              ? 'font-semibold text-blue-500 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Monthly
        </span>
        <div
          onClick={() => setAnnual(!annual)}
          className="relative flex h-8 w-14 cursor-pointer items-center rounded-full bg-gray-300 p-1 dark:bg-gray-700"
        >
          <div
            className={`h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out dark:bg-gray-900 ${
              annual ? 'translate-x-6' : ''
            }`}
          />
        </div>
        <span
          onClick={() => setAnnual(true)}
          className={`cursor-pointer ${
            annual
              ? 'font-semibold text-blue-500 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Annual
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className={`flex flex-col items-center rounded-lg border p-8 transition-transform duration-300 hover:scale-105 ${
              plan.highlighted
                ? 'scale-105 border-blue-500 bg-blue-50 shadow-md dark:border-blue-400 dark:bg-blue-900/10'
                : 'border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900'
            }`}
          >
            {plan.highlighted && (
              <div className="mb-4 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-500 dark:bg-blue-900/20 dark:text-blue-400">
                Best Value
              </div>
            )}
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              {plan.title}
            </h2>
            <p className="mb-6 text-3xl font-bold text-blue-500 dark:text-blue-400">
              {annual ? plan.annual : plan.monthly}
            </p>
            <ul className="mb-6 space-y-3 text-center text-gray-600 dark:text-gray-400">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button className="w-full">{plan.cta}</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
