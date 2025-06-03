import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExpertCard from "@/components/expert/ExpertCard";
import ExpertSearch from "@/components/expert/ExpertSearch";
import { mockExperts } from "@/data/mockData";
import { Expert } from "@/types";

interface SearchFilters {
  query: string;
  expertise: string[];
  experience: string;
  rating: string;
  availability: string;
}

const ExpertDirectory = () => {
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>(mockExperts);

  const handleSearch = (filters: SearchFilters) => {
    let filtered = mockExperts;

    // Filter by search query
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(
        (expert) =>
          expert.name.toLowerCase().includes(query) ||
          expert.title.toLowerCase().includes(query) ||
          expert.company.toLowerCase().includes(query) ||
          expert.expertise.some((skill) => skill.toLowerCase().includes(query)),
      );
    }

    // Filter by expertise
    if (filters.expertise.length > 0) {
      filtered = filtered.filter((expert) =>
        filters.expertise.some((skill) => expert.expertise.includes(skill)),
      );
    }

    // Filter by experience
    if (filters.experience) {
      const [min, max] = filters.experience.includes("+")
        ? [parseInt(filters.experience), Infinity]
        : filters.experience.split("-").map(Number);

      filtered = filtered.filter(
        (expert) =>
          expert.experience >= min &&
          (max === undefined || expert.experience <= max),
      );
    }

    // Filter by rating
    if (filters.rating) {
      const minRating = parseFloat(filters.rating.replace("+", ""));
      filtered = filtered.filter((expert) => expert.rating >= minRating);
    }

    setFilteredExperts(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userType="employee" />

      <main className="container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Expert Directory</h1>
            <p className="text-lg text-muted-foreground">
              Browse our network of experienced mentors and find the perfect
              match for your development goals.
            </p>
          </div>

          {/* Search and Filters */}
          <ExpertSearch onSearch={handleSearch} />

          {/* Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                {filteredExperts.length} expert
                {filteredExperts.length !== 1 ? "s" : ""} found
              </p>

              {/* Sort options could go here */}
            </div>

            {filteredExperts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No experts found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or removing some filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperts.map((expert) => (
                  <ExpertCard key={expert.id} expert={expert} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExpertDirectory;
