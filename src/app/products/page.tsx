"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";
import PageWrapper from "@/components/layout/PageWrapper";
import { FiFilter, FiChevronDown, FiX } from "react-icons/fi";
import { useSearchParams, useRouter } from "next/navigation";

// Get unique categories from products
const categories = Array.from(new Set(products.map(product => product.category)));

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Filter products based on URL params
  const categoryParam = searchParams.get("category");
  const viewParam = searchParams.get("view");
  const sortParam = searchParams.get("sort") || "featured";
  
  // State for mobile filter drawer
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter products
  let filteredProducts = [...products];
  
  if (categoryParam) {
    filteredProducts = filteredProducts.filter(
      product => product.category === categoryParam
    );
  }
  
  if (viewParam === "deals") {
    filteredProducts = filteredProducts.filter(product => product.sale);
  }
  
  // Sort products
  switch (sortParam) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      // For demo, we'll just reverse the array to simulate newest
      filteredProducts.reverse();
      break;
    case "bestselling":
      // For demo, we'll sort by rating count
      filteredProducts.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
      break;
    case "rating":
      filteredProducts.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      break;
    default: // "featured" - no sorting needed
      break;
  }
  
  // Update filters
  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`/products?${params.toString()}`);
  };
  
  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {categoryParam 
                ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}`
                : viewParam === "deals" 
                  ? "Sale Items" 
                  : "All Products"}
            </h1>
            <p className="text-gray-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
          
          {/* Filter and Sort Bar */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200 pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <FiFilter className="h-4 w-4" />
                Filters
              </button>
              
              {categoryParam && (
                <div className="flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
                  {categoryParam}
                  <button onClick={() => updateFilters("category", null)}>
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {viewParam === "deals" && (
                <div className="flex items-center gap-2 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
                  On Sale
                  <button onClick={() => updateFilters("view", null)}>
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="relative inline-block text-left">
                <select
                  className="appearance-none rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={sortParam}
                  onChange={(e) => updateFilters("sort", e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="bestselling">Best Selling</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Dialog */}
          {showFilters && (
            <div className="fixed inset-0 z-40 flex lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowFilters(false)} />
              <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                    onClick={() => setShowFilters(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                
                {/* Mobile Filter Content */}
                <div className="mt-4 border-t border-gray-200">
                  <div className="px-4 py-6">
                    <h3 className="text-md font-medium text-gray-900">Categories</h3>
                    <div className="mt-4 space-y-4">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center">
                          <button
                            onClick={() => {
                              updateFilters("category", category);
                              setShowFilters(false);
                            }}
                            className={`text-sm ${
                              categoryParam === category
                                ? "font-medium text-indigo-600"
                                : "text-gray-600"
                            }`}
                          >
                            {category}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="px-4 py-6 border-t border-gray-200">
                    <h3 className="text-md font-medium text-gray-900">Special</h3>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            updateFilters("view", "deals");
                            setShowFilters(false);
                          }}
                          className={`text-sm ${
                            viewParam === "deals"
                              ? "font-medium text-indigo-600"
                              : "text-gray-600"
                          }`}
                        >
                          Sale Items
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Desktop Filters & Products */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <div className="divide-y divide-gray-200">
                <div className="pb-6">
                  <h3 className="text-lg font-medium text-gray-900">Categories</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateFilters("category", null)}
                        className={`text-sm ${
                          !categoryParam ? "font-medium text-indigo-600" : "text-gray-600"
                        }`}
                      >
                        All Products
                      </button>
                    </div>
                    {categories.map((category) => (
                      <div key={category} className="flex items-center">
                        <button
                          onClick={() => updateFilters("category", category)}
                          className={`text-sm ${
                            categoryParam === category
                              ? "font-medium text-indigo-600"
                              : "text-gray-600"
                          }`}
                        >
                          {category}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="py-6">
                  <h3 className="text-lg font-medium text-gray-900">Special</h3>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => updateFilters("view", viewParam === "deals" ? null : "deals")}
                        className={`text-sm ${
                          viewParam === "deals"
                            ? "font-medium text-indigo-600"
                            : "text-gray-600"
                        }`}
                      >
                        Sale Items
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products */}
            <div className="lg:col-span-3">
              <ProductGrid products={filteredProducts} columns={3} />
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
} 