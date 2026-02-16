import React, { useState } from 'react';
import { Villa, Booking } from '../types';
import { StorageService } from '../services/storageService';

interface BookingFormProps {
  villa: Villa;
  userId: string;
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ villa, userId, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'success'>('details');

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const days = calculateDays();
  const effectivePrice = villa.discountPrice && villa.discountPrice > 0 ? villa.discountPrice : villa.pricePerNight;
  const totalPrice = days * effectivePrice;
  const isDiscounted = villa.discountPrice && villa.discountPrice > 0;

  const handleBooking = async () => {
    setError('');
    
    if (!startDate || !endDate) {
      setError('Please select dates.');
      return;
    }
    
    if (new Date(startDate) >= new Date(endDate)) {
      setError('End date must be after start date.');
      return;
    }

    // Check availability
    const isAvailable = StorageService.isDateRangeAvailable(villa.id, startDate, endDate);
    if (!isAvailable) {
      setError('This villa is already booked for the selected dates. Please choose another date range.');
      return;
    }

    setPaymentStep('payment');
  };

  const processPayment = async () => {
    setLoading(true);
    // Simulate Midtrans Popup
    await new Promise(r => setTimeout(r, 2000)); // Fake processing time

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      villaId: villa.id,
      userId,
      startDate,
      endDate,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    await StorageService.createBooking(newBooking);
    setLoading(false);
    setPaymentStep('success');
    setTimeout(() => {
        onSuccess();
    }, 2000);
  };

  if (paymentStep === 'success') {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-green-600 text-2xl"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Confirmed!</h3>
        <p className="text-gray-500 mt-2">Check your email for details.</p>
      </div>
    );
  }

  if (paymentStep === 'payment') {
     return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold dark:text-white">Payment (Midtrans Simulator)</h3>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
                    <span>Rate per night</span>
                    <span>IDR {effectivePrice.toLocaleString()}</span>
                </p>
                <p className="flex justify-between mb-2 text-gray-700 dark:text-gray-300">
                    <span>Nights</span>
                    <span>{days}</span>
                </p>
                <div className="border-t border-gray-300 dark:border-gray-600 my-2"></div>
                <p className="flex justify-between mb-2 text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span> 
                    <span>IDR {totalPrice.toLocaleString()}</span>
                </p>
                
                <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700">
                        <i className="fas fa-credit-card"></i> Credit Card
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700">
                        <i className="fas fa-wallet"></i> GoPay
                    </button>
                </div>
            </div>
            
            <button 
                onClick={processPayment}
                disabled={loading}
                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50"
            >
                {loading ? 'Processing...' : 'Complete Payment'}
            </button>
             <button 
                onClick={() => setPaymentStep('details')}
                className="w-full text-gray-500 hover:text-gray-700 mt-2"
            >
                Cancel
            </button>
        </div>
     )
  }

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in</label>
                <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
                <input 
                    type="date" 
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-brand-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
        </div>

        {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm flex items-start gap-2">
                <i className="fas fa-exclamation-circle mt-0.5"></i>
                <span>{error}</span>
            </div>
        )}

        {days > 0 && (
            <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-md">
                <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-300">
                    <span>
                        {isDiscounted ? (
                            <>
                                <span className="line-through text-red-400 mr-2">{villa.pricePerNight.toLocaleString()}</span>
                                <span>{effectivePrice.toLocaleString()}</span>
                            </>
                        ) : (
                            <span>{villa.pricePerNight.toLocaleString()}</span>
                        )} 
                        {' '} x {days} nights
                    </span>
                    <span className="font-medium dark:text-white">IDR {totalPrice.toLocaleString()}</span>
                </div>
                <div className="border-t border-brand-200 dark:border-brand-800 my-2"></div>
                <div className="flex justify-between font-bold text-lg text-brand-900 dark:text-brand-100">
                    <span>Total</span>
                    <span>IDR {totalPrice.toLocaleString()}</span>
                </div>
            </div>
        )}

        <button 
            onClick={handleBooking}
            className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
        >
            Book Now
        </button>
    </div>
  );
};

export default BookingForm;