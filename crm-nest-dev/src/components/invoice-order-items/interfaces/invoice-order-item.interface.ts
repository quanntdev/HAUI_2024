export class IInvoiceOrderItem {
  order_item_id: number
  value: number
  tax_rate: number
  total_value: number
  orderItem?: number
  name?: string
}

export class IInvoiceOrderItemUpdate {
  id: number
  name: string
  value: number
  tax_rate: number
  total_value: number
}
