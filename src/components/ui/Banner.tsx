"use client";

import { Button } from "@/components/ui/Button";
import Image from "next/image";

interface BannerProps {
  title: string;
  subtitle?: string;
  imageSrc: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  secondaryButtonText?: string;
  secondaryButtonHref?: string;
  imagePosition?: "left" | "right";
  theme?: "light" | "dark";
  overlayColor?: string;
}

export function Banner({
  title,
  subtitle,
  imageSrc,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
  imagePosition = "right",
  theme = "light",
  overlayColor = "from-indigo-900/80 to-purple-900/70",
}: BannerProps) {
  const textColorClass = theme === "dark" ? "text-white" : "text-white";
  const textColorSecondary = theme === "dark" ? "text-gray-200" : "text-indigo-100";
  
  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r ${overlayColor}`}></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className={`${imagePosition === "left" ? "lg:ml-auto lg:mr-0" : "lg:mr-auto lg:ml-0"} max-w-2xl`}>
          <div className="animate-fade-in-up">
            <h1 className={`text-3xl font-bold sm:text-4xl lg:text-5xl xl:text-6xl ${textColorClass} tracking-tight`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-6 text-lg ${textColorSecondary} max-w-xl`}>
                {subtitle}
              </p>
            )}
            {(primaryButtonText || secondaryButtonText) && (
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-start">
                {primaryButtonText && (
                  <Button
                    href={primaryButtonHref}
                    size="lg"
                    className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {primaryButtonText}
                  </Button>
                )}
                {secondaryButtonText && (
                  <Button
                    href={secondaryButtonHref}
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10 transition-all duration-300"
                  >
                    {secondaryButtonText}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-r from-white/10 to-transparent"></div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-3xl"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl"></div>
    </div>
  );
} 