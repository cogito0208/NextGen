import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const stats = [
  { label: 'Total Users', value: '0', change: '+0%' },
  { label: 'Active Projects', value: '0', change: '+0%' },
  { label: 'Monthly Revenue', value: '$0', change: '+0%' },
  { label: 'Support Tickets', value: '0', change: '+0%' },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-green-600">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">No recent activity.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
