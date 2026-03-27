"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export default function ReviewTab({ appointment }: { appointment: any }) {
    const canAddReview = appointment?.can_add_review;
    const reviews = appointment?.doctor?.review || [];

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");

    // ⭐ Submit handler (API baad me connect karenge)
    const handleSubmit = () => {
        console.log("Rating:", rating);
        console.log("Comment:", comment);

        alert("Review submitted (API connect karna baaki hai)");
    };

    return (
        <div className="space-y-6">

            {/* ⭐ Add Review Section */}
            {canAddReview && (
                <Card className="rounded-2xl border shadow-sm">
                    <CardHeader>
                        <CardTitle>Add Review</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {/* ⭐ Star Rating */}
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-6 w-6 cursor-pointer transition ${(hover || rating) >= star
                                            ? "text-yellow-400 fill-yellow-400"
                                        : "text-primary"
                                        }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            ))}
                        </div>

                        {/* 📝 Comment */}
                        <Textarea
                            placeholder="Write your feedback..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        {/* 🚀 Submit */}
                        <Button
                            disabled={!rating || !comment}
                            onClick={handleSubmit}
                        >
                            Submit Review
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* 📋 Existing Reviews */}
            <Card className="rounded-2xl border shadow-sm">
                <CardHeader>
                    <CardTitle>Patient Reviews</CardTitle>
                </CardHeader>

                <CardContent>
                    {!reviews.length ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No reviews yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((rev: any, index: number) => (
                                <div
                                    key={index}
                                    className="border-b pb-4 last:border-none"
                                >
                                    {/* ⭐ Stars */}
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= rev.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                    : "text-primary"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* 📝 Comment */}
                                    <p className="text-sm">{rev.comment}</p>

                                    {/* 👤 Name */}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        - {rev.patient_name || "Anonymous"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}