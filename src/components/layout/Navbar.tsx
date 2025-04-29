"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart } from "react-icons/fi";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/products?view=categories" },
  { name: "Deals", href: "/products?view=deals" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-700 to-purple-700 shadow-md">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between text-xs text-white">
            <p className="hidden sm:block">Free shipping on orders over $50</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-indigo-200 transition-colors">Support</a>
              <a href="#" className="hover:text-indigo-200 transition-colors">Track Order</a>
              <a href="#" className="hover:text-indigo-200 transition-colors">Shipping</a>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">VortexCart</span>
            <div className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <div className="absolute inset-0 rounded-full bg-white opacity-20"></div>
                <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                  <span className="text-indigo-700 font-bold text-lg">V</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">Vortex<span className="text-indigo-200">Cart</span></span>
            </div>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <FiMenu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                pathname === item.href
                  ? "text-white border-b-2 border-white pb-1"
                  : "text-indigo-100 hover:text-white"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
          <Link 
            href="/search" 
            className="p-2 text-indigo-100 hover:text-white transition-colors"
          >
            <span className="sr-only">Search</span>
            <FiSearch className="h-5 w-5" />
          </Link>
          
          <Link 
            href="/wishlist" 
            className="p-2 text-indigo-100 hover:text-white transition-colors"
          >
            <span className="sr-only">Wishlist</span>
            <FiHeart className="h-5 w-5" />
          </Link>
          
          <Link 
            href="/cart" 
            className="relative p-2 text-indigo-100 hover:text-white transition-colors"
          >
            <span className="sr-only">Cart</span>
            <FiShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-indigo-700">
              0
            </span>
          </Link>
          
          <Link 
            href="/profile" 
            className="p-2 text-indigo-100 hover:text-white transition-colors"
          >
            <span className="sr-only">Account</span>
            <FiUser className="h-5 w-5" />
          </Link>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gradient-to-b from-indigo-700 to-purple-800 px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">VortexCart</span>
                <div className="flex items-center">
                  <div className="relative h-8 w-8 mr-2">
                    <div className="absolute inset-0 rounded-full bg-white opacity-20"></div>
                    <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                      <span className="text-indigo-700 font-bold text-lg">V</span>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-white">Vortex<span className="text-indigo-200">Cart</span></span>
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <FiX className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${
                        pathname === item.href
                          ? "text-white bg-indigo-600/50"
                          : "text-indigo-100 hover:bg-indigo-600/30 hover:text-white"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                <div className="py-6">
                  <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                    <Link 
                      href="/search" 
                      className="flex items-center gap-x-2 -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-indigo-100 hover:bg-indigo-600/30 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiSearch className="h-5 w-5" />
                      Search
                    </Link>
                    
                    <Link 
                      href="/wishlist" 
                      className="flex items-center gap-x-2 -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-indigo-100 hover:bg-indigo-600/30 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiHeart className="h-5 w-5" />
                      Wishlist
                    </Link>
                    
                    <Link 
                      href="/cart" 
                      className="flex items-center gap-x-2 -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-indigo-100 hover:bg-indigo-600/30 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="relative">
                        <FiShoppingCart className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs font-medium text-indigo-700">
                          0
                        </span>
                      </div>
                      Cart
                    </Link>
                    
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-x-2 -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-indigo-100 hover:bg-indigo-600/30 hover:text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FiUser className="h-5 w-5" />
                      Account
                    </Link>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex flex-col space-y-3 text-sm text-indigo-100">
                      <a href="#" className="hover:text-white">Help Center</a>
                      <a href="#" className="hover:text-white">Track Order</a>
                      <a href="#" className="hover:text-white">Shipping Policy</a>
                      <a href="#" className="hover:text-white">Return Policy</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 