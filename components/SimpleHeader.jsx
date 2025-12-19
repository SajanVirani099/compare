import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/versus.svg";

const SimpleHeader = () => {
  return (
    <div
      className="navigationContainer fixed top-0 bg-gradient-to-r from-[#1c1c1c] via-[#2e2e2e] to-[#434343] w-full"
      style={{ zIndex: 9999 }}
    >
      <div className="navigation">
        <div className="flex items-center justify-between w-full px-4 py-2">
          <div className="flex items-center gap-4">
            <Link href="/" className="logoContainer flex items-center gap-2">
              <Image src={logo} className="h-8 w-auto" alt="logo" />
            </Link>
          </div>
          <div className="text-white text-xl font-semibold">Compare Web</div>
        </div>
      </div>
    </div>
  );
};

export default SimpleHeader;
