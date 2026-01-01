import { ByLine } from "@/components/type/titles";
import { Title } from "@/components/type/titles";
import Image from "next/image";

const CreatePageTitle = ({
  title,
  byLine,
  byLineBottom,
  image,
  children,
}: {
  title: string;
  byLine: string;
  byLineBottom?: string;
  image?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="border-b border-slate-200 pb-2 mb-2 flex flex-row items-center justify-between gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-0">
          {byLine && <ByLine>{byLine}</ByLine>}
          {title && <Title>{title}</Title>}
          {byLineBottom && <ByLine>{byLineBottom}</ByLine>}
        </div>
      </div>
      {image && <Image src={image} alt={title || ""} width={80} height={80} />}
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
};

export default CreatePageTitle;
