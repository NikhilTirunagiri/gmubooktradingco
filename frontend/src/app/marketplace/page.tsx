"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import MPNavbar from "@/components/mp-navbar";
import { apiClient, Listing } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

// Condition badge styling helper - maps backend values to display
const getConditionBadgeClass = (condition: string) => {
  switch (condition) {
    case "new":
    case "like_new":
      return "bg-[#137fec]/20 text-[#137fec]";
    case "good":
      return "bg-green-500/20 text-green-600 dark:text-green-500";
    case "acceptable":
      return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-500";
    default:
      return "bg-gray-500/20 text-gray-600";
  }
};

const formatCondition = (condition: string): string => {
  switch (condition) {
    case "new":
      return "New";
    case "like_new":
      return "Like New";
    case "good":
      return "Good";
    case "acceptable":
      return "Acceptable";
    default:
      return condition;
  }
};

export default function Marketplace() {
  const { isAuthenticated } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all'); // 'all' or 'my'
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title-asc");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [viewMode]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (viewMode === 'my' && isAuthenticated) {
        // Fetch user's own listings
        const response = await apiClient.getMyListings({ status: 'active' });
        setListings(response.listings);
      } else {
        // Fetch all listings (excluding user's own if authenticated)
        const response = await apiClient.getListings({ status: 'active' });
        setListings(response.listings);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const types = ["sale", "rent"];
  const conditions = ["new", "like_new", "good", "acceptable"];

  // Filter and sort listings
  const filteredListings = listings
    .filter((listing) => {
      const matchesSearch = searchTerm === "" || 
        (listing.book_title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (listing.book_author?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (listing.book_isbn?.includes(searchTerm) ?? false);
      
      const matchesType = selectedType === "" || listing.type === selectedType;
      const matchesCondition = selectedCondition === "" || listing.condition === selectedCondition;
      
      return matchesSearch && matchesType && matchesCondition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "title-asc":
          return (a.book_title || "").localeCompare(b.book_title || "");
        case "title-desc":
          return (b.book_title || "").localeCompare(a.book_title || "");
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <>
        <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/marketplace" />
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101922]">
          <main className="flex flex-1 justify-center items-center py-5 pt-24 sm:pt-20">
            <div className="text-center">
              <p className="text-[#617589] dark:text-[#90a4b8] text-lg">Loading listings...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/marketplace" />
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101922]">
          <main className="flex flex-1 justify-center items-center py-5 pt-24 sm:pt-20">
            <div className="text-center">
              <p className="text-[#617589] dark:text-[#90a4b8] text-lg mb-4">Error: {error}</p>
              <button
                onClick={fetchListings}
                className="px-4 py-2 bg-[#137fec] text-white rounded-lg hover:bg-[#0f6bd7] transition-colors"
              >
                Retry
              </button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/marketplace" />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101922]">
        <main className="flex flex-1 justify-center py-5 pt-24 sm:pt-20">
          <div className="flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <section className="w-full space-y-6 mb-8 pt-5">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[#111418] dark:text-[#f0f2f4] text-4xl font-black leading-tight tracking-[-0.033em]">
                    {viewMode === 'my' ? 'My Listings' : 'Browse Books'}
                  </p>
                  <p className="text-[#617589] dark:text-[#90a4b8] text-base font-normal leading-normal">Showing {filteredListings.length} results</p>
                </div>
                {isAuthenticated && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'all'
                          ? 'bg-[#137fec] text-white'
                          : 'bg-[#f0f2f4] dark:bg-[#182431] text-[#111418] dark:text-[#f0f2f4] hover:bg-[#e8eaed] dark:hover:bg-[#243647]'
                      }`}
                    >
                      All Listings
                    </button>
                    <button
                      onClick={() => setViewMode('my')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'my'
                          ? 'bg-[#137fec] text-white'
                          : 'bg-[#f0f2f4] dark:bg-[#182431] text-[#111418] dark:text-[#f0f2f4] hover:bg-[#e8eaed] dark:hover:bg-[#243647]'
                      }`}
                    >
                      My Listings
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                      <div className="text-[#617589] dark:text-[#90a4b8] flex bg-[#f0f2f4] dark:bg-[#182431] items-center justify-center pl-4 rounded-l-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111418] dark:text-[#f0f2f4] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] dark:bg-[#182431] h-full placeholder:text-[#617589] dark:placeholder:text-[#90a4b8] px-4 rounded-l-none pl-2 text-base font-normal leading-normal"
                        placeholder="Search by title, author, or ISBN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex gap-3 flex-wrap items-center flex-1">
                    {/* Type Filter */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                        className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f4] dark:bg-[#182431] pl-4 pr-3 text-[#111418] dark:text-[#f0f2f4] hover:bg-[#e8eaed] dark:hover:bg-[#243647] transition-colors"
                      >
                        <p className="text-sm font-medium leading-normal">{selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : "Type"}</p>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showTypeDropdown && (
                        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] rounded-lg shadow-lg py-2 min-w-[200px]">
                          <button onClick={() => { setSelectedType(""); setShowTypeDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">All Types</button>
                          {types.map(type => (
                            <button key={type} onClick={() => { setSelectedType(type); setShowTypeDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">{type.charAt(0).toUpperCase() + type.slice(1)}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Condition */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowConditionDropdown(!showConditionDropdown)}
                        className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f4] dark:bg-[#182431] pl-4 pr-3 text-[#111418] dark:text-[#f0f2f4] hover:bg-[#e8eaed] dark:hover:bg-[#243647] transition-colors"
                      >
                        <p className="text-sm font-medium leading-normal">{selectedCondition ? formatCondition(selectedCondition) : "Condition"}</p>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showConditionDropdown && (
                        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] rounded-lg shadow-lg py-2 min-w-[200px]">
                          <button onClick={() => { setSelectedCondition(""); setShowConditionDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">All Conditions</button>
                          {conditions.map(condition => (
                            <button key={condition} onClick={() => { setSelectedCondition(condition); setShowConditionDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">{formatCondition(condition)}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sort */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f4] dark:bg-[#182431] pl-4 pr-3 text-[#111418] dark:text-[#f0f2f4] hover:bg-[#e8eaed] dark:hover:bg-[#243647] transition-colors"
                      >
                        <p className="text-sm font-medium leading-normal">Sort By</p>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showSortDropdown && (
                        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] rounded-lg shadow-lg py-2 min-w-[200px]">
                          <button onClick={() => { setSortBy("title-asc"); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">Title (A-Z)</button>
                          <button onClick={() => { setSortBy("title-desc"); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">Title (Z-A)</button>
                          <button onClick={() => { setSortBy("price-asc"); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">Price (Low to High)</button>
                          <button onClick={() => { setSortBy("price-desc"); setShowSortDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">Price (High to Low)</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredListings.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#617589] dark:text-[#90a4b8] text-lg">No listings found</p>
                </div>
              ) : (
                filteredListings.map((listing) => (
                  <Link key={listing.id} href={`/marketplace/${listing.id}`} className="flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] group transition-shadow duration-300 hover:shadow-lg cursor-pointer">
                    <div className="relative w-full overflow-hidden rounded-lg aspect-[3/4]">
                      <img 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        src={listing.images && listing.images.length > 0 ? listing.images[0] : "https://via.placeholder.com/400x600?text=No+Image"} 
                        alt={`Cover of ${listing.book_title || 'Book'}`} 
                      />
                      <div className={`absolute top-2 right-2 ${getConditionBadgeClass(listing.condition)} text-xs font-bold px-2 py-1 rounded-full`}>
                        {formatCondition(listing.condition)}
                      </div>
                      {listing.type === 'rent' && (
                        <div className="absolute top-2 left-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold px-2 py-1 rounded-full">
                          Rent
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 gap-3">
                      <div className="flex flex-col">
                        <h3 className="font-bold text-lg text-[#111418] dark:text-[#f0f2f4]">{listing.book_title || 'Untitled'}</h3>
                        <p className="text-sm text-[#617589] dark:text-[#90a4b8]">{listing.book_author || 'Unknown Author'}</p>
                      </div>
                      <p className="font-black text-2xl text-[#111418] dark:text-[#f0f2f4]">
                        ${listing.price.toFixed(2)}
                        {listing.type === 'rent' && listing.rent_duration_unit && (
                          <span className="text-sm font-normal text-[#617589] dark:text-[#90a4b8]">/{listing.rent_duration_unit}</span>
                        )}
                      </p>
                      <div className="mt-auto w-full flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#137fec] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] group-hover:bg-[#0f6bd7] transition-colors">
                        View Details
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </section>

            <nav aria-label="Pagination" className="flex justify-center pt-10 pb-4">
              <ul className="flex items-center -space-x-px h-10 text-base">
                <li><a className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-[#617589] dark:text-[#90a4b8] bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] rounded-s-lg hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors cursor-pointer" href="#"><span className="sr-only">Previous</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></a></li>
                <li><a aria-current="page" className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-white bg-[#137fec] border border-[#137fec] hover:bg-[#0f6bd7] transition-colors cursor-pointer" href="#">1</a></li>
                <li><a className="flex items-center justify-center px-4 h-10 leading-tight text-[#617589] dark:text-[#90a4b8] bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors cursor-pointer" href="#">2</a></li>
                <li><a className="flex items-center justify-center px-4 h-10 leading-tight text-[#617589] dark:text-[#90a4b8] bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors cursor-pointer" href="#">3</a></li>
                <li><a className="flex items-center justify-center px-4 h-10 leading-tight text-[#617589] dark:text-[#90a4b8] bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] rounded-e-lg hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors cursor-pointer" href="#"><span className="sr-only">Next</span><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></a></li>
              </ul>
            </nav>
          </div>
        </main>
      </div>
    </>
  );
}
