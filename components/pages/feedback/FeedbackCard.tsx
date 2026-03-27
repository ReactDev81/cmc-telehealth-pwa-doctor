import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DoctorReview } from "@/types/home";
import { cn } from "@/lib/utils";

interface FeedbackCardProps {
    review: DoctorReview;
    className?: string;
    style?: React.CSSProperties;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ review, className, style }) => {
    // Helper to render stars
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={cn(
                    "w-4 h-4 mr-0.5",
                    i < Math.floor(rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-100 text-gray-200"
                )}
            />
        ));
    };

    return (
        <Card
            style={style}
            className={cn("overflow-hidden border-none shadow-premium-sm hover:shadow-premium-md transition-all duration-300 bg-white/80 backdrop-blur-sm p-0", className)}
        >
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-primary/10">
                            <AvatarImage src={review.patient_image || ""} alt={review.patient_name} />
                            <AvatarFallback className="bg-primary/5 text-primary font-semibold">
                                {review.patient_name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h4 className="font-semibold text-gray-900 leading-tight">
                                {review.patient_name}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-muted-foreground gap-2">
                                <span>{review.patient_location || 'Anonymous'}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span>{review.created_at}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex mb-1">
                            {renderStars(review.rating)}
                        </div>
                        <span className="text-xs font-medium text-gray-400">
                            {review.rating % 1 === 0 ? review.rating : review.rating.toFixed(1)} / 5
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    {review.title && (
                        <h5 className="font-bold text-gray-800 text-sm italic">
                            "{review.title}"
                        </h5>
                    )}
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {review.content}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
