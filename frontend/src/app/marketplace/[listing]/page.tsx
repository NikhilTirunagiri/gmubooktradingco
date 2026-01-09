"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MPNavbar from "@/components/mp-navbar";

// Book interface for type safety
interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  condition: "Like New" | "Used" | "Good";
  image: string;
  genre: string;
  courseCode: string;
  isbn: string;
  description: string;
  seller: {
    name: string;
    rating: number;
    totalTrades: number;
  };
}

// Sample book data (in a real app, this would come from an API)
const sampleBooks: Book[] = [
  {
    id: 1,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    price: 45.00,
    condition: "Like New",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjsN8j2KrMYUP2WvP1lWPnS35d4VWsK6taLNOCqQc7hIONgidvbfcH6gAAwU32lMJKsQGf7ZkuJICcgPVFu37xekzjyOSDQY3ojB6NSIK6eFLF4WzcDbDKrlS_TfeBs2Hw5jMsWe2NtOnYL4_nCOQmDaDJB71Y0OVC0Q-rlT7QqkCJreRIJDkLWGfec4JihrYq7Fpt13WpgRKxegLaUT7WUpsHmIU09pxvtnvl11HoFC4VzP-l0GuUihl1BN912-Cdrx9LKQjQEd0",
    genre: "Economics",
    courseCode: "ECON 101",
    isbn: "9780538453059",
    description: "A comprehensive introduction to economics that covers both microeconomic and macroeconomic principles. This edition includes updated real-world examples and case studies. The book is in excellent condition with minimal highlighting and no torn pages.",
    seller: {
      name: "Sarah Johnson",
      rating: 4.8,
      totalTrades: 23
    }
  },
  {
    id: 2,
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    price: 80.00,
    condition: "Used",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRtpkLWeops74rWazNYUykAGkRxR3R99YN0yH2uV0KHPJUZBMy7XLPn1bwdtWlWwkWYgb0oQnC_N0PcvnVsQBIKQ8tXhokEYMWCNywqaJ9ByP6ua8vQ_CEvlQ9gVQMilfx9hCqHN-4qmq-shRHW_z5yV6ZCDfWN0Ed_DRv2kGcwY7MjGb07Xntw4jEo8AIvDy2cNI3a2yFar-NPLzXxD4xGOhLdJHLx6TEKjJZsJseB8MOPfoEERm9QJY-e5-ye-B-q_QBlWrTAi8",
    genre: "Chemistry",
    courseCode: "CHEM 211",
    isbn: "9780134042282",
    description: "Essential organic chemistry textbook with clear explanations and practice problems. Some highlighting and notes in margins. Cover shows normal wear but all pages intact.",
    seller: {
      name: "Michael Chen",
      rating: 4.9,
      totalTrades: 45
    }
  },
  {
    id: 3,
    title: "Intro to Algorithms",
    author: "Thomas H. Cormen",
    price: 62.50,
    condition: "Like New",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQtDxrKkgd6MZVjxOhNiQRaMGlJLi9ABOWyPZXBqFtkf-jUZ7jectiFka4dQmc7sPlkr-0fCsR70RGBX8l_zjZCmUcRvOZPoIMFrvzZ98xF7bjOXqvHH612doI1ku4sK5JCAdcFvOfbrqwd5Zm6JKMCk-j26mZSlVIcBsd-mptAtcLxkXnu9HFEcSxdMSzpMjmv0BggRSGWs75HCe6g7c_DFu_Lz77G_yESmUvYtOvQTHopogOFdxdQSuRCoYOirgu0e-ZK7EZAGU",
    genre: "Computer Science",
    courseCode: "CS 310",
    isbn: "9780262033848",
    description: "The definitive guide to algorithms and data structures. Barely used, like new condition. Perfect for CS students. Includes comprehensive coverage of algorithms with mathematical analysis.",
    seller: {
      name: "Alex Rivera",
      rating: 5.0,
      totalTrades: 12
    }
  },
  {
    id: 4,
    title: "The Design of Everyday Things",
    author: "Don Norman",
    price: 15.00,
    condition: "Good",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKnTtIdKKCvJEfM7fRrEx5iNXnOtFJ4CRPeuF6Cs66mKwYT2a0daKYLPtjmuNQIyAChemOsQIEdXPAwPWI5NiU_iP5AXfAkV5d8aHsrX8oF09WST8Jm7lDCctMul-UyJmWhPS5P-KiBMYdvEd5Amu7cFogTsaOSAxv_lIC1MyeZpWXaDmX6rt7WIduSiCnO1UXbNm70aGd_fyAHzAKuUIQqWZKItLFDydq_5GI3Gf_F7ZoIjX0lQ03LSabesf7tJsk375Zx4LTX_4",
    genre: "Design",
    courseCode: "ARTS 302",
    isbn: "9780465050659",
    description: "Classic design book that explores human-centered design principles. Good reading condition with some cover wear. Great insights for designers and product developers.",
    seller: {
      name: "Emma Davis",
      rating: 4.7,
      totalTrades: 18
    }
  },
  {
    id: 5,
    title: "Physics for Scientists",
    author: "Raymond A. Serway",
    price: 95.00,
    condition: "Used",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCYnRu2xyjcWW8HATQOQSxFz0F6Xr13oiSwu2bRVLRdd5x-U4fkuD_9sV0pb3B9fTvXZj1DSv5rYobmYTsK-mXdyNnWCalXXVWpoHEKldVNwgc8LXv3qv_PWzMp_Y1cC1Tkk9172KhlBUX4ee02WS68vHfmo5hp12Q23boH0lS-btfy_FEfokmbmPZC5K_tPyPpCxtgBiHUsnteeaR3DmDqHjgVDHJzVYDgZmXx3xrUan_HYXL8Al_eA7lE_PBlV8k3AERoEvT3uc",
    genre: "Physics",
    courseCode: "PHYS 160",
    isbn: "9781133954057",
    description: "Comprehensive physics textbook with detailed explanations and problem sets. Contains highlighting and annotations throughout. Excellent resource for physics majors.",
    seller: {
      name: "James Wilson",
      rating: 4.6,
      totalTrades: 31
    }
  },
  {
    id: 6,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 12.00,
    condition: "Like New",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4WWqCzrYclS7ligKSEQveW3jKuLJ3NbVrG-BwZiD35B-vNV9Alb3yOQZbtshBtrdBMs2xZCSh6EtO00ktIxnUsDt2p1vqd7x-U3mVimeEWh8acy6f36wiq69loyXFRkEPwjcgaRYcHCdx8f-7H_NnPMwox43ONJNW8D1F-xot75HmogokJNMgkeXdN9m4vra3NRNGwJTS0zLUkzbZYtLTS0gRHSSNvkl221vf7km4CTnnLfX77o0avTi0yQKWdPxpMxKcnJ1yiE",
    genre: "History",
    courseCode: "HIST 100",
    isbn: "9780062316097",
    description: "A brief history of humankind that explores human evolution and societal development. Excellent condition, read once. Fascinating perspective on human history.",
    seller: {
      name: "Sophia Martinez",
      rating: 4.9,
      totalTrades: 27
    }
  },
  {
    id: 7,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    price: 18.50,
    condition: "Good",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAv2Ucj-adG67P7kNHz3_YVpMB9pKNHMSMGAofy0zVlRnQT1CkTuSEXgbc0rAbSeAbtvajlP8iPrfbtAsYLhq5GUVPixAtmEpT9Hm-CKn6K1C2nITBFPO2JIeZ7nFhew-oECjmCxlmwU0NyPGDih-hsJSSe4vFpz6ab7u6WqjRhwKfBRI5ZWakOpBSBinuYc4zBAZuskLxkoLbRWwcePUoBJU1Se7DABx7wgXAB-nMmqNoK3WZeiGhuHNdjs4-Zzj2_8gTXjfqEvvs",
    genre: "Psychology",
    courseCode: "PSYC 100",
    isbn: "9780374533557",
    description: "Explores the two systems of thinking that drive our decisions. Good condition with some underlining. Essential reading for psychology students.",
    seller: {
      name: "David Kim",
      rating: 4.8,
      totalTrades: 19
    }
  },
  {
    id: 8,
    title: "Calculus",
    author: "James Stewart",
    price: 110.00,
    condition: "Used",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiymibUTvh1DP8YaGryAPVh-rFgYQDtgrX5iLRRJ27aMjFEeXMy2qy8tTIync-U5NMDHNszmJPEsKMC0caNEYuttd0MgJvMetBB2DEVSL4LayQH-wbOFu2WBZoMBGr5lx_rZmHcGIKnrq8HGEUN8uR7uFFFbh3yQijkj4dTERNLqGY2JrCFDvjCWpkB1LTwcJCeYy3jpCyCMtNYFRVx2ZZA23rJJBnXx6soEm1ZvNh_kEnVcuazuvtfxzAgoFDdm7I-zZ5qGuOqPA",
    genre: "Mathematics",
    courseCode: "MATH 113",
    isbn: "9781285740621",
    description: "Standard calculus textbook with clear explanations and extensive practice problems. Used condition with notes and highlighting throughout. All pages present and readable.",
    seller: {
      name: "Rachel Thompson",
      rating: 4.7,
      totalTrades: 34
    }
  }
];

