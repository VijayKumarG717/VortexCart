import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/components/ui/Banner";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";
import PageWrapper from "@/components/layout/PageWrapper";
import { FiTruck, FiCreditCard, FiRefreshCw, FiHeadphones, FiStar, FiShield, FiPocket } from "react-icons/fi";

export default function Home() {
  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);
  
  // Get sale products
  const saleProducts = products.filter(product => product.sale).slice(0, 4);
  
  // Get products by category (electronics for this example)
  const electronicsProducts = products.filter(product => product.category === 'electronics').slice(0, 4);
  
  // Categories for display
  const categories = [
    { 
      name: "Men's Clothing", 
      slug: "men's clothing", 
      image: products.find(p => p.category === "men's clothing")?.image || "",
      featured: true 
    },
    { 
      name: "Women's Clothing", 
      slug: "women's clothing", 
      image: products.find(p => p.category === "women's clothing")?.image || "",
      featured: true 
    },
    { 
      name: "Jewelry", 
      slug: "jewelery", 
      image: products.find(p => p.category === "jewelery")?.image || "",
      featured: false 
    },
    { 
      name: "Electronics", 
      slug: "electronics", 
      image: products.find(p => p.category === "electronics")?.image || "",
      featured: true 
    },
  ];
  
  return (
    <PageWrapper>
      {/* Hero Banner */}
      <Banner 
        title="Elevate Your Shopping Experience"
        subtitle="Discover our curated collection of premium products tailored for your lifestyle"
        imageSrc="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        primaryButtonText="Shop Now"
        primaryButtonHref="/products"
        secondaryButtonText="Discover More"
        secondaryButtonHref="/about"
        theme="dark"
      />
      
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl font-medium text-indigo-600 mb-2">Why Choose Us</h2>
            <p className="text-3xl font-bold text-gray-900">The VortexCart Experience</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300"></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white group-hover:bg-indigo-700 transition-colors duration-300">
                <FiTruck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Free Express Shipping</h3>
              <p className="mt-2 text-sm text-gray-600">Enjoy free express shipping on all orders over $50, delivered right to your doorstep</p>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300"></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white group-hover:bg-indigo-700 transition-colors duration-300">
                <FiShield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Secure Payments</h3>
              <p className="mt-2 text-sm text-gray-600">Shop with confidence with our encrypted checkout process and multiple payment options</p>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300"></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white group-hover:bg-indigo-700 transition-colors duration-300">
                <FiRefreshCw className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Easy Returns</h3>
              <p className="mt-2 text-sm text-gray-600">Not satisfied? Return within 30 days for a full refund with our hassle-free return policy</p>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 transform rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors duration-300"></div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white group-hover:bg-indigo-700 transition-colors duration-300">
                <FiHeadphones className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Premium Support</h3>
              <p className="mt-2 text-sm text-gray-600">Our dedicated customer support team is available 24/7 to assist with any questions</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-medium text-indigo-600 mb-1">Curated Selection</h2>
              <p className="text-3xl font-bold tracking-tight text-gray-900">Featured Products</p>
            </div>
            <Link href="/products" className="group inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All
              <svg className="ml-1 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
      
      {/* Sale Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 rounded-lg mx-4 sm:mx-6 lg:mx-8 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white"></div>
          <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-white"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-medium mb-4">Limited Time Offer</div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Flash Sale! Up to 50% Off
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-indigo-100">
              Discover incredible savings on premium products. Hurry, while supplies last!
            </p>
            <div className="mt-10">
              <Button 
                href="/products?view=deals" 
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
              >
                <FiStar className="h-5 w-5 mr-2" />
                Shop Sale
              </Button>
            </div>
            
            {/* Countdown Timer - For visual effect only */}
            <div className="mt-12 flex justify-center space-x-4">
              <div className="w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center border border-white/20">
                <span className="text-xl font-bold text-white">13</span>
                <span className="text-xs text-indigo-200">Days</span>
              </div>
              <div className="w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center border border-white/20">
                <span className="text-xl font-bold text-white">08</span>
                <span className="text-xs text-indigo-200">Hours</span>
              </div>
              <div className="w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center border border-white/20">
                <span className="text-xl font-bold text-white">45</span>
                <span className="text-xs text-indigo-200">Minutes</span>
              </div>
              <div className="w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center border border-white/20">
                <span className="text-xl font-bold text-white">22</span>
                <span className="text-xs text-indigo-200">Seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Sale Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-medium text-indigo-600 mb-1">Special Offers</h2>
              <p className="text-3xl font-bold tracking-tight text-gray-900">On Sale</p>
            </div>
            <Link href="/products?view=deals" className="group inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All Deals
              <svg className="ml-1 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <ProductGrid products={saleProducts} columns={4} />
        </div>
      </section>
      
      {/* Shop by Category */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl font-medium text-indigo-600 mb-1">Collections</h2>
            <p className="text-3xl font-bold tracking-tight text-gray-900">Shop by Category</p>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Explore our wide selection of products across various categories designed to meet your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link 
                key={category.slug} 
                href={`/products?category=${category.slug}`} 
                className="group relative overflow-hidden rounded-xl bg-white shadow transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent transition-opacity duration-300 group-hover:opacity-80"></div>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100">
                      Shop Now
                      <svg className="ml-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  
                  {category.featured && (
                    <div className="absolute top-3 left-3 bg-indigo-600 rounded-full px-3 py-1 text-xs text-white font-medium shadow-md">
                      Featured
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Electronics Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl font-medium text-indigo-600 mb-1">Tech Essentials</h2>
              <p className="text-3xl font-bold tracking-tight text-gray-900">Electronics</p>
            </div>
            <Link href="/products?category=electronics" className="group inline-flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View All Electronics
              <svg className="ml-1 h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <ProductGrid products={electronicsProducts} columns={4} />
        </div>
      </section>
      
      {/* Brand Promise */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-16 sm:p-16 overflow-hidden relative">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/5"></div>
            
            <div className="relative mx-auto max-w-2xl text-center">
              <FiPocket className="mx-auto h-12 w-12 text-white opacity-90 mb-6" />
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Our Promise To You
              </h2>
              <p className="mx-auto mt-6 text-lg leading-8 text-indigo-100">
                At VortexCart, we're committed to providing exceptional quality, value, and service. Your satisfaction is our top priority.
              </p>
              <div className="mt-10 flex items-center justify-center gap-6">
                <Button 
                  href="/about" 
                  className="bg-white text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  Learn About Us
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 transition-colors"
                  size="lg"
                >
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
