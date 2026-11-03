const DELHIVERY_TRACKING_URL = "https://track.delhivery.com/api/v1/packages/json/";

export interface DelhiveryTracking {
  status: string;
  statusType: string;
  statusDateTime: string;
  location: string;
  remarks: string;
}

function getApiKey() {
  const apiKey = process.env.DELHIVERY_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DELHIVERY_API_KEY is not configured.");
  }
  return apiKey;
}

export async function getDelhiveryHeaders() {
  return {
    Accept: "application/json",
    Authorization: `Token ${getApiKey()}`,
  };
}

export async function getDelhiveryTracking(awb: string): Promise<DelhiveryTracking | null> {
  const cleanAwb = awb.trim();
  if (!cleanAwb) return null;

  const response = await fetch(
    `${DELHIVERY_TRACKING_URL}?waybill=${encodeURIComponent(cleanAwb)}`,
    {
      headers: await getDelhiveryHeaders(),
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error(`Delhivery tracking request failed with status ${response.status}.`);
  }

  const data = (await response.json()) as {
    ShipmentData?: Array<{
      Shipment?: {
        Status?: { Status?: string; StatusType?: string; StatusDateTime?: string; Instructions?: string };
        Scans?: Array<{
          ScanDetail?: {
            ScanDateTime?: string;
            ScannedLocation?: string;
            Instructions?: string;
          };
        }>;
      };
    }>;
  };
  const shipment = data.ShipmentData?.[0]?.Shipment;
  if (!shipment) return null;

  const status = shipment.Status;
  const latestScan = shipment.Scans?.[0]?.ScanDetail;
  return {
    status: status?.Status || "Tracking information received",
    statusType: status?.StatusType || "",
    statusDateTime: status?.StatusDateTime || latestScan?.ScanDateTime || "",
    location: latestScan?.ScannedLocation || "",
    remarks: status?.Instructions || latestScan?.Instructions || "",
  };
}
