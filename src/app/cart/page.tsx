"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import PageWrapper from "@/components/layout/PageWrapper";
import { useCartStore } from "@/store/useCartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCartStore();
  
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
  
  // Check if cart is empty
  const isEmpty = items.length === 0;
  
  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        
        {isEmpty ? (
          <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-gray-100 p-6">
              <FiShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="mt-6 text-xl font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">
              Looks like you haven't added anything to your cart yet.
            </p>
            <div className="mt-8">
              <Button href="/products" size="lg">
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <ul role="list" className="divide-y divide-gray-200 border-b border-t">
                {items.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="flex-shrink-0 rounded-md border border-gray-200 overflow-hidden w-24 h-24 relative">
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
                          <h3 className="text-base font-medium text-gray-900">
                            <Link href={`/products/${item.id}`}>{item.title}</Link>
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">SKU-{item.id}</p>
                        </div>
                        <p className="text-right font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="rounded-md border border-gray-300 p-1 disabled:opacity-50"
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="text-gray-500 w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="rounded-md border border-gray-300 p-1"
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
                        >
                          <FiTrash2 className="mr-1 h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 flex justify-between">
                <Link
                  href="/products"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  ← Continue Shopping
                </Link>
                
                <button
                  onClick={clearCart}
                  className="text-sm font-medium text-red-600 hover:text-red-500 flex items-center"
                >
                  <FiTrash2 className="mr-1 h-4 w-4" />
                  Clear Cart
                </button>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                
                <dl className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</dd>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt className="flex items-center text-sm text-gray-600">
                      <span>Shipping</span>
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
                
                <div className="mt-6">
                  <Button href="/checkout" className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    Free shipping on orders over $50
                  </p>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-900">We accept</p>
                <div className="mt-2 flex space-x-2">
                  <div className="rounded-md bg-gray-100 p-2">
                    <Image
                      src="https://fakestoreapi.com/icons/visa.png"
                      alt="Visa"
                      width={40}
                      height={24}
                      className="h-6 w-auto"
                    />
                  </div>
                  <div className="rounded-md bg-gray-100 p-2">
                    <Image
                      src="https://fakestoreapi.com/icons/mastercard.png"
                      alt="Mastercard"
                      width={40}
                      height={24}
                      className="h-6 w-auto"
                    />
                  </div>
                  <div className="rounded-md bg-gray-100 p-2">
                    <Image
                      src="https://fakestoreapi.com/icons/paypal.png"
                      alt="PayPal"
                      width={40}
                      height={24}
                      className="h-6 w-auto"
                    />
                  </div>
                  <div className="rounded-md bg-gray-100 p-2">
                    <Image
                      src="https://fakestoreapi.com/icons/amex.png"
                      alt="American Express"
                      width={40}
                      height={24}
                      className="h-6 w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
} 