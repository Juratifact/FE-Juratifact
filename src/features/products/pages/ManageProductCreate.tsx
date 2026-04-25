import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ProductForm } from "../components/ProductForm";
import { useCreateProduct } from "../hooks/useProduct";
import type { ProductFormData } from "../schema";
import type { CreateProductDto } from "../types";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
export default function ManageProductCreate() {
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (data: ProductFormData) => {
    const payload: CreateProductDto = {
      title: data.title,
      description: data.description,
      condition: data.condition,
      price: data.price,
      image: data.image?.[0] ?? null,
      video: data.video?.[0] ?? null,
    };

    createProduct(payload);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-6 pb-20 pt-6">
      {/* Top Navigation - Clean & Minimal */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="group text-muted-foreground hover:text-foreground transition-colors"
        >
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to listings
          </Link>
        </Button>
      </div>

      {/* Header Section - Typography focused */}
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Sell{" "}
            <span className="text-muted-foreground/40 italic font-serif">
              Somethings
            </span>{" "}
            Decent.
          </h1>
          <p className="max-w-150 text-lg text-muted-foreground leading-relaxed">
            Sell your own stuff. Add high-quality visuals to increase engagement
            and trust.
          </p>
        </div>
      </header>

      <Separator className="bg-border/50" />

      {/* Form Container - Modern Glassmorphism */}
      <div className="relative group">
        {/* Subtle Glow Effect behind the card */}
        <div className="absolute -inset-1 bg-linear-to-r from-primary/20 via-fuchsia-500/10 to-blue-500/20 rounded-4xl blur-xl opacity-50 transition duration-1000 group-hover:opacity-100" />

        <Card className="relative overflow-hidden border-border/50 bg-background/60 shadow-2xl backdrop-blur-2xl rounded-3xl">
          <CardContent className="p-6 md:p-10">
            {/* Form */}
            <div className="relative">
              <ProductForm
                onSubmit={handleSubmit}
                isPending={isPending}
                submitLabel={isPending ? "Publishing..." : "Posting"}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer hint */}
      <footer className="text-center">
        <p className="text-xs text-muted-foreground/60 uppercase tracking-widest">
          Secure Cloud Storage Powered by Studio Engine
        </p>
      </footer>
    </div>
  );
}
