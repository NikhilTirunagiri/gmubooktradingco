"use client";
import { useState } from "react";
import Link from "next/link";
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
}

// Sample book data
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
    isbn: "9780538453059"
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
    isbn: "9780134042282"
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
    isbn: "9780262033848"
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
    isbn: "9780465050659"
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
    isbn: "9781133954057"
  },
  {
    id: 6,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 12.00,
    condition: "Like New",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4WWqCzrYclS7ligKSEQveW3jKuLJ3NbVrG-BwZiD35B-vNV9Alb3yOQZbtshBtrdBMs2xZCSh6EtO00ktIxnUsDt2p1vqd7x-U3mVimeEWh8acy6f36wiq69loyXFRkEPwjcgaRYcHCdx8f-7H_NnPMwox43ONJNW8D1F-xot75HmogokJNMgkeXdN9m4vra3NRNGwGJTS0zLUkzbZYtLTS0gRHSSNvkl221vf7km4CTnnLfX77o0avTi0yQKWdPxpMxKcnJ1yiE",
    genre: "History",
    courseCode: "HIST 100",
    isbn: "9780062316097"
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
    isbn: "9780374533557"
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
    isbn: "9781285740621"
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

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("title-asc");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Get unique values for filters
  const genres = Array.from(new Set(sampleBooks.map(book => book.genre))).sort();
  const courseCodes = Array.from(new Set(sampleBooks.map(book => book.courseCode))).sort();
  const conditions = ["Like New", "Used", "Good"];

  // Filter and sort books
  const filteredBooks = sampleBooks
    .filter(book => {
      const matchesSearch = searchTerm === "" || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm);
      
      const matchesGenre = selectedGenre === "" || book.genre === selectedGenre;
      const matchesCourseCode = selectedCourseCode === "" || book.courseCode === selectedCourseCode;
      const matchesCondition = selectedCondition === "" || book.condition === selectedCondition;
      
      return matchesSearch && matchesGenre && matchesCourseCode && matchesCondition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  return (
    <>
      <MPNavbar isDarkBackground={false} variant="fixed-top" currentPath="/marketplace" />
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101922]">
        <main className="flex flex-1 justify-center py-5 pt-24 sm:pt-20">
          <div className="flex flex-col w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <section className="w-full space-y-6 mb-8 pt-5">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[#111418] dark:text-[#f0f2f4] text-4xl font-black leading-tight tracking-[-0.033em]">Browse Books</p>
                  <p className="text-[#617589] dark:text-[#90a4b8] text-base font-normal leading-normal">Showing {filteredBooks.length} results</p>
                </div>
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
                    {/* Genre */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                        className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f4] dark:bg-[#182431] pl-4 pr-3 text-[#111418] dark:text-[#f0f2f4] hover:bg-[#e8eaed] dark:hover:bg-[#243647] transition-colors"
                      >
                        <p className="text-sm font-medium leading-normal">{selectedGenre || "Genre"}</p>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showGenreDropdown && (
                        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] rounded-lg shadow-lg py-2 min-w-[200px]">
                          <button onClick={() => { setSelectedGenre(""); setShowGenreDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">All Genres</button>
                          {genres.map(genre => (
                            <button key={genre} onClick={() => { setSelectedGenre(genre); setShowGenreDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">{genre}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Course Code */}
                    <div className="relative">
                      <button 
                        onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                        className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#f0f2f4] dark:bg-[#182431] pl-4 pr-3 text-[#111418] dark:text-[#f0f2f4] hover:bg-[#e8eaed] dark:hover:bg-[#243647] transition-colors"
                      >
                        <p className="text-sm font-medium leading-normal">{selectedCourseCode || "Course Code"}</p>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showCourseDropdown && (
                        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] rounded-lg shadow-lg py-2 min-w-[200px]">
                          <button onClick={() => { setSelectedCourseCode(""); setShowCourseDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">All Courses</button>
                          {courseCodes.map(code => (
                            <button key={code} onClick={() => { setSelectedCourseCode(code); setShowCourseDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">{code}</button>
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
                        <p className="text-sm font-medium leading-normal">{selectedCondition || "Condition"}</p>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showConditionDropdown && (
                        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] rounded-lg shadow-lg py-2 min-w-[200px]">
                          <button onClick={() => { setSelectedCondition(""); setShowConditionDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">All Conditions</button>
                          {conditions.map(condition => (
                            <button key={condition} onClick={() => { setSelectedCondition(condition); setShowConditionDropdown(false); }} className="w-full text-left px-4 py-2 text-sm text-[#111418] dark:text-[#f0f2f4] hover:bg-[#f0f2f4] dark:hover:bg-[#243647] transition-colors">{condition}</button>
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
              {filteredBooks.map((book) => (
                <Link key={book.id} href={`/marketplace/${book.id}`} className="flex flex-col gap-4 p-4 rounded-xl bg-white dark:bg-[#182431] border border-[#f0f2f4] dark:border-[#2a3b4d] group transition-shadow duration-300 hover:shadow-lg cursor-pointer">
                  <div className="relative w-full overflow-hidden rounded-lg aspect-[3/4]">
                    <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={book.image} alt={`Cover of ${book.title}`} />
                    <div className={`absolute top-2 right-2 ${getConditionBadgeClass(book.condition)} text-xs font-bold px-2 py-1 rounded-full`}>{book.condition}</div>
                  </div>
                  <div className="flex flex-col flex-1 gap-3">
                    <div className="flex flex-col">
                      <h3 className="font-bold text-lg text-[#111418] dark:text-[#f0f2f4]">{book.title}</h3>
                      <p className="text-sm text-[#617589] dark:text-[#90a4b8]">{book.author}</p>
                    </div>
                    <p className="font-black text-2xl text-[#111418] dark:text-[#f0f2f4]">${book.price.toFixed(2)}</p>
                    <div className="mt-auto w-full flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#137fec] text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] group-hover:bg-[#0f6bd7] transition-colors">
                      View Details
                    </div>
                  </div>
                </Link>
              ))}
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