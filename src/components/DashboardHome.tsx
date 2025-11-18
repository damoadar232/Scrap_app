import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Package, TrendingUp, Recycle, Award } from 'lucide-react';

interface DashboardHomeProps {
  stats: {
    total: number;
    pending: number;
    completed: number;
  };
}

export function DashboardHome({ stats }: DashboardHomeProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Welcome Banner */}
      <Card className="p-6 bg-gradient-to-br from-green-500 to-green-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10">
          <Recycle className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-white text-2xl mb-2">Welcome Back! 👋</h2>
          <p className="text-green-100 mb-4">
            Let's make a difference together by recycling scrap materials
          </p>
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              Eco Warrior
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {stats.completed} Completed
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center hover:shadow-lg transition-shadow">
          <div className="flex justify-center mb-2">
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-600">Total Requests</div>
        </Card>

        <Card className="p-4 text-center hover:shadow-lg transition-shadow border-2 border-orange-200">
          <div className="flex justify-center mb-2">
            <div className="bg-orange-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
          <div className="text-xs text-gray-600">Pending</div>
        </Card>

        <Card className="p-4 text-center hover:shadow-lg transition-shadow border-2 border-green-200">
          <div className="flex justify-center mb-2">
            <div className="bg-green-100 p-3 rounded-full">
              <Award className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-gray-900 mb-1">How It Works</h3>
            <ol className="text-sm text-gray-600 space-y-1">
              <li>1. Select scrap types you want to recycle</li>
              <li>2. Enter weight and upload images</li>
              <li>3. Provide pickup address and schedule</li>
              <li>4. We'll collect it at your doorstep!</li>
            </ol>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
        <h3 className="text-gray-900 mb-2 flex items-center gap-2">
          <span className="text-lg">💡</span>
          Quick Tips
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Clean and separate different scrap types</li>
          <li>• Take clear photos of all items</li>
          <li>• Ensure accurate weight measurements</li>
          <li>• Be available during scheduled pickup time</li>
        </ul>
      </Card>
    </div>
  );
}
