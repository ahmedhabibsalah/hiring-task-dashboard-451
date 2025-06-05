import { Camera } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";

interface CameraCardProps {
  camera: Camera;
}

export function CameraCard({ camera }: CameraCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{camera.name}</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Link href={`/cameras/${camera.id}`}>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/demographics?camera_id=${camera.id}`}>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-gray-600">RTSP URL:</span>
            <p className="text-gray-800 truncate">{camera.rtsp_url}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {camera.stream_frame_width && camera.stream_frame_height && (
              <div>
                <span className="font-medium text-gray-600">Resolution:</span>
                <p className="text-gray-800">
                  {camera.stream_frame_width}x{camera.stream_frame_height}
                </p>
              </div>
            )}
            {camera.stream_fps && (
              <div>
                <span className="font-medium text-gray-600">FPS:</span>
                <p className="text-gray-800">{camera.stream_fps}</p>
              </div>
            )}
          </div>
          {camera.tags && camera.tags.length > 0 && (
            <div>
              <span className="font-medium text-gray-600">Tags:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {camera.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="pt-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                camera.demographics_config
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
              {camera.demographics_config
                ? "Demographics Configured"
                : "No Demographics Config"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
