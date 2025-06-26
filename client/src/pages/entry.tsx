import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { formatDate, getReadingTime, getCategoryColor } from "@/lib/utils";
import type { Entry } from "@shared/schema";

export default function EntryPage() {
  const { id } = useParams();
  
  const { data: entry, isLoading, error } = useQuery<Entry>({
    queryKey: [`/api/entries/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-10 w-24 mb-8" />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-6" />
            <div className="flex items-center space-x-4 mb-8">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Timeline
            </Button>
          </Link>
          <Card className="bg-white">
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-serif font-bold text-primary-custom mb-4">Entry Not Found</h1>
              <p className="text-gray-600 mb-6">The entry you're looking for doesn't exist or has been removed.</p>
              <Link href="/">
                <Button className="bg-secondary-custom text-white hover:bg-blue-600">
                  Return to Timeline
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const readingTime = getReadingTime(entry.content);

  return (
    <div className="min-h-screen bg-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8 text-primary-custom hover:text-secondary-custom">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timeline
          </Button>
        </Link>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="p-8 lg:p-12">
            <div className="mb-6">
              <Badge className={getCategoryColor(entry.category)}>
                {entry.category}
              </Badge>
            </div>

            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-primary-custom mb-6 leading-tight">
              {entry.title}
            </h1>

            {/* Entry Image */}
            {entry.image && (
              <div className="mb-8">
                <img
                  src={entry.image}
                  alt={entry.title}
                  className="w-full max-h-96 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(entry.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{readingTime} min read</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span>{entry.category}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link href="/">
                <Button className="bg-secondary-custom text-white hover:bg-blue-600">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Timeline
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
