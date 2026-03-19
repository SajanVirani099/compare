import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { apiInstance } from "@/components/utils/api";
import { imageUrl } from "@/components/utils/config";
import Link from "next/link";

// Helper to split blogs into multiple columns (same logic as BlogSection)
const splitIntoColumns = (array, columns) => {
  const cols = Array.from({ length: columns }, () => []);
  array.forEach((item, index) => {
    cols[index % columns].push(item);
  });
  return cols;
};

const NewsPage = async () => {
  let blogs = [];
  try {
    const res = await apiInstance.get(`admin/article/get?start=1&limit=50`);
    blogs = res?.data || [];
  } catch (e) {
    console.error("Error loading blogs for news page:", e);
  }

  const columns = 4;
  const blogColumns = blogs ? splitIntoColumns(blogs, columns) : [];

  return (
    <>
      <div className="pt-5 md:pt-[60px] bg-[#e6e7ee] min-h-screen">
        <Navbar />
        <div className="max-w-[1280px] mx-auto px-6">
          <nav className="mt-4 sm:mt-6">
            <p className="text-gray-600 text-sm sm:text-base">
              <Link href="/" className="hover:text-[#F98A1A] transition-colors">
                HOME
              </Link>
              <span className="mx-2">/</span>
              <Link
                href="/news"
                className="hover:text-[#F98A1A] transition-colors"
              >
                BLOGS
              </Link>
            </p>
          </nav>
          <div className="flex justify-center gap-4 mb-20 mt-6">
            {/* Left Ad Box */}
            {/* <div className="hidden md:flex w-[150px] h-[600px] border-2 border-dashed border-gray-700 items-center justify-center flex-shrink-0">
              Ad Box
            </div> */}

            {/* Main Blog Grid */}
            <div className="flex-1 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-3 lg:gap-6">
                {blogColumns.map((column, colIndex) => (
                  <div key={colIndex}>
                    {column.map((item, i) => (
                      <div
                        key={i}
                        className="cursor-pointer border-1 border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft p-4 mb-3 lg:mb-6 hover:text-[#F98A1A] transition-colors"
                      >
                        <Link href={`/blog/${item.uniqueTitle}`}>
                          <img
                            className="!h-auto max-w-full rounded-xl"
                            alt={item.title}
                            src={imageUrl + item.thumbnail}
                          />
                        </Link>
                        <div className="mt-4 text-[16px] font-medium">
                          <Link href={`/blog/${item.uniqueTitle}`}>
                            {item.title}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="Masonry__fadeToWhiteMask___rTGCf"></div>
            </div>

            {/* Right Ad Box */}
            {/* <div className="hidden md:flex w-[150px] h-[600px] border-2 border-dashed border-gray-700 items-center justify-center flex-shrink-0">
              Ad Box
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewsPage;
