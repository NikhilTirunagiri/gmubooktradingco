"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MPNavbar from "@/components/mp-navbar";
import { apiClient, Listing } from "@/lib/api";

// Condition badge styling helper
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

export default function BookListing() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.listing as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getListing(listingId);
      setListing(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listing');
      console.error('Error fetching listing:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/marketplace" />
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101922]">
          <main className="flex flex-1 justify-center items-center py-5 pt-24 sm:pt-20">
            <div className="text-center">
              <p className="text-[#617589] dark:text-[#90a4b8] text-lg">Loading listing...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/marketplace" />
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101922]">
          <main className="flex flex-1 justify-center items-center py-5 pt-24 sm:pt-20">
            <div className="text-center">
              <h1 className="text-4xl font-black text-[#111418] dark:text-[#f0f2f4] mb-4">Listing Not Found</h1>
              <p className="text-[#617589] dark:text-[#90a4b8] mb-8">{error || "The listing you're looking for doesn't exist."}</p>
              <button
                onClick={() => router.push('/marketplace')}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-[#137fec] text-white text-sm font-bold hover:bg-[#0f6bd7] transition-colors"
              >
                Back to Marketplace
              </button>
            </div>
          </main>
        </div>
      </>
    );
  }

  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "https://via.placeholder.com/400x600?text=No+Image";

  return (
    <>
      <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/marketplace" />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101922]">
        <main className="flex flex-1 justify-center py-5 pt-24 sm:pt-20">
          <div className="flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-5">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/marketplace')}
                className="flex items-center gap-2 text-[#617589] dark:text-[#90a4b8] hover:text-[#137fec] dark:hover:text-[#137fec] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-sm font-medium">Back to Marketplace</span>
              </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Left Column - Book Image */}
              <div className="relative w-full">
                <div className="sticky top-24">
                  <div className="relative w-full overflow-hidden rounded-2xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] p-8">
                    <div className="relative w-full aspect-[3/4] mx-auto max-w-md">
                      <img
                        className="h-full w-full object-cover rounded-lg shadow-lg"
                        src={mainImage}
                        alt={`Cover of ${listing.book_title || 'Book'}`}
                      />
                      <div className={`absolute top-4 right-4 ${getConditionBadgeClass(listing.condition)} text-sm font-bold px-3 py-1.5 rounded-full shadow-md`}>
                        {formatCondition(listing.condition)}
                      </div>
                      {listing.type === 'rent' && (
                        <div className="absolute top-4 left-4 bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                          For Rent
                        </div>
                      )}
                    </div>
                    {/* Image Gallery */}
                    {listing.images && listing.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {listing.images.slice(0, 4).map((image, index) => (
                          <img
                            key={index}
                            className="w-full aspect-square object-cover rounded-lg border-2 border-transparent hover:border-[#137fec] transition-colors cursor-pointer"
                            src={image}
                            alt={`${listing.book_title} - Image ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Book Details */}
              <div className="flex flex-col gap-6">
                {/* Title and Author */}
                <div>
                  <h1 className="text-[#111418] dark:text-[#f0f2f4] text-4xl font-black leading-tight tracking-[-0.033em] mb-3">
                    {listing.book_title || 'Untitled'}
                  </h1>
                  <p className="text-[#617589] dark:text-[#90a4b8] text-xl font-normal">
                    by {listing.book_author || 'Unknown Author'}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <p className="text-[#111418] dark:text-[#f0f2f4] text-5xl font-black">
                    ${listing.price.toFixed(2)}
                  </p>
                  {listing.type === 'rent' && listing.rent_duration_unit && (
                    <span className="text-[#617589] dark:text-[#90a4b8] text-xl">
                      / {listing.rent_duration_value} {listing.rent_duration_unit}
                    </span>
                  )}
                  {listing.type === 'sale' && (
                    <span className="text-[#617589] dark:text-[#90a4b8] text-xl">One-time</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-2">
                  <div className="flex-1">
                    <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#137fec] text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0f6bd7] transition-colors shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Message Seller
                    </button>
                  </div>
                  <div>
                    <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#137fec] text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0f6bd7] transition-colors shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#137fec] text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0f6bd7] transition-colors shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Book Details Card */}
                <div className="rounded-xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] p-6">
                  <h2 className="text-[#111418] dark:text-[#f0f2f4] text-lg font-bold mb-4">Book Details</h2>
                  <div className="space-y-3">
                    {listing.book_isbn && (
                      <div className="flex justify-between items-center pb-3 border-b border-[#f0f2f4] dark:border-[#2a3b4d]">
                        <span className="text-[#617589] dark:text-[#90a4b8] text-sm font-medium">ISBN</span>
                        <span className="text-[#111418] dark:text-[#f0f2f4] text-sm font-bold">{listing.book_isbn}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pb-3 border-b border-[#f0f2f4] dark:border-[#2a3b4d]">
                      <span className="text-[#617589] dark:text-[#90a4b8] text-sm font-medium">Type</span>
                      <span className="text-[#111418] dark:text-[#f0f2f4] text-sm font-bold capitalize">{listing.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#617589] dark:text-[#90a4b8] text-sm font-medium">Condition</span>
                      <span className={`${getConditionBadgeClass(listing.condition)} text-xs font-bold px-3 py-1 rounded-full`}>
                        {formatCondition(listing.condition)}
                      </span>
                    </div>
                    {listing.type === 'rent' && listing.rent_duration_value && listing.rent_duration_unit && (
                      <div className="flex justify-between items-center pt-3 border-t border-[#f0f2f4] dark:border-[#2a3b4d]">
                        <span className="text-[#617589] dark:text-[#90a4b8] text-sm font-medium">Rental Duration</span>
                        <span className="text-[#111418] dark:text-[#f0f2f4] text-sm font-bold">
                          {listing.rent_duration_value} {listing.rent_duration_unit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {listing.description && (
                  <div className="rounded-xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] p-6">
                    <h2 className="text-[#111418] dark:text-[#f0f2f4] text-lg font-bold mb-3">Description</h2>
                    <p className="text-[#617589] dark:text-[#90a4b8] text-base leading-relaxed">
                      {listing.description}
                    </p>
                  </div>
                )}

                {/* Seller Information */}
                {listing.user_display_name && (
                  <div className="rounded-xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] p-6">
                    <h2 className="text-[#111418] dark:text-[#f0f2f4] text-lg font-bold mb-4">Seller Information</h2>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#137fec]/20 flex items-center justify-center">
                        <span className="text-[#137fec] text-lg font-bold">
                          {listing.user_display_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-[#111418] dark:text-[#f0f2f4] text-base font-bold">
                          {listing.user_display_name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
