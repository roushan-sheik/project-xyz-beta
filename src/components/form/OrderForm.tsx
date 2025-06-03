// components/OrderForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "../ui/Button";

const orderSchema = z.object({
  quantity: z.number().min(1, "数量は1以上である必要があります"),
  deliveryDate: z.string().min(1, "希望納品日を入力してください"),
  deliveryAddress: z.string().min(1, "お届け先住所を入力してください"),
  additionalNotes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
      deliveryDate: "",
      deliveryAddress: "",
      additionalNotes: "",
    },
  });

  return (
    <div className="glass-card p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Quantity */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            数量
          </label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            className="glass-input w-full p-3"
            min="1"
          />
          {errors.quantity && (
            <p className="text-red-400 text-sm mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Delivery Date */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            希望納品日
          </label>
          <input
            type="date"
            {...register("deliveryDate")}
            className="glass-input w-full p-3"
            placeholder="mm/dd/yyyy"
          />
          {errors.deliveryDate && (
            <p className="text-red-400 text-sm mt-1">
              {errors.deliveryDate.message}
            </p>
          )}
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            お届け先住所
          </label>
          <textarea
            {...register("deliveryAddress")}
            rows={3}
            className="glass-input w-full p-3"
          />
          {errors.deliveryAddress && (
            <p className="text-red-400 text-sm mt-1">
              {errors.deliveryAddress.message}
            </p>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            追加メモ
          </label>
          <textarea
            {...register("additionalNotes")}
            rows={4}
            className="glass-input w-full p-3"
          />
        </div>

        {/* Submit Button */}

        <Button
          disabled={isSubmitting}
          type="submit"
          variant="glassBrand"
          className="w-full"
        >
          {isSubmitting ? "処理中..." : "注文を確定する"}
        </Button>
      </form>
    </div>
  );
};

export default OrderForm;
