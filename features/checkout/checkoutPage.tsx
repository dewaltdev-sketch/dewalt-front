"use client";

import { useMemo } from "react";
import Breadcrumb from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import FormField from "@/components/formField";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCartContext } from "@/features/products/cart/cartContext";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Loading from "@/components/ui/loading";
import { useSession } from "next-auth/react";
import OrderSummary from "./components/orderSummary";
import OrderDeliveryOptions from "./components/orderDeliveryOptions";
import { getAvailableDeliveryTypes } from "./utils/delivery";
import { useCreateOrderPayment } from "@/features/orders/hooks/useCreateOrderPayment";
import { useFinaProductsRestArray } from "@/features/fina/hooks/useFinaProductsRestArray";
import { toast } from "sonner";

type DeliveryType = "tbilisi" | "region";
type CheckoutStockItem = {
  product: { finaId?: number; quantity?: number };
};

export type DeliveryInformation = {
  tbilisi: {
    price: number;
    freeOver: number;
    freeEnabled?: boolean;
  };
  region: {
    price: number;
    freeOver: number;
    freeEnabled?: boolean;
  };
};

function getCheckoutAvailableQuantity(
  item: CheckoutStockItem,
  restMap?: Record<number, number> | null
) {
  const localAvailable = item.product.quantity ?? 0;
  const finaId = item.product.finaId;

  if (typeof finaId !== "number" || !restMap) {
    return localAvailable;
  }

  const finaAvailable = restMap[finaId] ?? 0;

  // Respect both FINA stock and locally reserved stock.
  return Math.max(0, Math.min(localAvailable, finaAvailable));
}

