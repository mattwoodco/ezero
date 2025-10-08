"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  InvoiceItem,
  InvoiceSettings,
  OrderItem,
  OrderSettings,
  OrderStatus,
  PaymentStatus,
  PromotionSettings,
} from "@/types/email";

// Order Settings Component
interface OrderSettingsProps {
  settings: OrderSettings;
  onChange: (settings: OrderSettings) => void;
}

export function OrderSettingsComponent({
  settings,
  onChange,
}: OrderSettingsProps) {
  const updateField = <K extends keyof OrderSettings>(
    field: K,
    value: OrderSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  const addItem = () => {
    const newItem: OrderItem = {
      name: "",
      quantity: 1,
      price: 0,
    };
    onChange({ ...settings, items: [...settings.items, newItem] });
  };

  const updateItem = (index: number, updates: Partial<OrderItem>) => {
    const newItems = [...settings.items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange({ ...settings, items: newItems });

    // Recalculate totals
    const subtotal = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    onChange({
      ...settings,
      items: newItems,
      subtotal,
      total: subtotal + (settings.tax || 0) + (settings.shipping || 0),
    });
  };

  const removeItem = (index: number) => {
    const newItems = settings.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    onChange({
      ...settings,
      items: newItems,
      subtotal,
      total: subtotal + (settings.tax || 0) + (settings.shipping || 0),
    });
  };

  const updateTotals = (field: "tax" | "shipping", value: number) => {
    const newSettings = { ...settings, [field]: value };
    newSettings.total =
      newSettings.subtotal +
      (newSettings.tax || 0) +
      (newSettings.shipping || 0);
    onChange(newSettings);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="order-number">Order Number *</Label>
        <Input
          id="order-number"
          value={settings.orderNumber || ""}
          onChange={(e) => updateField("orderNumber", e.target.value)}
          placeholder="e.g., ORD-2025-12345"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-date">Order Date * (ISO 8601)</Label>
        <Input
          id="order-date"
          type="datetime-local"
          value={settings.orderDate ? settings.orderDate.substring(0, 16) : ""}
          onChange={(e) => updateField("orderDate", `${e.target.value}:00Z`)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-status">Order Status *</Label>
        <Select
          value={settings.orderStatus}
          onValueChange={(value) =>
            updateField("orderStatus", value as OrderStatus)
          }
        >
          <SelectTrigger id="order-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OrderProcessing">Processing</SelectItem>
            <SelectItem value="OrderShipped">Shipped</SelectItem>
            <SelectItem value="OrderDelivered">Delivered</SelectItem>
            <SelectItem value="OrderCancelled">Cancelled</SelectItem>
            <SelectItem value="OrderReturned">Returned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-merchant-name">Merchant Name *</Label>
        <Input
          id="order-merchant-name"
          value={settings.merchantName || ""}
          onChange={(e) => updateField("merchantName", e.target.value)}
          placeholder="e.g., Example Store"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-merchant-logo">Merchant Logo URL</Label>
        <Input
          id="order-merchant-logo"
          value={settings.merchantLogo || ""}
          onChange={(e) => updateField("merchantLogo", e.target.value)}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-customer-name">Customer Name *</Label>
        <Input
          id="order-customer-name"
          value={settings.customerName || ""}
          onChange={(e) => updateField("customerName", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-customer-email">Customer Email</Label>
        <Input
          id="order-customer-email"
          type="email"
          value={settings.customerEmail || ""}
          onChange={(e) => updateField("customerEmail", e.target.value)}
          placeholder="john@example.com"
        />
      </div>

      {/* Order Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Order Items *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        {settings.items.length === 0 ? (
          <div className="p-4 border-2 border-dashed rounded-lg text-center text-sm text-muted-foreground">
            No items added. Click "Add Item" to add products.
          </div>
        ) : (
          <div className="space-y-3">
            {settings.items.map((item, index) => (
              <div
                key={`order-item-${index}-${item.name || ""}-${item.sku || ""}`}
                className="p-3 border rounded-lg space-y-2 bg-muted/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <Input
                  placeholder="Product Name *"
                  value={item.name}
                  onChange={(e) => updateItem(index, { name: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Price *"
                    value={item.price || ""}
                    onChange={(e) =>
                      updateItem(index, {
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Qty *"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateItem(index, {
                        quantity: parseInt(e.target.value, 10) || 1,
                      })
                    }
                  />
                </div>

                <Input
                  placeholder="SKU"
                  value={item.sku || ""}
                  onChange={(e) => updateItem(index, { sku: e.target.value })}
                />

                <Input
                  placeholder="Image URL"
                  value={item.image || ""}
                  onChange={(e) => updateItem(index, { image: e.target.value })}
                />

                <div className="text-sm font-medium text-right">
                  Total: $
                  {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2 pt-2 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="order-tax">Tax</Label>
            <Input
              id="order-tax"
              type="number"
              step="0.01"
              value={settings.tax || ""}
              onChange={(e) =>
                updateTotals("tax", parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-shipping">Shipping</Label>
            <Input
              id="order-shipping"
              type="number"
              step="0.01"
              value={settings.shipping || ""}
              onChange={(e) =>
                updateTotals("shipping", parseFloat(e.target.value) || 0)
              }
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>${(settings.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Total:</span>
            <span>${(settings.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-currency">Currency *</Label>
        <Select
          value={settings.currency}
          onValueChange={(value) => updateField("currency", value)}
        >
          <SelectTrigger id="order-currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="CAD">CAD</SelectItem>
            <SelectItem value="AUD">AUD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order-view-url">View Order URL</Label>
        <Input
          id="order-view-url"
          value={settings.viewOrderUrl || ""}
          onChange={(e) => updateField("viewOrderUrl", e.target.value)}
          placeholder="https://example.com/orders/123"
        />
      </div>
    </div>
  );
}

// Invoice Settings Component
interface InvoiceSettingsProps {
  settings: InvoiceSettings;
  onChange: (settings: InvoiceSettings) => void;
}

export function InvoiceSettingsComponent({
  settings,
  onChange,
}: InvoiceSettingsProps) {
  const updateField = <K extends keyof InvoiceSettings>(
    field: K,
    value: InvoiceSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    onChange({ ...settings, items: [...settings.items, newItem] });
  };

  const updateItem = (index: number, updates: Partial<InvoiceItem>) => {
    const newItems = [...settings.items];
    newItems[index] = { ...newItems[index], ...updates };

    // Auto-calculate total for this item
    if (updates.quantity !== undefined || updates.unitPrice !== undefined) {
      const item = newItems[index];
      newItems[index].total = item.quantity * item.unitPrice;
    }

    onChange({ ...settings, items: newItems });

    // Recalculate invoice totals
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    onChange({
      ...settings,
      items: newItems,
      subtotal,
      total: subtotal + (settings.tax || 0),
    });
  };

  const removeItem = (index: number) => {
    const newItems = settings.items.filter((_, i) => i !== index);
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0);
    onChange({
      ...settings,
      items: newItems,
      subtotal,
      total: subtotal + (settings.tax || 0),
    });
  };

  const updateTax = (value: number) => {
    onChange({
      ...settings,
      tax: value,
      total: settings.subtotal + value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="invoice-number">Invoice Number *</Label>
        <Input
          id="invoice-number"
          value={settings.invoiceNumber || ""}
          onChange={(e) => updateField("invoiceNumber", e.target.value)}
          placeholder="e.g., INV-2025-001"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoice-date">Invoice Date * (ISO 8601)</Label>
          <Input
            id="invoice-date"
            type="datetime-local"
            value={
              settings.invoiceDate ? settings.invoiceDate.substring(0, 16) : ""
            }
            onChange={(e) =>
              updateField("invoiceDate", `${e.target.value}:00Z`)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoice-due-date">Due Date * (ISO 8601)</Label>
          <Input
            id="invoice-due-date"
            type="datetime-local"
            value={settings.dueDate ? settings.dueDate.substring(0, 16) : ""}
            onChange={(e) => updateField("dueDate", `${e.target.value}:00Z`)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-status">Payment Status *</Label>
        <Select
          value={settings.paymentStatus}
          onValueChange={(value) =>
            updateField("paymentStatus", value as PaymentStatus)
          }
        >
          <SelectTrigger id="invoice-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Unpaid">Unpaid</SelectItem>
            <SelectItem value="PartiallyPaid">Partially Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-provider-name">Provider Name *</Label>
        <Input
          id="invoice-provider-name"
          value={settings.providerName || ""}
          onChange={(e) => updateField("providerName", e.target.value)}
          placeholder="e.g., ACME Inc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-provider-logo">Provider Logo URL</Label>
        <Input
          id="invoice-provider-logo"
          value={settings.providerLogo || ""}
          onChange={(e) => updateField("providerLogo", e.target.value)}
          placeholder="https://example.com/logo.png"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-customer-name">Customer Name *</Label>
        <Input
          id="invoice-customer-name"
          value={settings.customerName || ""}
          onChange={(e) => updateField("customerName", e.target.value)}
          placeholder="e.g., John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-account-id">Account ID *</Label>
        <Input
          id="invoice-account-id"
          value={settings.accountId || ""}
          onChange={(e) => updateField("accountId", e.target.value)}
          placeholder="e.g., ACC-123456"
        />
      </div>

      {/* Invoice Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Line Items *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Item
          </Button>
        </div>

        {settings.items.length === 0 ? (
          <div className="p-4 border-2 border-dashed rounded-lg text-center text-sm text-muted-foreground">
            No line items added. Click "Add Item" to add invoice items.
          </div>
        ) : (
          <div className="space-y-3">
            {settings.items.map((item, index) => (
              <div
                key={`invoice-item-${index}-${item.description || ""}`}
                className="p-3 border rounded-lg space-y-2 bg-muted/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <Input
                  placeholder="Description *"
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, { description: e.target.value })
                  }
                />

                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    placeholder="Qty *"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      updateItem(index, {
                        quantity: parseInt(e.target.value, 10) || 1,
                      })
                    }
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Unit Price *"
                    value={item.unitPrice || ""}
                    onChange={(e) =>
                      updateItem(index, {
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Total"
                    value={item.total.toFixed(2)}
                    disabled
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2 pt-2 border-t">
        <div className="space-y-2">
          <Label htmlFor="invoice-tax">Tax</Label>
          <Input
            id="invoice-tax"
            type="number"
            step="0.01"
            value={settings.tax || ""}
            onChange={(e) => updateTax(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>${(settings.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Total:</span>
            <span>${(settings.total || 0).toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoice-min-payment">Minimum Payment Due</Label>
          <Input
            id="invoice-min-payment"
            type="number"
            step="0.01"
            value={settings.minimumPaymentDue || ""}
            onChange={(e) =>
              updateField(
                "minimumPaymentDue",
                parseFloat(e.target.value) || undefined,
              )
            }
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-currency">Currency *</Label>
        <Select
          value={settings.currency}
          onValueChange={(value) => updateField("currency", value)}
        >
          <SelectTrigger id="invoice-currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD</SelectItem>
            <SelectItem value="EUR">EUR</SelectItem>
            <SelectItem value="GBP">GBP</SelectItem>
            <SelectItem value="CAD">CAD</SelectItem>
            <SelectItem value="AUD">AUD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="invoice-payment-url">Payment URL</Label>
        <Input
          id="invoice-payment-url"
          value={settings.paymentUrl || ""}
          onChange={(e) => updateField("paymentUrl", e.target.value)}
          placeholder="https://example.com/pay/inv-123"
        />
      </div>
    </div>
  );
}

// Promotion Settings Component
interface PromotionSettingsProps {
  settings: PromotionSettings;
  onChange: (settings: PromotionSettings) => void;
}

export function PromotionSettingsComponent({
  settings,
  onChange,
}: PromotionSettingsProps) {
  const updateField = <K extends keyof PromotionSettings>(
    field: K,
    value: PromotionSettings[K],
  ) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="promo-description">Description *</Label>
        <Input
          id="promo-description"
          value={settings.description || ""}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="e.g., Get 20% off your next purchase"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promo-headline">Headline</Label>
        <Input
          id="promo-headline"
          value={settings.headline || ""}
          onChange={(e) => updateField("headline", e.target.value)}
          placeholder="e.g., Limited Time Offer!"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promo-code">Discount Code</Label>
        <Input
          id="promo-code"
          value={settings.discountCode || ""}
          onChange={(e) => updateField("discountCode", e.target.value)}
          placeholder="e.g., SAVE20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promo-discount-percent">Discount Percent</Label>
        <Input
          id="promo-discount-percent"
          type="number"
          min="0"
          max="100"
          value={settings.discountPercent || ""}
          onChange={(e) =>
            updateField(
              "discountPercent",
              parseInt(e.target.value, 10) || undefined,
            )
          }
          placeholder="e.g., 20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="promo-start">Availability Starts (ISO 8601)</Label>
          <Input
            id="promo-start"
            type="datetime-local"
            value={
              settings.availabilityStarts
                ? settings.availabilityStarts.substring(0, 16)
                : ""
            }
            onChange={(e) =>
              updateField("availabilityStarts", `${e.target.value}:00Z`)
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="promo-end">Availability Ends (ISO 8601)</Label>
          <Input
            id="promo-end"
            type="datetime-local"
            value={
              settings.availabilityEnds
                ? settings.availabilityEnds.substring(0, 16)
                : ""
            }
            onChange={(e) =>
              updateField("availabilityEnds", `${e.target.value}:00Z`)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="promo-image">Promotion Image URL</Label>
        <Input
          id="promo-image"
          value={settings.promotionImage || ""}
          onChange={(e) => updateField("promotionImage", e.target.value)}
          placeholder="https://example.com/promo.jpg"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="promo-url">Promotion URL</Label>
        <Input
          id="promo-url"
          value={settings.promotionUrl || ""}
          onChange={(e) => updateField("promotionUrl", e.target.value)}
          placeholder="https://example.com/sale"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="promo-price">Price</Label>
          <Input
            id="promo-price"
            type="number"
            step="0.01"
            value={settings.price || ""}
            onChange={(e) =>
              updateField("price", parseFloat(e.target.value) || undefined)
            }
            placeholder="99.99"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="promo-currency">Currency</Label>
          <Select
            value={settings.currency || "USD"}
            onValueChange={(value) => updateField("currency", value)}
          >
            <SelectTrigger id="promo-currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="CAD">CAD</SelectItem>
              <SelectItem value="AUD">AUD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
