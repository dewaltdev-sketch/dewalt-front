import CheckoutPage from "@/features/checkout/checkoutPage";
import { getSettings } from "@/features/settings/server/getSettings";

export default async function Page() {
  const settings = await getSettings();

  const deliveryInformation = {
    tbilisi: {
      price: settings?.deliveryTbilisiPrice || 0,
      freeOver: settings?.deliveryTbilisiFreeOver || 0,
      freeEnabled: settings?.freeDeliveryEnabled ?? true,
    },
    region: {
      price: settings?.deliveryRegionPrice || 0,
      freeOver: settings?.deliveryRegionFreeOver || 0,
      freeEnabled: settings?.freeDeliveryEnabled ?? true,
    },
    officePickup: {
      price: 0,
      freeEnabled: false,
    },
  };
  return <CheckoutPage deliveryInformation={deliveryInformation} />;
}
