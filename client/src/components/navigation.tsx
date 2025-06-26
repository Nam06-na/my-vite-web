import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Menu, LogIn, LogOut, Settings } from "lucide-react";
import { Link } from "wouter";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import LoginModal from "./login-modal";
import ShareButton from "./share-button";

interface NavigationProps {
  onNewEntry: () => void;
}

export default function Navigation({ onNewEntry }: NavigationProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const logoutMutation = useLogout();
  const { toast } = useToast();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "setup">("login");

  const handleLogin = () => {
    setLoginMode("login");
    setShowLoginModal(true);
  };

  const handleSetup = () => {
    setLoginMode("setup");
    setShowLoginModal(true);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "There was an error logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
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
              
              {!isLoading && (
                <>
                  <ShareButton />
                  {isAuthenticated && isAdmin ? (
                    <>
                      <Button 
                        onClick={onNewEntry}
                        className="bg-secondary-custom text-white hover:bg-blue-600 transition-colors font-medium"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Entry
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleLogin}
                        className="flex items-center gap-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Login
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleSetup}
                        className="flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Setup
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <Button variant="ghost" className="md:hidden text-primary-custom">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <LoginModal 
        open={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        mode={loginMode}
      />
    </>
  );
}
