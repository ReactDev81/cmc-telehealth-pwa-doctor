// const AllPatients = () => {
//     return (
//         <div>
//             <h1>All Patients</h1>
//         </div>
//     );
// };

// export default AllPatients;


"use client";

import * as React from "react";
import { DataTable } from "@/components/ui/data-table";
import { patientsColumns } from "./column";
import { usePatients } from "@/queries/usePatients";

export default function PatientsPage() {
    const [page, setPage] = React.useState(1);
    const [searchInput, setSearchInput] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const per_page = 10;

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);

    const { data, isLoading, isFetching, error } = usePatients({
        page,
        per_page,
        search: debouncedSearch,
    });

    const patients = data?.data ?? [];
    const pageCount = data?.pagination?.last_page ?? 1;

    return (
        <div className="space-y-6 p-4">
            <div>
                <h1 className="text-2xl font-semibold">All Patients</h1>
                <p className="text-sm text-muted-foreground">
                    Manage and view all patient appointments
                </p>
            </div>

            {error ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {(error as any)?.response?.data?.message ||
                        (error as any)?.message ||
                        "Something went wrong"}
                </div>
            ) : null}

            <DataTable
                columns={patientsColumns}
                data={patients}
                loading={isLoading || isFetching}
                pageCount={data?.pagination?.last_page ?? 1}
                currentPage={page}
                onPageChange={setPage}
                enableSearch={true}
                searchValue={searchInput}
                onSearch={setSearchInput}
            />
        </div>
    );
}