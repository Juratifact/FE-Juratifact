import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { LoadingSpinner } from "@/shared/components/common/LoadingSpinner";
import { ProductForm } from "../components/ProductForm";
import { useProductDetail, useUpdateProduct } from "../hooks/useProduct";
import type { ProductFormData } from "../schema";
import type { UpdateProductDto } from "../types";


export default function ManageProductEdit() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProductDetail(id!);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const handleSubmit = (data: ProductFormData) => {
    const payload: UpdateProductDto = {
      title: data.title,
      description: data.description,
      condition: data.condition,
      price: data.price,
      images: data.image ? Array.from(data.image) : [],
      imageUrls: data.imageUrls,
    };

    updateProduct({
      id: id!,
      data: payload,
    });
  };

  if (isLoading) {
    return <LoadingSpinner className="py-20" size="lg" />;
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Button variant="link" asChild className="mt-2">
          <Link to="/admin/products">Back to list</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/admin/products">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to list
        </Link>
      </Button>

      <h2 className="mb-6 text-2xl font-bold">Edit product</h2>

      <ProductForm
        defaultValues={{
          title: product.title,
          description: product.description ?? "",
          condition: product.condition,
          price: product.price,
        }}
        initialImageUrls={product.imageUrls}
        onSubmit={handleSubmit}
        isPending={isPending}
        submitLabel="Update"
      />
    </div>
  );
}
