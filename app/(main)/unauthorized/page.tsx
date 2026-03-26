export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <h1 className="text-xl font-semibold text-red-600">
                Only a doctor can access this dashboard.
            </h1>
        </div>
    );
}