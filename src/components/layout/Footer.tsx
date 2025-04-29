import Link from "next/link";
import Image from "next/image";
import { FiGithub, FiTwitter, FiInstagram, FiFacebook, FiMail, FiMapPin, FiPhone } from "react-icons/fi";

const navigation = {
  shop: [
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/products?view=categories" },
    { name: "New Arrivals", href: "/products?sort=newest" },
    { name: "Bestsellers", href: "/products?sort=bestselling" },
    { name: "Deals", href: "/products?view=deals" },
  ],
  account: [
    { name: "Sign In", href: "/auth/signin" },
    { name: "Register", href: "/auth/register" },
    { name: "Order History", href: "/profile/orders" },
    { name: "My Account", href: "/profile" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "FAQs", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: FiFacebook,
    },
    {
      name: "Instagram",
      href: "#",
      icon: FiInstagram,
    },
    {
      name: "Twitter",
      href: "#",
      icon: FiTwitter,
    },
    {
      name: "GitHub",
      href: "#",
      icon: FiGithub,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      
      {/* Newsletter Section with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:flex-1 md:max-w-xl">
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Join our community
              </h3>
              <p className="mt-3 text-sm text-indigo-100 sm:text-base">
                Subscribe to our newsletter and be the first to know about new products, exclusive offers, and special discounts.
              </p>
            </div>
            <form className="mt-6 sm:flex sm:max-w-md md:mt-0">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="w-full min-w-0 appearance-none rounded-l-md border-0 bg-white px-4 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 sm:w-64 sm:text-sm"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  className="mt-3 flex w-full items-center justify-center rounded-r-md bg-white px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none sm:mt-0 sm:w-auto"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-16 sm:pt-20 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-12">
          <div className="space-y-8">
            <div>
              <Link href="/" className="flex items-center">
                <div className="relative h-10 w-10 mr-2">
                  <div className="absolute inset-0 rounded-full bg-indigo-600 opacity-90"></div>
                  <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                    <span className="text-indigo-700 font-bold text-lg">V</span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900">Vortex<span className="text-indigo-600">Cart</span></span>
              </Link>
              <p className="mt-3 text-base leading-6 text-gray-600">
                Your premier destination for curated premium products.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <FiMapPin className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <span className="ml-3 text-base text-gray-600">123 Commerce St, Shopville, SV 12345</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <span className="ml-3 text-base text-gray-600">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <FiMail className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                <span className="ml-3 text-base text-gray-600">support@vortexcart.com</span>
              </div>
            </div>
            
            <div className="flex space-x-5">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-semibold leading-6 text-indigo-600">Shop</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.shop.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-indigo-600 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-base font-semibold leading-6 text-indigo-600">Account</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.account.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-indigo-600 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-base font-semibold leading-6 text-indigo-600">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-indigo-600 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-base font-semibold leading-6 text-indigo-600">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {navigation.company.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="text-sm leading-6 text-gray-600 hover:text-indigo-600 transition-colors">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-sm leading-5 text-gray-500">
            &copy; {new Date().getFullYear()} VortexCart. All rights reserved.
          </p>
          <div className="mt-4 flex space-x-6 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 