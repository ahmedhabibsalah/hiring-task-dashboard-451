"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCameras } from "@/hooks/use-cameras";
import { CameraCard } from "@/components/cameras/camera-card";
import { CameraListSkeleton } from "@/components/cameras/camera-list-skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export default function CamerasPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("camera_name") || ""
  );
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("size")) || 12
  );
  const currentPage = Number(searchParams.get("page")) || 1;

  const { data, isLoading, error } = useCameras({
    page: currentPage,
    size: pageSize,
    camera_name: searchParams.get("camera_name") || undefined,
  });

  const updateSearchParams = (
    params: Record<string, string | number | undefined>
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        newSearchParams.set(key, String(value));
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/cameras?${newSearchParams.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ camera_name: searchTerm, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams({ page });
  };

  const handlePageSizeChange = (size: number) => {
    updateSearchParams({ size, page: 1 });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Camera Management
        </h1>
        <p className="text-gray-600">Manage and monitor your camera network</p>
      </div>

      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
          <Input
            type="text"
            placeholder="Search cameras by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="primary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Items per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error loading cameras: {error.message}</p>
        </div>
      )}

      {isLoading ? (
        <CameraListSkeleton />
      ) : data?.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No cameras found</p>
          {searchParams.get("camera_name") && (
            <p className="text-gray-400 mt-2">
              Try adjusting your search criteria
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {data?.items.map((camera) => (
              <CameraCard key={camera.id} camera={camera} />
            ))}
          </div>

          {data && data.pages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={data.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {data && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, data.total)} of {data.total} cameras
        </div>
      )}
    </div>
  );
}
