import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Share2, Copy, Check, User, Calendar, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  className?: string;
}

export default function ShareButton({ className }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const shareOptions = [
    {
      url: "/portfolio",
      title: "Professional Portfolio",
      description: "Perfect for job applications and LinkedIn sharing",
      icon: User,
      recommended: true,
      useCase: "Best for employers and recruiters"
    },
    {
      url: "/professional-timeline", 
      title: "Career Timeline",
      description: "Chronological view of career development",
      icon: Calendar,
      recommended: true,
      useCase: "Great for performance reviews and networking"
    },
    {
      url: "/public",
      title: "Public Journal",
      description: "Standard public access to your journey",
      icon: Share2,
      recommended: false,
      useCase: "General sharing with friends and family"
    }
  ];

  const copyToClipboard = async (path: string, title: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(path);
      toast({
        title: "Professional Link Copied",
        description: `${title} URL ready to share with employers`,
      });
      setTimeout(() => setCopiedUrl(null), 3000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const openPreview = (path: string) => {
    window.open(`${window.location.origin}${path}`, '_blank');
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 ${className}`}
      >
        <Share2 className="w-4 h-4" />
        Share Journal
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Your Professional Journey</DialogTitle>
            <DialogDescription>
              Choose the perfect URL format for your audience. These professional links look trustworthy and are ideal for sharing with employers, recruiters, and professional contacts.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {shareOptions.map((option) => (
              <div key={option.url} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <option.icon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{option.title}</h3>
                        {option.recommended && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      <p className="text-xs text-blue-600 mt-1">{option.useCase}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Professional URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}${option.url}`}
                      readOnly
                      className="flex-1 text-sm font-mono"
                    />
                    <Button
                      onClick={() => copyToClipboard(option.url, option.title)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      disabled={copiedUrl === option.url}
                    >
                      {copiedUrl === option.url ? (
                        <>
                          <Check className="w-3 h-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => openPreview(option.url)}
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Why these URLs look professional:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Clean, descriptive paths that clearly indicate content</li>
                <li>• No suspicious-looking parameters or random strings</li>
                <li>• Professional terminology that employers recognize</li>
                <li>• Read-only access ensures content integrity</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowModal(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}