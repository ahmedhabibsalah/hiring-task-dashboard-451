"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, BarChart3, Settings, Video, Tag } from "lucide-react";
import { useCamera } from "@/hooks/use-cameras";
import { CameraDetailSkeleton } from "@/components/cameras/camera-detail-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DescriptionList,
  DescriptionListItem,
} from "@/components/ui/description-list";
import { format } from "date-fns";
import { ConfigStatus } from "@/components/demographics/config-status";
import { ConfigSummary } from "@/components/demographics/config-summary";

export default function CameraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;

  const { data: camera, isLoading, error } = useCamera(cameraId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CameraDetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error loading camera: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!camera) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-500">Camera not found</p>
      </div>
    );
  }

  const hasConfig = !!camera.demographics_config;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/cameras")}
          className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cameras
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Video className="h-8 w-8 text-blue-600" />
              {camera.name}
            </h1>
            <p className="text-gray-600 mt-1">Camera ID: {camera.id}</p>
          </div>

          <div className="flex gap-2">
            <Link href={`/cameras/${camera.id}/edit`}>
              <Button variant="primary">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href={`/demographics?camera_id=${camera.id}`}>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="stream">Stream Config</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Camera Information</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionList>
                <DescriptionListItem
                  label="RTSP URL"
                  value={<span className="break-all">{camera.rtsp_url}</span>}
                />
                <DescriptionListItem
                  label="Status"
                  value={
                    <Badge variant={hasConfig ? "success" : "default"}>
                      {hasConfig ? "Configured" : "Not Configured"}
                    </Badge>
                  }
                />
                <DescriptionListItem
                  label="Created"
                  value={format(new Date(camera.created_at), "PPp")}
                />
                <DescriptionListItem
                  label="Last Updated"
                  value={format(new Date(camera.updated_at), "PPp")}
                />
              </DescriptionList>

              {camera.tags && camera.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {camera.tags.map((tag) => (
                      <Badge key={tag.id} variant="default">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stream">
          <Card>
            <CardHeader>
              <CardTitle>Stream Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <DescriptionList>
                <DescriptionListItem
                  label="Resolution"
                  value={`${camera.stream_frame_width || "Auto"} × ${
                    camera.stream_frame_height || "Auto"
                  }`}
                />
                <DescriptionListItem
                  label="Frame Rate"
                  value={
                    camera.stream_fps ? `${camera.stream_fps} FPS` : "Auto"
                  }
                />
                <DescriptionListItem
                  label="Quality"
                  value={
                    camera.stream_quality ? `${camera.stream_quality}%` : "Auto"
                  }
                />
                <DescriptionListItem
                  label="Max Stream Length"
                  value={
                    camera.stream_max_length
                      ? `${camera.stream_max_length} seconds`
                      : "Unlimited"
                  }
                />
                <DescriptionListItem
                  label="Skip Frames"
                  value={camera.stream_skip_frames || "0"}
                />
              </DescriptionList>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics">
          <ConfigStatus
            cameraId={camera.id}
            config={camera.demographics_config}
          />

          {camera.demographics_config && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Configuration Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ConfigSummary config={camera.demographics_config} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
