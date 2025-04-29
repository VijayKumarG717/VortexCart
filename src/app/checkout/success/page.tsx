"use client";

import Link from "next/link";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import PageWrapper from "@/components/layout/PageWrapper";

export default function OrderSuccessPage() {
  // Generate a random order number
  const orderNumber = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  
  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-green-100 p-6">
            <FiCheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Order Successful!</h1>
          
          <p className="mt-4 text-lg text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 px-6 py-4 text-left">
            <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                <p className="mt-1 text-sm font-semibold text-gray-900">#{orderNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shipping Method</h3>
                <p className="mt-1 text-sm text-gray-900">Standard Shipping</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Estimated Delivery</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()} - 
                  {new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>
              We've sent a confirmation email to your email address with all the details.
            </p>
            <p className="mt-2">
              If you have any questions about your order, please contact our customer support.
            </p>
          </div>
          
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button href="/profile/orders">
              View Order Status
            </Button>
            
            <Button href="/" variant="outline">
              Continue Shopping
            </Button>
          </div>
          
          <div className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900">What's Next?</h2>
            
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <span className="text-xl font-bold text-indigo-600">1</span>
                </div>
                <h3 className="mt-4 text-base font-medium text-gray-900">Order Processing</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  We're preparing your order for shipment.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <span className="text-xl font-bold text-indigo-600">2</span>
                </div>
                <h3 className="mt-4 text-base font-medium text-gray-900">Shipping</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Your order will be shipped and you'll receive a tracking number.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <span className="text-xl font-bold text-indigo-600">3</span>
                </div>
                <h3 className="mt-4 text-base font-medium text-gray-900">Delivery</h3>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Your order will arrive at your doorstep shortly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
} 