// import { Card, CardContent } from "@/components/ui/card";
// import { ReactNode } from "react";

// interface ProfileItemCardProps {
//   icon: ReactNode;
//   title: string;
//   subtitle?: string;
//   meta?: string;
//   badge?: ReactNode;
//   description?: string;
//   actions?: ReactNode;
// }

// export function ProfileItemCard({
//   icon,
//   title,
//   subtitle,
//   meta,
//   badge,
//   description,
//   actions,
// }: ProfileItemCardProps) {
//   return (
//     <Card className="border-border">
//       <CardContent className="pt-6">
//         <div className="flex gap-4">
//           <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
//             {icon}
//           </div>

//           <div className="flex-1">
//             <div className="flex items-start justify-between mb-2">
//               <div>
//                 <h4 className="font-semibold">{title}</h4>
//                 {subtitle && (
//                   <p className="text-sm text-muted-foreground">{subtitle}</p>
//                 )}
//               </div>
//               {badge}
//             </div>

//             {meta && <p className="text-sm text-muted-foreground mb-2">{meta}</p>}
//             {description && <p className="text-sm">{description}</p>}
//             {actions}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface ProfileItemCardProps {
  icon?: ReactNode;
  imageSrc?: string | null;
  imageAlt?: string;
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: ReactNode;
  description?: string;
  actions?: ReactNode;
  iconClassName?: string;
}

export function ProfileItemCard({
  icon,
  imageSrc,
  imageAlt = "Profile item image",
  title,
  subtitle,
  meta,
  badge,
  description,
  actions,
  iconClassName = "bg-primary/10 text-primary",
}: ProfileItemCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg ${iconClassName}`}
          >
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              icon
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-semibold break-words">{title}</h4>

                {subtitle && (
                  <p className="text-sm text-muted-foreground break-words">
                    {subtitle}
                  </p>
                )}
              </div>

              {badge}
            </div>

            {meta && (
              <p className="mb-2 text-sm text-muted-foreground break-words">
                {meta}
              </p>
            )}

            {description && (
              <p className="text-sm break-words">{description}</p>
            )}

            {actions && <div className="mt-3">{actions}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}