export default function CheckoutPage({
  deliveryInformation,
}: {
  deliveryInformation?: DeliveryInformation | null;
}) {
  const t = useTranslations();
  const { getSelectedItems, isLoading } = useCartContext();
  const selectedItems = getSelectedItems();
  const { data: session } = useSession();
  const { startPayment, error: paymentError } = useCreateOrderPayment({
    fallbackErrorMessage: t("checkout.paymentError"),
  });

  const finaIdsToCheck = useMemo(
    () =>
      selectedItems
        .map((item) => item.product.finaId)
        .filter(
          (id): id is number => typeof id === "number" && Number.isFinite(id)
        ),
    [selectedItems]
  );

  const {
    data: finaRestMap,
    isLoading: isFinaRestLoading,
    isFetching: isFinaRestFetching,
    isError: isFinaRestError,
    refetch: refetchFinaRest,
  } = useFinaProductsRestArray(finaIdsToCheck);

  const insufficientItems = useMemo(() => {
    return selectedItems
      .map((item) => {
        const available = getCheckoutAvailableQuantity(item, finaRestMap);

        return {
          productId: item.product._id,
          name: item.product.name,
          requested: item.quantity,
          available,
        };
      })
      .filter((x) => x.requested > x.available);
  }, [selectedItems, finaRestMap]);

  const isStockCheckBlocking =
    (finaIdsToCheck.length > 0 && (isFinaRestLoading || isFinaRestFetching)) ||
    (finaIdsToCheck.length > 0 && isFinaRestError);

  const canPlaceOrder = insufficientItems.length === 0 && !isStockCheckBlocking;

  const availableDeliveryTypes = useMemo(
    () => getAvailableDeliveryTypes(deliveryInformation),
    [deliveryInformation]
  );

  const hasDeliveryOptions = availableDeliveryTypes.length > 0;
  const defaultDeliveryType: DeliveryType =
    availableDeliveryTypes[0] ?? "tbilisi";

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
    [selectedItems]
  );

  const totalItems = useMemo(
    () => selectedItems.reduce((total, item) => total + item.quantity, 0),
    [selectedItems]
  );

  const getDeliveryPrice = (type: DeliveryType) => {
    if (!selectedItems.length) return 0;
    const info = deliveryInformation?.[type];
    const price = info?.price ?? 0;
    if (typeof price !== "number" || price <= 0) return 0;

    const freeOver = info?.freeOver;
    const freeEnabled = info?.freeEnabled ?? true;
    if (
      freeEnabled &&
      typeof freeOver === "number" &&
      freeOver > 0 &&
      subtotal >= freeOver
    ) {
      return 0;
    }

    return price;
  };

  const validationSchema = Yup.object({
    name: Yup.string().trim().required(t("checkout.validation.name")),
    surname: Yup.string().trim().required(t("checkout.validation.surname")),
    email: Yup.string().trim().optional(),
    personalId: Yup.string()
      .matches(/^\d{11}$/, t("checkout.personalIdHint"))
      .required(t("checkout.validation.personalId")),
    phone: Yup.string()
      .trim()
      .matches(/^\d{9,}$/, t("checkout.validation.phoneInvalid"))
      .required(t("checkout.validation.phone")),
    address: Yup.string().trim().required(t("checkout.validation.address")),
    deliveryType: hasDeliveryOptions
      ? Yup.mixed<DeliveryType>().oneOf(availableDeliveryTypes).required()
      : Yup.mixed<DeliveryType>().optional(),
  });

  const breadcrumbItems = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.cart"), href: "/cart" },
    { label: t("breadcrumb.checkout") },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh]">
        <Breadcrumb items={breadcrumbItems} />
        <Loading minHeight="60vh" message={t("checkout.loadingMessage")} />
      </div>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <div>
        <Breadcrumb items={breadcrumbItems} />
        <div className="customContainer py-10 text-center">
          <p className="text-text-secondary text-lg">
            {t("checkout.emptySelection")}
          </p>
          <Link
            href="/cart"
            className="text-primary mt-3 inline-flex text-sm font-semibold hover:underline"
          >
            {t("checkout.backToCart")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-neutral md:bg-white">
        <div className="customContainer px-5 py-8 lg:px-0">
          <Formik
            initialValues={{
              name: session?.user?.name ?? "",
              surname: session?.user?.surname ?? "",
              email: session?.user?.email ?? "",
              personalId: "",
              phone: "",
              address: "",
              deliveryType: defaultDeliveryType as DeliveryType,
            }}
            validationSchema={validationSchema}
            validateOnMount
            onSubmit={async (values, { setSubmitting }) => {
              if (selectedItems.length === 0) {
                setSubmitting(false);
                return;
              }

              try {
                const effectiveDeliveryType = hasDeliveryOptions
                  ? values.deliveryType
                  : defaultDeliveryType;

                // Verify the freshest stock before starting payment
                let restMapToUse = finaRestMap ?? null;
                if (finaIdsToCheck.length > 0) {
                  const refreshed = await refetchFinaRest();
                  if (!refreshed.data || refreshed.isError) {
                    toast.error(t("checkout.stock.failed"));
                    return;
                  }
                  restMapToUse = refreshed.data;
                }

                const latestInsufficient = selectedItems
                  .map((item) => {
                    const available = getCheckoutAvailableQuantity(
                      item,
                      restMapToUse
                    );

                    return {
                      name: item.product.name,
                      requested: item.quantity,
                      available,
                    };
                  })
                  .filter((x) => x.requested > x.available);

                if (latestInsufficient.length > 0) {
                  latestInsufficient.forEach((item) => {
                    toast.error(
                      t("checkout.stock.insufficient", {
                        name: item.name,
                        requestedQuantity: item.requested,
                        availableQuantity: item.available,
                      })
                    );
                  });

                  return;
                }

                await startPayment(
                  {
                    name: values.name.trim(),
                    surname: values.surname.trim(),
                    email: values.email.trim(),
                    personalId: values.personalId.trim(),
                    phone: values.phone.trim(),
                    address: values.address.trim(),
                    deliveryType: effectiveDeliveryType,
                    items: selectedItems.map((item) => ({
                      productId: item.product._id,
                      quantity: item.quantity,
                    })),
                    userId: session?.user?._id,
                  },
                  { redirect: true }
                );
              } catch {
                // Error message is handled by the mutation hook
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, handleChange, isValid, isSubmitting, setTouched }) => {
              const effectiveDeliveryType =
                hasDeliveryOptions &&
                availableDeliveryTypes.includes(values.deliveryType)
                  ? values.deliveryType
                  : defaultDeliveryType;
              const deliveryPrice = getDeliveryPrice(effectiveDeliveryType);
              const totalPrice = subtotal + deliveryPrice;

              return (
                <Form className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
                    <h1 className="text-dark-secondary-100 mb-2 text-lg font-semibold">
                      {t("checkout.title")}
                    </h1>
                    <p className="text-text-secondary mb-6 text-sm">
                      {t("checkout.subtitle")}
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        name="name"
                        label={t("checkout.name")}
                        placeholder={t("checkout.namePlaceholder")}
                      />
                      <FormField
                        name="surname"
                        label={t("checkout.surname")}
                        placeholder={t("checkout.surnamePlaceholder")}
                      />
                      <FormField
                        name="email"
                        label={t("checkout.email")}
                        placeholder={t("checkout.emailPlaceholder")}
                        inputMode="email"
                      />
                      <FormField
                        name="personalId"
                        label={t("checkout.personalId")}
                        placeholder={t("checkout.personalIdPlaceholder")}
                        inputMode="numeric"
                        maxLength={11}
                        transform={(value) => value.replace(/\D/g, "")}
                      />
                      <FormField
                        name="phone"
                        label={t("checkout.phone")}
                        placeholder={t("checkout.phonePlaceholder")}
                        inputMode="tel"
                        transform={(value) => value.replace(/\D/g, "")}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        name="address"
                        label={t("checkout.address")}
                        placeholder={t("checkout.addressPlaceholder")}
                        as="textarea"
                        rows={4}
                      />
                    </div>

                    <OrderDeliveryOptions
                      deliveryInformation={deliveryInformation}
                      subtotal={subtotal}
                      value={effectiveDeliveryType}
                      onChange={handleChange}
                      availableDeliveryTypes={availableDeliveryTypes}
                    />

                    {paymentError && (
                      <p className="mt-3 text-sm text-red-500">
                        {paymentError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      variant="default"
                      size="md"
                      className="bg-primary hover:bg-primary/90 text-dark-secondary-100 mt-6 w-full"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (isValid) return;

                        setTouched({
                          name: true,
                          surname: true,
                          email: true,
                          personalId: true,
                          phone: true,
                          address: true,
                          deliveryType: true,
                        });
                        toast.error(t("checkout.validation.requiredFieldsToast"));
                      }}
                    >
                      {isSubmitting
                        ? t("checkout.submitting")
                        : t("checkout.placeOrder")}
                    </Button>
                    {!canPlaceOrder && (
                      <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {finaIdsToCheck.length > 0 &&
                        (isFinaRestLoading || isFinaRestFetching)
                          ? t("checkout.stock.checking")
                          : isFinaRestError
                            ? t("checkout.stock.failed")
                            : insufficientItems.map((item) => (
                                <div key={item.productId}>
                                  {t("checkout.stock.insufficient", {
                                    name: item.name,
                                    requestedQuantity: item.requested,
                                    availableQuantity: item.available,
                                  })}
                                </div>
                              ))}
                      </div>
                    )}
                  </div>

                  <OrderSummary
                    totalItems={totalItems}
                    subtotal={subtotal}
                    deliveryPrice={deliveryPrice}
                    totalPrice={totalPrice}
                  />
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
