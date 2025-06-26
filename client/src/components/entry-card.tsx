import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Trash2 } from "lucide-react";
import { formatDate, getReadingTime, getCategoryColor } from "@/lib/utils";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import type { Entry } from "@shared/schema";

interface EntryCardProps {
  entry: Entry;
  isLeft?: boolean;
}

export default function EntryCard({ entry, isLeft = false }: EntryCardProps) {
  const readingTime = getReadingTime(entry.content);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, isAdmin } = useAuth();

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/entries/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Success",
        description: "Entry deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this entry? This action cannot be undone.")) {
      deleteEntryMutation.mutate(entry.id);
    }
  };
  
  return (
    <div className="relative mb-12 ml-8 md:ml-0">
      <div className={`md:flex md:items-center ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
        {/* Timeline Dot */}
        <div className={`absolute -left-9 md:left-1/2 w-4 h-4 rounded-full border-4 border-white transform md:-translate-x-1/2 shadow-lg ${getCategoryColor(entry.category).replace('text-white', '').replace('bg-', 'bg-')}`}></div>
        
        {/* Content Card */}
        <div className={`md:w-5/12 ${isLeft ? 'md:mr-auto' : 'md:ml-auto'}`}>
          <Card className="bg-white hover:shadow-md transition-shadow border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(entry.category)}>
                    {entry.category}
                  </Badge>
                  <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                </div>
                {isAuthenticated && isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleteEntryMutation.isPending}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* Image Display */}
              {entry.image && (
                <div className="mb-4">
                  <img
                    src={entry.image}
                    alt={entry.title}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
              
              <h3 className="text-xl font-serif font-semibold text-primary-custom mb-3">
                {entry.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {entry.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{readingTime} min read</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{entry.category}</span>
                </div>
                <Link href={`/entry/${entry.id}`}>
                  <Button variant="ghost" className="text-secondary-custom hover:text-blue-600 text-sm font-medium p-0">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
