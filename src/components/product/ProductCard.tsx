"use client";

import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating?: {
    rate: number;
    count: number;
  };
  sale?: boolean;
  discount?: number;
}

export function ProductCard({
  id,
  title,
  price,
  image,
  category,
  rating,
  sale = false,
  discount = 0,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
  
  const discountedPrice = discount > 0 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price * (1 - discount / 100))
    : null;
  
  const handleAddToCart = () => {
    toast.success(`${title} added to cart!`);
    // Here we would typically dispatch to a cart store
  };
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted 
      ? `${title} removed from wishlist` 
      : `${title} added to wishlist`
    );
    // Here we would typically dispatch to a wishlist store
  };
  
  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Quick Actions */}
      <div className={`absolute right-2 top-2 z-10 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={toggleWishlist}
          className="rounded-full bg-white/90 p-2 text-gray-700 transition-all hover:bg-white hover:text-rose-500 hover:shadow-md"
          aria-label="Add to wishlist"
        >
          <FiHeart 
            className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} 
          />
        </button>
        
        <Link
          href={`/products/${id}`}
          className="rounded-full bg-white/90 p-2 text-gray-700 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-md"
          aria-label="Quick view"
        >
          <FiEye className="h-4 w-4" />
        </Link>
      </div>
      
      {/* Sale Badge */}
      {sale && (
        <div className="absolute left-0 top-3 z-10 bg-gradient-to-r from-red-500 to-rose-500 py-1 pl-2 pr-3 text-xs font-semibold text-white shadow-sm rounded-r-full">
          SALE
        </div>
      )}
      
      {/* Discount Badge */}
      {discount > 0 && !sale && (
        <div className="absolute left-0 top-3 z-10 bg-gradient-to-r from-green-500 to-emerald-500 py-1 pl-2 pr-3 text-xs font-semibold text-white shadow-sm rounded-r-full">
          {discount}% OFF
        </div>
      )}
      
      {/* Product Image */}
      <Link href={`/products/${id}`} className="block overflow-hidden pt-4 px-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        <p className="mb-1 text-xs font-medium text-indigo-600 uppercase tracking-wider">{category}</p>
        <Link href={`/products/${id}`} className="block group-hover:text-indigo-600 transition-colors">
          <h3 className="mb-2 text-sm font-medium text-gray-900 line-clamp-1">{title}</h3>
        </Link>
        
        {/* Rating */}
        {rating && (
          <div className="mb-3 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(rating.rate) ? 'text-amber-400' : 'text-gray-200'
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">({rating.count})</span>
          </div>
        )}
        
        {/* Price */}
        <div className="mb-4 flex items-center">
          {discount > 0 ? (
            <>
              <span className="text-lg font-bold text-gray-900">{discountedPrice}</span>
              <span className="ml-2 text-sm text-gray-400 line-through">{formattedPrice}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">{formattedPrice}</span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors"
          size="sm"
        >
          <FiShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
} 