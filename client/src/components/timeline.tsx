import { useQuery } from "@tanstack/react-query";
import EntryCard from "./entry-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Entry } from "@shared/schema";

interface TimelineProps {
  entries?: Entry[];
  isPublic?: boolean;
}

export default function Timeline({ entries: providedEntries, isPublic = false }: TimelineProps) {
  const { data: fetchedEntries, isLoading, error } = useQuery<Entry[]>({
    queryKey: ["/api/entries"],
    enabled: !providedEntries, // Only fetch if entries not provided
  });

  const entries = providedEntries || fetchedEntries;

  if (!providedEntries && isLoading) {
    return (
      <section className="py-16 bg-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-primary-custom mb-4">My Professional Timeline</h2>
            <p className="text-gray-600 text-lg">Documenting growth, achievements, and memorable moments</p>
          </div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary-custom transform md:-translate-x-0.5"></div>
            
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative mb-12 ml-8 md:ml-0">
                <div className={`md:flex md:items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute -left-9 md:left-1/2 w-4 h-4 bg-gray-300 rounded-full border-4 border-white transform md:-translate-x-1/2 shadow-lg"></div>
                  <div className={`md:w-5/12 ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <Skeleton className="h-6 w-24 mb-4" />
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!providedEntries && error) {
    return (
      <section className="py-16 bg-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-primary-custom mb-4">My Professional Timeline</h2>
          <p className="text-red-600">Failed to load entries. Please try again later.</p>
        </div>
      </section>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <section className="py-16 bg-soft">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-serif font-bold text-primary-custom mb-4">My Professional Timeline</h2>
          <p className="text-gray-600 text-lg mb-8">No entries yet. Start documenting your journey!</p>
        </div>
      </section>
    );
  }

  return (
    <section id="timeline" className="py-16 bg-soft">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-primary-custom mb-4">My Professional Timeline</h2>
          <p className="text-gray-600 text-lg">Documenting growth, achievements, and memorable moments</p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-secondary-custom transform md:-translate-x-0.5"></div>
          
          {entries.map((entry, index) => (
            <EntryCard 
              key={entry.id} 
              entry={entry} 
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
