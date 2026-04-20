import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Frown, ArrowLeft, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-background/50 px-4">
      <div className="relative">
        {/* Gradient Blobs */}
        <div className="absolute inset-0 -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <Card className="relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur max-w-lg w-full">
          <div className="relative p-12 text-center space-y-6">
            {/* Background Gradient */}
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500" />

            <div className="relative z-10 space-y-6">
              {/* 404 Text */}
              <div className="space-y-2">
                <h1 className="text-8xl sm:text-9xl font-black tracking-tight bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  404
                </h1>
                <div className="flex items-center justify-center gap-2">
                  <Frown className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h2 className="text-3xl font-bold">Page Not Found</h2>
                <p className="text-lg text-muted-foreground">
                  Oops! The page you're looking for doesn't exist. It might have
                  been moved or deleted.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Link to="/" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
