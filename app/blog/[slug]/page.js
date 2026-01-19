import Link from 'next/link';
import { CornerUpRight } from 'lucide-react';
import Image from 'next/image';
import { apiInstance } from '@/components/utils/api';
import { imageUrl } from '@/components/utils/config';

const Page = async ({ params }) => {
  const { slug } = params;

  const res = await apiInstance.get(
    `/client/article/detilasOfArticle?uniqueTitle=${slug}`
  );

  const blogData = res?.data;

  if (Object.keys(blogData || {})?.length <= 0) {
    return <div className="h-[100vh] flex justify-center items-center">
      <h1 className='text-9xl font-extrabold text-center'>404</h1>
    </div>
  }


  return (
    <div className="min-h-screen bg-[#e6e7ee] pb-[100px] pt-[74px]">
      <div className="max-w-[1400px] w-[90%] mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <p className="text-gray-600 text-sm">
            <Link href="/" className="hover:text-[#F98A1A] transition-colors">Home</Link> 
            <span className="mx-2">/</span>
            <span className="text-gray-800">{decodeURIComponent(slug)}</span>
          </p>
        </nav>

        {/* Main Content Card */}
        <div className="border border-[#d1d9e6] rounded-xl bg-[#e6e7ee] shadow-soft p-6 md:p-8 lg:p-10">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900">
            {blogData?.title}
          </h1>

          {/* Featured Image */}
          {blogData?.thumbnail && (
            <div className="mt-6 mb-8 rounded-xl overflow-hidden shadow-soft">
              <Image
                src={imageUrl + blogData?.thumbnail}
                width={1200}
                height={400}
                className="w-full max-h-[600px] object-cover"
                alt={blogData?.title || 'Blog image'}
              />
            </div>
          )}

          {/* Content */}
          {blogData?.content && (
            <div 
              className="mt-6 leading-7 text-base md:text-lg text-gray-700 bg-[#e6e7ee] shadow-inset p-6 md:p-8" 
              dangerouslySetInnerHTML={{ __html: blogData?.content }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
