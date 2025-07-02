// Database TypeScript Interfaces
export interface Customer {
  customer_id: string;
  customer_name: string;
  customer_location_country: string;
  customer_location_state: string;
  customer_email: string;
  customer_phone: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  device_id: string;
  customer_id: string;
  context_id: string;
  dataset_id: string;
  device_context_datetime: string;
  device_context_id: string;
  device_bios_version: string;
  device_brand: string;
  device_ec_version: string;
  device_enclosuretype: string;
  device_family: string;
  device_id2: string;
  device_info_datetime: string;
  device_manufacturer: string;
  device_modeltype: string;
  device_name: string;
  device_purchase_date: string;
  device_smbios_version: string;
  device_subbrand: string;
  os_country: string;
  os_language: string;
  os_name: string;
  os_update_description: string;
  os_update_title: string;
  os_version: string;
  country_code: string;
  country_name: string;
  language_code: string;
  language_name: string;
  region_info_datetime: string;
  region_name: string;
  report_time: string;
  schema_ver: string;
  subscription_id: string;
  subscription_ids: string;
  udc_channel: string;
  udc_id: string;
  udc_info_datetime: string;
  udc_key: string;
  udc_name: string;
  udc_version: string;
}

export interface Inventory {
  sku_id: string;
  battery_type: string;
  quantity_in_stock: number;
  inventory_location_country: string;
  inventory_location_state: string;
  warehouse_location: string;
  last_updated: string;
  min_stock_threshold: number;
  reorder_quantity: number;
  device_manufacturer: string;
  device_brand: string;
}

export interface WarrantyProductMaster {
  warranty_product_code: string;
  warranty_product_name: string;
  warranty_period_in_months: number;
  claim_limit: number;
  product_launched_date: string;
  product_price: number;
  active_status: boolean;
  sla_adherence_perc: number;
  nps_score_ly: number;
  nps_score_ty: number;
  churn_rate_before_expiry: number;
  churn_rate_after_expiry: number;
  warranty_invocation_perc: number;
  cost_of_fulfillment: number;
  no_claim_perc: number;
}

export interface WarrantyInstance {
  warranty_instance_id: string;
  warranty_product_code: string;
  device_id: string;
  customer_id: string;
  warranty_start_date: string;
  warranty_end_date: string;
  claim_count: number;
  created_at: string;
  updated_at: string;
}

export interface NetworkEvent {
  item_id: string;
  dataset_context_id: string;
  dataset_id: string;
  device_context_id: string;
  device_id: string;
  item_context_id: string;
  ConnectionType: string;
  IPv4Gateway: string;
  IPv4address: string;
  IPv6Gateway: string;
  IPv6address: string;
  InternetConnection: string;
  LinkSpeed: number;
  MACAddress: string;
  WLANSecurity: string;
  WLANSsid: string;
  item_name: string;
  item_time: string;
  report_time: string;
  schema_ver: string;
  subscription_id: string;
  subscription_ids: string;
}

export interface DriverEvent {
  item_id: string;
  dataset_context_id: string;
  dataset_id: string;
  device_context_id: string;
  device_id: string;
  item_context_id: string;
  State: string;
  Status: string;
  DriverName: string;
  item_name: string;
  item_time: string;
  report_time: string;
  schema_ver: string;
  subscription_id: string;
  subscription_ids: string;
}

export interface Issue {
  item_id: string;
  dataset_context_id: string;
  dataset_id: string;
  device_context_id: string;
  device_id: string;
  item_context_id: string;
  issue_status: string;
  issue_title: string;
  issue_type_id: string;
  item_name: string;
  timestamp: string;
  report_time: string;
  schema_ver: string;
  subscription_id: string;
  subscription_ids: string;
}

export interface MemoryEvent {
  item_id: string;
  dataset_context_id: string;
  dataset_id: string;
  device_context_id: string;
  device_id: string;
  item_context_id: string;
  FreePhysicalMemory: string;
  VisibleMemory: string;
  item_name: string;
  item_time: string;
  report_time: string;
  schema_ver: string;
  subscription_id: string;
  subscription_ids: string;
}

export interface ProcessEvent {
  item_id: string;
  dataset_context_id: string;
  dataset_id: string;
  device_context_id: string;
  device_id: string;
  item_context_id: string;
  CPUUsage: string;
  ProcessCount: number;
  SystemState: string;
  ThreadCount: number;
  item_name: string;
  item_time: string;
  report_time: string;
  schema_ver: string;
  subscription_id: string;
  subscription_ids: string;
}

export interface ProcessEventProcessUsage {
  event_id: string;
  process_index: number;
  Process_CpuUsagePerc: string;
  Process_FileDescription: string;
  Process_FileModifiedDate: string;
  Process_FileName: string;
  Process_FilePublisher: string;
  Process_FileVersion: string;
  Process_Id: string;
  Process_ProductName: string;
  Process_ThreadCpuUsagePerc: string;
  Process_ThreadId: string;
}

export interface StorageEvent {
  item_id: string;
  dataset_context_id: string;
  dataset_id: string;
  device_context_id: string;
  device_id: string;
  item_context_id: string;
  schema_ver: string;
  item_name: string;
  item_time: string;
  DiskStatus: string;
  DiskFreeSpace: string;
  DiskFreePercentage: number;
  report_time: string;
  subscription_id: string;
  subscription_ids: string;
}

export interface DeviceEventStatus {
  item_id: string;
  dataset_context_id: string;
  dataset_id: string;
  device_context_id: string;
  device_id: string;
  item_context_id: string;
  status: string;
  item_name: string;
  item_time: string;
  report_time: string;
  schema_ver: string;
  subscription_id: string;
  subscription_ids: string;
}

export interface BatteryFailurePrediction {
  device_id: string;
  timestamp: string;
  actual_is_battery_failing: number;
  predicted_is_battery_failing: number;
  prediction_probability_failing: number;
}
