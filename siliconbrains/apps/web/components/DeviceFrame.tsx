import type { ReactNode } from "react";
import Image from "next/image";
import pcImage from "@/components/public/images/pcwall.png"
import mobileImage from "@/components/public/images/mobilewall.png"

export function LaptopFrame({ children }: { children?: ReactNode }) {
  return (
<div className="hero-laptop relative w-full">
  <div className="rounded-t-2xl border border-outline bg-surface p-2 shadow-[0_20px_50px_rgba(20,38,30,0.12)]">
    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-surface-container-high">
      {children ?? (
        <Image
          src={pcImage}
          alt="SiliconBrains web application interface displayed on a laptop"
          priority
          quality={82}
          sizes="(max-width: 768px) 90vw, 58vw"
          className="h-full w-full object-cover object-top"
        />
      )}
    </div>
  </div>
  <div className="h-3 rounded-b-2xl border-x border-b border-outline bg-surface-container-high" />
</div>
  );
}

export function PhoneFrame({ children }: { children?: ReactNode }) {
  return (
    <div className="relative w-[180px]">
      <div className="rounded-[2rem] border-[6px] border-on-surface bg-surface p-1 shadow-[0_18px_40px_rgba(20,38,30,0.18)]">
        <div className="aspect-[9/19] overflow-hidden rounded-[1.6rem] bg-surface-container-high">
          {children ?? (
            <Image
              src={mobileImage}
              alt="SiliconBrains mobile application interface displayed on a smartphone"
              quality={78}
              sizes="180px"
              className="h-full w-full object-cover object-top"
            />
          )}
        </div>
      </div>
    </div>
  );
}
