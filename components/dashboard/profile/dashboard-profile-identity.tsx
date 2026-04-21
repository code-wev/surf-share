import Image from "next/image";

type DashboardProfileIdentityProps = {
  fullName: string;
};

export default function DashboardProfileIdentity({ fullName }: DashboardProfileIdentityProps) {
  return (
    <div className="mt-6 md:mt-12">
      <div className="relative">
        <div className="border-line-weaker bg-fill-hover h-25 w-25 overflow-hidden rounded-full border">
          <Image
            src="/home/latest/latest15.jpg"
            alt="Profile photo"
            width={100}
            height={100}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <p className="text-text-strong mt-4 text-lg font-medium">{fullName}</p>
    </div>
  );
}
