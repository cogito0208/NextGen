import Link from 'next/link';
import { APP_CONFIG, PLANS, ROUTES } from '@/config/app';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <span className="text-xl font-bold text-gray-900">{APP_CONFIG.name}</span>
        <div className="flex items-center gap-4">
          <Link href={ROUTES.login} className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Sign In
          </Link>
          <Link href={ROUTES.register}>
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-gray-900">
          Enterprise SaaS Platform for Modern Teams
        </h1>
        <p className="mt-6 max-w-xl text-lg text-gray-600">
          Streamline your operations, collaborate at scale, and grow your business with {APP_CONFIG.name}.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href={ROUTES.register}>
            <Button size="lg">Start Free Trial</Button>
          </Link>
          <Link href={ROUTES.dashboard}>
            <Button size="lg" variant="outline">View Dashboard</Button>
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(PLANS).map(([key, plan]) => (
              <div
                key={key}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {plan.price === 0 ? 'Free' : plan.price === -1 ? 'Custom' : `$${plan.price}`}
                  {plan.price > 0 && <span className="text-base font-normal text-gray-500">/mo</span>}
                </p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-gray-600">
                  <li>Up to {plan.maxUsers === Infinity ? 'Unlimited' : plan.maxUsers} users</li>
                  <li>Up to {plan.maxProjects === Infinity ? 'Unlimited' : plan.maxProjects} projects</li>
                </ul>
                <Link href={ROUTES.register} className="mt-6">
                  <Button variant={key === 'professional' ? 'primary' : 'outline'} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
      </footer>
    </div>
  );
}
