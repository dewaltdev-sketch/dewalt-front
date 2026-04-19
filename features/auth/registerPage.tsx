"use client";

import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import EnvelopIcon from "@/components/icons/envelopIcon";
import KeyIcon from "@/components/icons/keyIcon";
import EyeOpenIcon from "@/components/icons/eyeOpenIcon";
import EyeClosedIcon from "@/components/icons/eyeClosedIcon";
import { toast } from "sonner";
import { useRegister } from "./hooks";
import AuthPageWrapper from "./components/authPageWraper";

export default function RegisterPage() {
  const t = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const { register, error, isLoading, clearError } = useRegister();

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, t("auth.validation.nameMin"))
      .required(t("auth.validation.nameRequired")),
    surname: Yup.string()
      .min(2, t("auth.validation.surnameMin"))
      .required(t("auth.validation.surnameRequired")),
    email: Yup.string()
      .email(t("auth.validation.emailInvalid"))
      .required(t("auth.validation.emailRequired")),
    password: Yup.string()
      .min(6, t("auth.validation.passwordMin"))
      .required(t("auth.validation.passwordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], t("auth.validation.passwordsMatch"))
      .required(t("auth.validation.confirmPasswordRequired")),
  });

  const initialValues = {
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!agreeToTerms) {
      setTermsError(true);
      toast.error(t("auth.validation.termsRequired"));
      return;
    }

    setTermsError(false);

    register({
      name: values.name,
      surname: values.surname,
      email: values.email,
      password: values.password,
    });
  };

  return (
    <AuthPageWrapper title={t("auth.register.title")}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-6">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="text-dark-secondary-100 mb-2 block text-sm font-medium"
              >
                {t("auth.register.name")}
              </label>
              <Field name="name">
                {({ field }: FieldProps<string>) => (
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder={t("auth.register.name")}
                    error={!!(errors.name && touched.name)}
                    onChange={(event) => {
                      clearError();
                      field.onChange(event);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="name"
                component="div"
                className="mt-1 text-xs text-red-500"
              />
            </div>

            {/* Surname Field */}
            <div>
              <label
                htmlFor="surname"
                className="text-dark-secondary-100 mb-2 block text-sm font-medium"
              >
                {t("auth.register.surname")}
              </label>
              <Field name="surname">
                {({ field }: FieldProps<string>) => (
                  <Input
                    {...field}
                    id="surname"
                    type="text"
                    placeholder={t("auth.register.surname")}
                    error={!!(errors.surname && touched.surname)}
                    onChange={(event) => {
                      clearError();
                      field.onChange(event);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="surname"
                component="div"
                className="mt-1 text-xs text-red-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="text-dark-secondary-100 mb-2 block text-sm font-medium"
              >
                {t("auth.register.email")}
              </label>
              <Field name="email">
                {({ field }: FieldProps<string>) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder={t("auth.register.email")}
                    icon={<EnvelopIcon />}
                    error={!!(errors.email && touched.email)}
                    onChange={(event) => {
                      clearError();
                      field.onChange(event);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="email"
                component="div"
                className="mt-1 text-xs text-red-500"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="text-dark-secondary-100 mb-2 block text-sm font-medium"
              >
                {t("auth.register.password")}
              </label>
              <Field name="password">
                {({ field }: FieldProps<string>) => (
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="**********"
                    icon={<KeyIcon />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-text-secondary hover:text-dark-secondary-100"
                        aria-label={
                          showPassword
                            ? t("auth.common.hidePassword")
                            : t("auth.common.showPassword")
                        }
                        aria-pressed={showPassword}
                      >
                        {!showPassword ? (
                          <EyeClosedIcon className="h-5 w-5" />
                        ) : (
                          <EyeOpenIcon className="h-5 w-5" />
                        )}
                      </button>
                    }
                    error={!!(errors.password && touched.password)}
                    onChange={(event) => {
                      clearError();
                      field.onChange(event);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="div"
                className="mt-1 text-xs text-red-500"
              />
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="text-dark-secondary-100 mb-2 block text-sm font-medium"
              >
                {t("auth.register.confirmPassword")}
              </label>
              <Field name="confirmPassword">
                {({ field }: FieldProps<string>) => (
                  <Input
                    {...field}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="**********"
                    icon={<KeyIcon />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="text-text-secondary hover:text-dark-secondary-100"
                        aria-label={
                          showConfirmPassword
                            ? t("auth.common.hidePassword")
                            : t("auth.common.showPassword")
                        }
                        aria-pressed={showConfirmPassword}
                      >
                        {!showConfirmPassword ? (
                          <EyeClosedIcon className="h-5 w-5" />
                        ) : (
                          <EyeOpenIcon className="h-5 w-5" />
                        )}
                      </button>
                    }
                    error={
                      !!(errors.confirmPassword && touched.confirmPassword)
                    }
                    onChange={(event) => {
                      clearError();
                      field.onChange(event);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="mt-1 text-xs text-red-500"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              size="default"
              className="w-full"
              disabled={isLoading}
            >
              {t("auth.register.submit")}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-text-secondary text-sm">
                {t("auth.register.hasAccount")}{" "}
              </span>
              <Link
                href="/login"
                className="text-primary text-sm font-medium hover:underline"
              >
                {t("auth.register.login")}
              </Link>
            </div>

            {/* Terms Checkbox */}
            <div className="bg-background p-4 pt-4">
              <Checkbox
                checked={agreeToTerms}
                onChange={(e) => {
                  setAgreeToTerms(e.target.checked);
                  setTermsError(false);
                }}
                label={
                  <>
                    <Link
                      href="/terms"
                      className="text-text-secondary text-xs hover:underline"
                    >
                      {t("auth.register.agreeTerms")}
                    </Link>{" "}
                    <Link
                      href="/privacy"
                      className="text-text-secondary text-xs hover:underline"
                    >
                      {t("auth.register.agreePrivacyPolicy")}
                    </Link>
                  </>
                }
                labelClassName="text-text-secondary text-xs pl-2"
                className="gap-2"
              />
              {termsError && (
                <div className="mt-2 text-xs text-red-500">
                  {t("auth.validation.termsRequired")}
                </div>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </AuthPageWrapper>
  );
}
