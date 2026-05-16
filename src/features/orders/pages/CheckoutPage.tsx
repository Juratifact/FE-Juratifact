import { useState, useEffect, useRef } from "react";
import { useCreateOrder } from "../hooks/useOrders";
import { useMyCart } from "@/features/cart/hooks/useCart";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";

export default function CheckoutPage() {
  const create = useCreateOrder();
  const { data: cart } = useMyCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [itemsJson, setItemsJson] = useState('[]');
  const initializedRef = useRef(false);

  // Auto-populate from cart if available (only once)
  useEffect(() => {
    if (!initializedRef.current && cart?.items && cart.items.length > 0) {
      const cartDetailIds = cart.items.map((item) => item.cartDetailId);
      setItemsJson(JSON.stringify(cartDetailIds, null, 2));
      initializedRef.current = true;
    }
  }, [cart?.items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cartDetailIds = JSON.parse(itemsJson) as string[];
      create.mutate({ 
        shippingAddress, 
        cartDetailIds,
        vietMapRefId: "default-ref-id" // Placeholder for debug page
      });
    } catch {
      alert("Items JSON invalid (should be an array of string IDs)");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <Label>Địa chỉ giao hàng</Label>
        <Input
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
        />
      </div>

      <div>
        <Label>Items (JSON)</Label>
        <textarea
          className="w-full rounded-md border p-2"
          rows={6}
          value={itemsJson}
          onChange={(e) => setItemsJson(e.target.value)}
        />
      </div>

      <div>
        <Button type="submit" disabled={create.isPending}>
          Thanh toán
        </Button>
      </div>
    </form>
  );
}
