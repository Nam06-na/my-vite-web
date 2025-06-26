import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    "Achievement": "bg-secondary-custom text-white",
    "Career Milestone": "bg-success-custom text-white", 
    "Learning Experience": "bg-accent-custom text-white",
    "Project Launch": "bg-secondary-custom text-white",
    "Personal Growth": "bg-primary-custom text-white"
  };
  return colors[category] || "bg-gray-500 text-white";
}
