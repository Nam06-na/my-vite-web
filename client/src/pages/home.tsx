import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import Timeline from "@/components/timeline";
import NewEntryModal from "@/components/new-entry-modal";
import { 
  BookOpen, 
  Share2, 
  Smartphone, 
  TrendingUp, 
  Github, 
  Twitter, 
  Linkedin 
} from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const scrollToTimeline = () => {
    const timelineElement = document.getElementById('timeline');
    if (timelineElement) {
      timelineElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-soft font-sans text-primary-custom">
      <Navigation onNewEntry={handleOpenModal} />
      
      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-primary-custom mb-6">
            Professional Digital Journey
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A curated collection of my professional memories, achievements, and growth milestones. 
            Share your journey with employers and showcase your development over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToTimeline}
              className="bg-secondary-custom text-white hover:bg-blue-600 transition-colors font-medium"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Timeline
            </Button>
            <Button 
              variant="outline"
              className="border-primary-custom text-primary-custom hover:bg-primary-custom hover:text-white transition-colors font-medium"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <Timeline />

      {/* Portfolio Showcase */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary-custom mb-4">Professional Portfolio Features</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Showcase your journey in a professional format designed to impress employers and colleagues</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary-custom rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-primary-custom mb-3">Growth Tracking</h3>
                <p className="text-gray-600">Visualize your professional development journey with chronological milestones and achievements.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-success-custom rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-primary-custom mb-3">Easy Sharing</h3>
                <p className="text-gray-600">Generate clean, professional portfolio links to share with potential employers and networking contacts.</p>
              </CardContent>
            </Card>

            <Card className="text-center border-gray-100">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent-custom rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-primary-custom mb-3">Mobile Optimized</h3>
                <p className="text-gray-600">Responsive design ensures your portfolio looks perfect on all devices and screen sizes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-custom text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="h-8 w-8 text-secondary-custom" />
                <h3 className="text-xl font-serif font-semibold">MyJourney</h3>
              </div>
              <p className="text-gray-300 mb-4">Professional digital diary platform for documenting your career journey and creating shareable portfolio experiences.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Timeline View</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rich Text Editor</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Portfolio Sharing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 MyJourney. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <NewEntryModal open={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
