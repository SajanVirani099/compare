import Link from 'next/link';
import Image from 'next/image';
import { apiInstance } from '@/components/utils/api';
import { imageUrl } from '@/components/utils/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogImageCarousel from '@/components/BlogImageCarousel/BlogImageCarousel';
import RelatedArticles from '@/components/RelatedArticles/RelatedArticles';
import { HiUser } from 'react-icons/hi';
import { FaWhatsapp, FaTelegram, FaFacebook, FaTwitter } from 'react-icons/fa';

const Page = async ({ params }) => {
  const { slug } = params;

  const res = await apiInstance.get(
    `/client/article/detilasOfArticle?uniqueTitle=${slug}`
  );

  const blogData = res?.data;

  if (Object.keys(blogData || {})?.length <= 0) {
    return (
      <div className="h-[100vh] flex justify-center items-center bg-[#e6e7ee]">
        <h1 className='text-9xl font-extrabold text-center'>404</h1>
      </div>
    );
  }

  // Prepare images array for carousel (thumbnail + any additional images)
  const carouselImages = [];
  if (blogData?.thumbnail) {
    carouselImages.push(blogData.thumbnail);
  }
  // Add any additional images from blogData if available
  if (blogData?.images && Array.isArray(blogData.images)) {
    carouselImages.push(...blogData.images);
  }

  // Fetch related articles (same category or recent articles)
  let relatedArticles = [];
  try {
    const relatedRes = await apiInstance.get(`/client/article/get?start=1&limit=10`);
    if (relatedRes?.data) {
      // Filter out current article and get up to 3 related articles
      relatedArticles = relatedRes.data
        .filter((article) => article?.uniqueTitle !== slug)
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching related articles:', error);
  }

  // Social sharing URLs
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://compares360.com';
  const currentUrl = `${baseUrl}/blog/${slug}`;
  const shareText = blogData?.title || '';
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div className="min-h-screen bg-[#e6e7ee]">
      <Navbar />
      
      <div className="max-w-[1400px] w-[90%] mx-auto pt-8 sm:pt-12 pb-[100px]">
        {/* Breadcrumb */}
        <nav className="my-4 sm:my-6">
          <p className="text-gray-600 text-sm sm:text-base">
            <Link href="/" className="hover:text-[#F98A1A] transition-colors">HOME</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-[#F98A1A] transition-colors">NEWS</Link>
            {blogData?.category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-800 capitalize">{blogData.category}</span>
              </>
            )}
          </p>
        </nav>

        {/* Main Content Card */}
        <div className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft p-6 md:p-8 lg:p-10">
          {/* Category Badge */}
          {blogData?.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-[#e6e7ee] border border-[#d1d9e6] rounded-lg shadow-inset">
                category {blogData.category}
              </span>
            </div>
          )}

          {/* Title with Arrow */}
          <div className="flex items-start gap-2 mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 flex-1">
              {blogData?.title}
            </h1>
            <span className="text-gray-600 text-xl sm:text-2xl mt-2">→</span>
          </div>

          {/* Author and Social Sharing */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#d1d9e6]">
            {/* Author Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center">
                <HiUser className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-700">
                  By <span className="font-semibold">{blogData?.author?.name || blogData?.author || 'Admin'}</span>
                </p>
                {blogData?.createdAt && (
                  <p className="text-xs text-gray-500">
                    {new Date(blogData.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Social Sharing Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-gray-600 mr-2">Share:</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
                aria-label="Share on WhatsApp"
              >
                <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
                aria-label="Share on Telegram"
              >
                <FaTelegram className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
                aria-label="Share on Facebook"
              >
                <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#d1d9e6] bg-[#e6e7ee] shadow-soft flex items-center justify-center hover:shadow-lg transition-all"
                aria-label="Share on Twitter"
              >
                <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </a>
            </div>
          </div>

          {/* Image Carousel */}
          {carouselImages.length > 0 && (
            <BlogImageCarousel images={carouselImages} title={blogData?.title} />
          )}

          {/* Content */}
          {blogData?.content && (
            <div 
              className="mt-6 sm:mt-8 leading-7 text-base sm:text-lg text-gray-700 blog-content" 
              dangerouslySetInnerHTML={{ __html: blogData.content }} 
            />
          )}

          {/* Additional Images from Content */}
          {/* Images embedded in content will be styled by blog-content CSS */}
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <RelatedArticles articles={relatedArticles} />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Page;
