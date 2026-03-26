"use client";

import { useAppProfileScreens } from "@/queries/useAppProfileScreens";

const Page = () => {

    const { data, isLoading, error } = useAppProfileScreens();

    const termsAndConditionsData = data?.term_and_conditions;

    return (
        <div className="flex items-center justify-center h-full min-h-screen">
            {isLoading ? (
                'loading...'
            ) : error ? (
                <p className="text-red-500">
                    {((error as any)?.response?.data?.errors?.message ??
                        (error as any)?.message ??
                        "Error loading content")}
                </p>
            ) : termsAndConditionsData ? (
                <div className="html-content"
                    dangerouslySetInnerHTML={{ __html: termsAndConditionsData }}
                />
            ) : "No Content Available"
            }
        </div>
    )
}

export default Page