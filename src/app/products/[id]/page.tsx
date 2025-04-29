"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiChevronRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";
import PageWrapper from "@/components/layout/PageWrapper";
import { toast } from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Find the product by ID
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <PageWrapper>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Product Not Found</h1>
            <p className="mt-4 text-gray-500">The product you are looking for does not exist.</p>
            <div className="mt-8">
              <Button href="/products">Browse All Products</Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);
  
  // Get discounted price if on sale
  const discountedPrice = product.discount 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(product.price * (1 - product.discount / 100))
    : null;
  
  // Find related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  const handleAddToCart = () => {
    toast.success(`${product.title} added to cart!`);
    // Here we would typically dispatch to a cart store
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted 
      ? `${product.title} removed from wishlist` 
      : `${product.title} added to wishlist`
    );
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      }).catch(err => {
        console.error('Could not share', err);
      });
    } else {
      toast.success('Link copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };
  
  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="flex items-center">
              <FiChevronRight className="h-4 w-4 text-gray-400" />
              <Link 
                href="/products" 
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <FiChevronRight className="h-4 w-4 text-gray-400" />
              <Link 
                href={`/products?category=${product.category}`} 
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {product.category}
              </Link>
            </li>
            <li className="flex items-center">
              <FiChevronRight className="h-4 w-4 text-gray-400" />
              <span className="ml-2 text-gray-900 font-medium">{product.title}</span>
            </li>
          </ol>
        </nav>
        
        {/* Product Detail */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              className="object-contain object-center"
            />
            {product.sale && (
              <div className="absolute left-4 top-4 z-10 bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                SALE
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{product.title}</h1>
              <p className="mt-1 text-sm text-gray-500 capitalize">{product.category}</p>
            </div>
            
            {/* Pricing */}
            <div className="flex items-center gap-2">
              {discountedPrice ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">{discountedPrice}</span>
                  <span className="text-lg text-gray-500 line-through">{formattedPrice}</span>
                  <span className="ml-2 text-sm font-semibold text-green-600">{product.discount}% OFF</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">{formattedPrice}</span>
              )}
            </div>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating.rate)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
                  </span>
                </div>
              </div>
            )}
            
            {/* Description */}
            <div>
              <h2 className="text-sm font-medium text-gray-900">Description</h2>
              <p className="mt-2 text-sm text-gray-500">{product.description}</p>
            </div>
            
            {/* Quantity */}
            <div>
              <h2 className="text-sm font-medium text-gray-900">Quantity</h2>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-md border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button 
                onClick={handleAddToCart} 
                className="flex-1"
                size="lg"
              >
                <FiShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <Button 
                onClick={toggleWishlist} 
                variant="outline" 
                className="flex items-center justify-center"
              >
                <FiHeart 
                  className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} 
                />
              </Button>
              
              <Button 
                onClick={handleShare} 
                variant="outline" 
                className="flex items-center justify-center"
              >
                <FiShare2 className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">Availability:</span>
                <span className="text-sm text-green-600">In Stock</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">SKU:</span>
                <span className="text-sm text-gray-500">SKU-{product.id}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 mb-8">You might also like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </PageWrapper>
  );
} 