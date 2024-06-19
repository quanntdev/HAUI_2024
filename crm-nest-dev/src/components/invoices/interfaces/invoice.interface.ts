import { IInvoiceOrderItem } from '../../invoice-order-items/interfaces/invoice-order-item.interface';
export interface IInvoice {
  customer_name: string
  country_name: string
  province_name: string
  postal_code: string
  address: string
  currency_name: string
  currency_sign: string
  code: string
  start_date: Date
  due_date: Date
  total_item: number
  total_original_value: number
  total_tax_value: number
  total_value: number
  status: number
  user: any
  order: any
  invoiceCategory: any
  invoiceOrderItems: IInvoiceOrderItem[]
}

