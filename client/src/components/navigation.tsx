import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Menu } from "lucide-react";
import { Link } from "wouter";

interface NavigationProps {
  onNewEntry: () => void;
}

export default function Navigation({ onNewEntry }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <BookOpen className="h-8 w-8 text-secondary-custom" />
              <h1 className="text-xl font-serif font-semibold text-primary-custom">MyJourney</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/#timeline" className="text-primary-custom hover:text-secondary-custom transition-colors font-medium">
              Timeline
            </Link>
            <a href="#about" className="text-primary-custom hover:text-secondary-custom transition-colors font-medium">About</a>
            <a href="#contact" className="text-primary-custom hover:text-secondary-custom transition-colors font-medium">Contact</a>
            <Button 
              onClick={onNewEntry}
              className="bg-secondary-custom text-white hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
          
          <Button variant="ghost" className="md:hidden text-primary-custom">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
