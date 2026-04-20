import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-background/50 px-4">
      <div className="relative">
        {/* Gradient Blob */}
        <div className="absolute inset-0 -top-40 w-96 h-96 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none" />

        <Card className="relative overflow-hidden border border-border/50 bg-card/50 backdrop-blur max-w-lg w-full">
          <div className="relative p-12 text-center space-y-6">
            {/* Background Gradient */}
            <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-red-500 to-orange-500" />

            <div className="relative z-10 space-y-6">
              {/* Icon */}
              <div className="inline-block p-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 mx-auto">
                <ShieldAlert className="w-16 h-16 text-white" />
              </div>

              {/* Title */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                  Unauthorized
                </h1>
                <p className="text-lg text-muted-foreground">
                  You don't have permission to access this page. Please log in
                  with appropriate credentials.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link to="/" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    Sign In
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
