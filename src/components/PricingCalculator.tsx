"use client";
import React, { useState, ChangeEvent } from "react";

interface InputFieldProps {
  label?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <div className="flex flex-col">
    {label && <label className="mb-1 font-semibold">{label}</label>}
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
    />
  </div>
);

interface Item {
  price: string;
  quantity: string;
}

export default function PricingCalculator() {
  const [totalPrice, setTotalPrice] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [items, setItems] = useState<Item[]>([{ price: "", quantity: "" }]);
  const [finalPrice, setFinalPrice] = useState<string | null>(null);
  const [itemPrices, setItemPrices] = useState<string[]>([]);

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItemField = () => {
    setItems([...items, { price: "", quantity: "" }]);
  };

  const removeItemField = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const calculateFinalPrice = () => {
    const price = parseFloat(totalPrice);
    const discount = parseFloat(totalDiscount);
    const itemPrices = items.map((item) => ({
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity, 10),
    }));

    if (
      !isNaN(price) &&
      !isNaN(discount) &&
      itemPrices.every((item) => !isNaN(item.price) && !isNaN(item.quantity))
    ) {
      const totalItemValue = itemPrices.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const discountPercentage = (discount / price) * 100;

      const discountedItems = itemPrices.map((item) => {
        const itemValue = item.price * item.quantity;
        const itemDiscountShare =
          (itemValue / totalItemValue) * discountPercentage;
        const discountedPrice = item.price * (1 - itemDiscountShare / 100);
        const itemDiscount = item.price - discountedPrice;
        return {
          ...item,
          discountedPrice: discountedPrice,
          totalDiscountedPrice: discountedPrice * item.quantity,
          itemDiscount: itemDiscount,
          totalItemDiscount: itemDiscount * item.quantity,
        };
      });

      const finalItemsPrice = discountedItems.reduce(
        (acc, item) => acc + item.totalDiscountedPrice,
        0
      );
      const final = price - discount + finalItemsPrice;

      setFinalPrice(final.toFixed(2));
      setItemPrices(
        discountedItems.map(
          (item) =>
            `Original: ${item.price.toFixed(2)} x ${
              item.quantity
            },\n Discount: ${item.itemDiscount.toFixed(
              2
            )} per item, total ${item.totalItemDiscount.toFixed(
              2
            )}, Discounted: ${item.discountedPrice.toFixed(2)} x ${
              item.quantity
            } = ${item.totalDiscountedPrice.toFixed(2)}`
        )
      );
    } else {
      setFinalPrice("Invalid input");
      setItemPrices([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text mb-8">
        Dayone Pricing Calculator
      </h1>
      <div className="flex flex-col gap-4 w-full max-w-md">
        <InputField
          label="Total Price"
          placeholder="Total Price"
          value={totalPrice}
          onChange={(e) => setTotalPrice(e.target.value)}
        />
        <InputField
          label="Total Discount"
          placeholder="Total Discount"
          value={totalDiscount}
          onChange={(e) => setTotalDiscount(e.target.value)}
        />
        <div className="flex flex-col gap-4">
          <label className="mb-1 font-semibold">
            Price and Quantity for Each Item
          </label>
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <InputField
                placeholder={`Price for Item ${index + 1}`}
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", e.target.value)
                }
              />
              <InputField
                placeholder={`Quantity for Item ${index + 1}`}
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
              />
              <button
                onClick={() => removeItemField(index)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={items.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={addItemField}
          className="p-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Item
        </button>
        <button
          onClick={calculateFinalPrice}
          className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Calculate
        </button>
        {finalPrice !== null && (
          <div className="mt-4 p-3 border border-gray-300 rounded text-white">
            {itemPrices.map((itemPrice, index) => (
              <div key={index} className="mt-2">
                <p>{itemPrice}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
