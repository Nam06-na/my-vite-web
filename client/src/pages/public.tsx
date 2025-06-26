import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Timeline from "@/components/timeline";
import { BookOpen, Eye, User, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PublicPage() {
  const [location] = useLocation();
  
  // Determine API endpoint and display content based on URL
  const getApiEndpoint = () => {
    if (location === "/portfolio") {
      return "/api/portfolio/entries";
    } else if (location === "/professional-timeline") {
      return "/api/timeline/entries";
    }
    return "/api/public/entries";
  };

  const getPageConfig = () => {
    if (location === "/portfolio") {
      return {
        title: "Professional Portfolio",
        subtitle: "Showcasing achievements and career highlights",
        description: "A comprehensive portfolio showcasing professional achievements, skills development, and career milestones",
        badgeText: "Portfolio View",
        badgeIcon: User
      };
    } else if (location === "/professional-timeline") {
      return {
        title: "Professional Timeline",
        subtitle: "Career development and growth journey",
        description: "A chronological view of professional growth, achievements, and career milestones over time",
        badgeText: "Timeline View",
        badgeIcon: Calendar
      };
    }
    return {
      title: "Professional Journey",
      subtitle: "Professional Development Timeline",
      description: "A collection of achievements, learnings, and milestones documenting professional growth and career development",
      badgeText: "Public View",
      badgeIcon: Eye
    };
  };

  const config = getPageConfig();
  const { data: publicData, isLoading, error } = useQuery({
    queryKey: [getApiEndpoint()],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-custom mx-auto mb-4"></div>
          <p className="text-gray-600">Loading journal entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Journal</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  const entries = publicData?.entries || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Public Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-secondary-custom" />
              <div>
                <h1 className="text-xl font-serif font-semibold text-primary-custom">MyJourney</h1>
                <p className="text-xs text-gray-500">{config.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <config.badgeIcon className="w-3 h-3" />
                {config.badgeText}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-custom mb-6">
            {config.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {config.description}
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {entries.length} Entries
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Public Access
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Read Only
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary-custom mb-4">
              Timeline of Growth
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow the journey through achievements, challenges overcome, and lessons learned along the way.
            </p>
          </div>
          
          {entries.length > 0 ? (
            <Timeline entries={entries} isPublic={true} />
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Entries Yet</h3>
              <p className="text-gray-600">
                This journal is just getting started. Check back later for updates!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            This is a public view of a professional development journal. 
            <br />
            All content is read-only and cannot be modified by visitors.
          </p>
        </div>
      </footer>
    </div>
  );
}