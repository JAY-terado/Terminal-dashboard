"use client";

import { useState } from 'react';
import { Title, Text, Button } from 'rizzui';
import { PiPlusBold } from 'react-icons/pi';
import DashboardFilter from '../_components/widgets/dashboard-filter';
import BookingDetails from '../_components/widgets/booking-details';
import PaymentDetails from '../_components/widgets/payment-details';
import InventoryMatrix from '../_components/widgets/inventory-matrix';
import ActivePaymentTerms from '../_components/widgets/active-payment-terms';
import cn from '@core/utils/class-names';

export default function DashboardContent() {
  const [selectedWing, setSelectedWing] = useState('Wing A');

  return (
    <div className="space-y-8 pb-10 @container pt-6">
      {/* Pill Filter */}
      <DashboardFilter />

      {/* Main Widgets */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <BookingDetails />
        <PaymentDetails />
      </div>

      {/* Inventory Matrix */}
      <InventoryMatrix 
        selectedWing={selectedWing} 
        onWingChange={setSelectedWing} 
      />

      {/* Active Payment Terms */}
      <ActivePaymentTerms 
        selectedWing={selectedWing} 
      />

      {/* Action Button */}
      <div className="flex justify-center pt-4">
         <Button className="w-full @lg:w-auto bg-[#3498db] text-white rounded-2xl h-12 px-8 shadow-lg hover:bg-[#2980b9] transition-all">
            <PiPlusBold className="me-2 h-5 w-5" />
            Add New Record
         </Button>
      </div>
    </div>
  );
}
