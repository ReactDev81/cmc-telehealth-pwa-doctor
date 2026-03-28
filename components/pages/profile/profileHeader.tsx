import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Star } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  avatar?: string | null;
  initials: string;
  department: string;
  role?: string;
  email?: string | null;
  phone?: string | null;
  license?: string | null;
  reviewSummary?: {
    average_rating: number;
    total_reviews: number;
  };
}

export default function ProfileHeader({
  fullName,
  avatar,
  initials,
  department,
  role,
  email,
  phone,
  license,
  reviewSummary,
}: ProfileHeaderProps) {
  const averageRatingValue = reviewSummary?.average_rating || 0;
  const totalReviewsValue = reviewSummary?.total_reviews || 0;
  return (
    <Card className="border-border">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={avatar || ""} alt={fullName} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <h1 className="mb-1">{fullName}</h1>

            <p className="text-muted-foreground mb-3">
              {department}
              {role ? ` • ${role}` : ""}
            </p>

            <div className="flex flex-wrap gap-2">
              {email && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Mail className="h-3 w-3 mr-1" />
                  {email}
                </Badge>
              )}

              {phone && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  <Phone className="h-3 w-3 mr-1" />
                  {phone}
                </Badge>
              )}

              {license && (
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  License: {license}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{averageRatingValue}</div>

              <div className="flex items-center justify-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(averageRatingValue)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-muted-foreground">{totalReviewsValue} reviews</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}