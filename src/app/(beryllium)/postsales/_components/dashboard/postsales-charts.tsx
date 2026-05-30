import SalesReport from '@/app/shared/ecommerce/dashboard/sales-report';
import UserLocation from '@/app/shared/ecommerce/dashboard/user-location';

export default function PostsalesCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 @container 3xl:mb-8 3xl:gap-8">
      <div className="lg:col-span-2">
        <SalesReport className="h-full" />
      </div>
      <div>
        <UserLocation className="h-full" />
      </div>
    </div>
  );
}
