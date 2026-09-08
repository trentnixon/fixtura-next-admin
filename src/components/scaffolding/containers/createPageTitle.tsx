import { ByLine } from "@/components/type/titles";
import { Title } from "@/components/type/titles";
import SafeImage from "@/components/ui-library/media/SafeImage";

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
    <div className="border-b border-slate-200 pb-2 mb-2 flex flex-col items-stretch justify-between gap-4 lg:flex-row lg:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        {image && (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-white p-2">
            <SafeImage
              src={image}
              alt={title || "Logo"}
              width={80}
              height={80}
              className="h-full w-full rounded object-contain"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-0">
          {byLine && <ByLine>{byLine}</ByLine>}
          {title && <Title>{title}</Title>}
          {byLineBottom && <ByLine>{byLineBottom}</ByLine>}
        </div>
      </div>
      {children && (
        <div className="flex w-full shrink-0 flex-col items-stretch justify-end gap-2 lg:w-auto lg:items-end">
          {children}
        </div>
      )}
    </div>
  );
};

export default CreatePageTitle;
