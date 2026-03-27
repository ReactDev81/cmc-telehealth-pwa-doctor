import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewItem {
  id: number;
  patient: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  averageRating: string;
}

export default function ReviewsSection({
  reviews,
  averageRating,
}: ReviewsSectionProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Patient Feedback</CardTitle>
        <CardDescription>
          Average rating: {averageRating} out of 5 ({reviews.length} reviews)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-lg border border-border bg-accent/30 p-4"
            >
              <div className="flex items-start justify-between mb-2 gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {review.patient.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">{review.patient}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>

                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}