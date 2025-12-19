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
    <div className="max-w-[1200px] w-[90%] mx-auto pb-[100px] pt-[74px]">
      <p className="text-black text-sm">
        <Link href="/">Home</Link> &gt; {decodeURIComponent(slug)}
      </p>

      <div>
        <h1 className="text-5xl font-extrabold mt-[30px]">
          {blogData?.title}
        </h1>
        {/* <p className="text-3xl text-gray-400 italic font-extrabold mt-5">
          {blogData?.subtitle ||
            "Still relying on your password from a decade ago? Here's why you need FIDO, passkeys, and hyper skepticism to stay safe online."}
        </p> */}

        <div className="mt-10">
          <Image
            src={imageUrl + blogData?.thumbnail}
            width={400}
            height={200}
            className="w-full h-auto"
          />
        </div>

        {
          blogData?.content && (
            <div className="mt-4 leading-7 text-lg text-[#333333]" dangerouslySetInnerHTML={{ __html: blogData?.content }} />
          )
        }


        {/* <p className="mt-4 leading-7 text-lg text-[#333333]">
          Got a rock-solid password? Think that's enough to outwit the bad guys? [...]
        </p> */}

        {/* Your other content goes here — unchanged */}

        {/* <button
          className="my-10 flex mx-auto flex-row items-center justify-center gap-1 bg-[#3c59fc] rounded-lg text-white px-4 py-2"
          onClick={() => {
            navigator.share({
              title: blogData?.title || 'Check this out',
              url: window.location.href,
            });
          }}
        >
          <CornerUpRight />
          Share
        </button> */}
      </div>
    </div>
  );
};

export default Page;
