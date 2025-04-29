"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight, FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import PageWrapper from "@/components/layout/PageWrapper";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  
  // Check if cart is empty and redirect to cart page
  if (items.length === 0) {
    router.push("/cart");
    return null;
  }
  
  // Checkout steps
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, name: "Shipping" },
    { id: 2, name: "Payment" },
    { id: 3, name: "Review" },
  ];
  
  // Form state
  const [formData, setFormData] = useState({
    // Shipping info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Billing info (same as shipping by default)
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",
    
    // Payment info
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Calculate total
  const subtotal = totalPrice();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.07; // 7% tax rate
  const total = subtotal + shipping + tax;
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Simulate order processing
      toast.success("Order placed successfully!");
      clearCart();
      router.push("/checkout/success");
    }
  };
  
  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        
        {/* Checkout Steps */}
        <nav aria-label="Progress" className="mt-8">
          <ol role="list" className="flex space-x-4 md:space-x-8">
            {steps.map((step) => (
              <li key={step.id} className="flex-1">
                <div 
                  className={`group flex flex-col border-l-4 py-2 pl-4 ${
                    step.id < currentStep 
                      ? 'border-indigo-600' 
                      : step.id === currentStep
                        ? 'border-indigo-600'
                        : 'border-gray-200'
                  }`}
                >
                  <span 
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      step.id < currentStep 
                        ? 'text-indigo-600' 
                        : step.id === currentStep
                          ? 'text-indigo-600'
                          : 'text-gray-500'
                    }`}
                  >
                    Step {step.id}
                  </span>
                  <span 
                    className={`text-sm font-medium ${
                      step.id < currentStep 
                        ? 'text-gray-900' 
                        : step.id === currentStep
                          ? 'text-gray-900'
                          : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        
        <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="border-b border-gray-200 pb-8">
                    <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Enter your shipping details.
                    </p>
                    
                    <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Street address
                        </label>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State / Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                          ZIP / Postal code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Billing Information</h2>
                    
                    <div className="mt-4">
                      <div className="flex items-center">
                        <input
                          id="sameAsShipping"
                          name="sameAsShipping"
                          type="checkbox"
                          checked={formData.sameAsShipping}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
                          Same as shipping address
                        </label>
                      </div>
                    </div>
                    
                    {!formData.sameAsShipping && (
                      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
                        {/* Billing form fields (similar to shipping) */}
                        {/* Only show if sameAsShipping is false */}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      All transactions are secure and encrypted.
                    </p>
                    
                    <div className="mt-6 space-y-6">
                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                          Name on card
                        </label>
                        <input
                          type="text"
                          name="cardName"
                          id="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          required
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                          Card number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          id="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          required
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700">
                            Expiration date (MM/YY)
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            id="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            required
                            placeholder="MM / YY"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cardCVC" className="block text-sm font-medium text-gray-700">
                            CVC
                          </label>
                          <input
                            type="text"
                            name="cardCVC"
                            id="cardCVC"
                            value={formData.cardCVC}
                            onChange={handleChange}
                            required
                            placeholder="CVC"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Image 
                      src="https://fakestoreapi.com/icons/lock.png" 
                      alt="Secure" 
                      width={16} 
                      height={16} 
                    />
                    <span className="text-xs text-gray-500">
                      Your payment information is secure. We use 256-bit encryption to protect your data.
                    </span>
                  </div>
                </div>
              )}
              
              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Review Your Order</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Please review your order details before placing your order.
                    </p>
                  </div>
                  
                  <div className="border-t border-b border-gray-200 py-6">
                    <h3 className="text-base font-medium text-gray-900">Order Summary</h3>
                    
                    <ul role="list" className="mt-4 divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={item.id} className="flex py-4">
                          <div className="flex-shrink-0 rounded-md border border-gray-200 overflow-hidden w-16 h-16 relative">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-contain object-center"
                            />
                          </div>
                          
                          <div className="ml-4 flex flex-1 flex-col">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                                <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Shipping Information</h3>
                      
                      <div className="mt-4 rounded-md bg-gray-50 p-4">
                        <p className="text-sm text-gray-700">
                          {formData.firstName} {formData.lastName}
                          <br />
                          {formData.address}
                          <br />
                          {formData.city}, {formData.state} {formData.zipCode}
                          <br />
                          {formData.country}
                          <br />
                          {formData.email}
                          <br />
                          {formData.phone}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-medium text-gray-900">Payment Method</h3>
                      
                      <div className="mt-4 rounded-md bg-gray-50 p-4">
                        <p className="text-sm text-gray-700">
                          {formData.cardName}
                          <br />
                          **** **** **** {formData.cardNumber.slice(-4)}
                          <br />
                          Expires: {formData.cardExpiry}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Back
                  </Button>
                ) : (
                  <Link href="/cart">
                    <Button variant="outline">
                      Back to Cart
                    </Button>
                  </Link>
                )}
                
                <Button type="submit">
                  {currentStep < steps.length ? 'Continue' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
              
              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</dd>
                </div>
                
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">
                    Shipping
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </dd>
                </div>
                
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Tax (estimated)</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatPrice(tax)}</dd>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Total</dt>
                  <dd className="text-base font-medium text-gray-900">{formatPrice(total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
} 