// Condition badge styling helper
const getConditionBadgeClass = (condition: string) => {
  switch (condition) {
    case "Like New":
      return "bg-[#137fec]/20 text-[#137fec]";
    case "Used":
      return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-500";
    case "Good":
      return "bg-green-500/20 text-green-600 dark:text-green-500";
    default:
      return "bg-gray-500/20 text-gray-600";
  }
};

export default function BookListing() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.listing as string;

  // Find the book by ID (in a real app, this would be an API call)
  const book = sampleBooks.find((b) => b.id === parseInt(listingId));

  if (!book) {
    return (
      <>
        <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/marketplace" />
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101922]">
          <main className="flex flex-1 justify-center items-center py-5">
            <div className="text-center">
              <h1 className="text-4xl font-black text-[#111418] dark:text-[#f0f2f4] mb-4">Book Not Found</h1>
              <p className="text-[#617589] dark:text-[#90a4b8] mb-8">The listing you're looking for doesn't exist.</p>
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
                        src={book.image}
                        alt={`Cover of ${book.title}`}
                      />
                      <div className={`absolute top-4 right-4 ${getConditionBadgeClass(book.condition)} text-sm font-bold px-3 py-1.5 rounded-full shadow-md`}>
                        {book.condition}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Book Details */}
              <div className="flex flex-col gap-6">
                {/* Title and Author */}
                <div>
                  <h1 className="text-[#111418] dark:text-[#f0f2f4] text-4xl font-black leading-tight tracking-[-0.033em] mb-3">
                    {book.title}
                  </h1>
                  <p className="text-[#617589] dark:text-[#90a4b8] text-xl font-normal">
                    by {book.author}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <p className="text-[#111418] dark:text-[#f0f2f4] text-5xl font-black">
                    ${book.price.toFixed(2)}
                  </p>
                </div>

                {/* Book Details Card */}
                <div className="rounded-xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] p-6">
                  <h2 className="text-[#111418] dark:text-[#f0f2f4] text-lg font-bold mb-4">Book Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-[#f0f2f4] dark:border-[#2a3b4d]">
                      <span className="text-[#617589] dark:text-[#90a4b8] text-sm font-medium">ISBN</span>
                      <span className="text-[#111418] dark:text-[#f0f2f4] text-sm font-bold">{book.isbn}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-[#f0f2f4] dark:border-[#2a3b4d]">
                      <span className="text-[#617589] dark:text-[#90a4b8] text-sm font-medium">Genre</span>
                      <span className="text-[#111418] dark:text-[#f0f2f4] text-sm font-bold">{book.genre}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-[#f0f2f4] dark:border-[#2a3b4d]">
                      <span className="text-[#617589] dark:text-[#90a4b8] text-sm font-medium">Course Code</span>
                      <span className="text-[#111418] dark:text-[#f0f2f4] text-sm font-bold">{book.courseCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#617589] dark:text-[#90a4b8] text-sm font-medium">Condition</span>
                      <span className={`${getConditionBadgeClass(book.condition)} text-xs font-bold px-3 py-1 rounded-full`}>
                        {book.condition}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] p-6">
                  <h2 className="text-[#111418] dark:text-[#f0f2f4] text-lg font-bold mb-3">Description</h2>
                  <p className="text-[#617589] dark:text-[#90a4b8] text-base leading-relaxed">
                    {book.description}
                  </p>
                </div>

                {/* Seller Information */}
                <div className="rounded-xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] p-6">
                  <h2 className="text-[#111418] dark:text-[#f0f2f4] text-lg font-bold mb-4">Seller Information</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#137fec]/20 flex items-center justify-center">
                      <span className="text-[#137fec] text-lg font-bold">
                        {book.seller.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#111418] dark:text-[#f0f2f4] text-base font-bold">
                        {book.seller.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[#111418] dark:text-[#f0f2f4] text-sm font-bold">
                            {book.seller.rating}
                          </span>
                        </div>
                        <span className="text-[#617589] dark:text-[#90a4b8] text-sm">
                          • {book.seller.totalTrades} trades
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#137fec] text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#0f6bd7] transition-colors shadow-lg hover:shadow-xl">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Request Trade
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
