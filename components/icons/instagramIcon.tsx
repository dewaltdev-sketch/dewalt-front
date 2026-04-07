export default function InstagramIcon({
  className = "text-primary",
}: {
  className?: string;
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 2H8C4.69 2 2 4.69 2 8V16C2 19.31 4.69 22 8 22H16C19.31 22 22 19.31 22 16V8C22 4.69 19.31 2 16 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4 11.37C15.52 12.18 15.38 13.01 15 13.74C14.62 14.47 14.02 15.07 13.29 15.45C12.56 15.83 11.73 15.97 10.92 15.85C10.11 15.73 9.35 15.35 8.76 14.76C8.17 14.17 7.79 13.41 7.67 12.6C7.55 11.79 7.69 10.96 8.07 10.23C8.45 9.5 9.05 8.9 9.78 8.52C10.51 8.14 11.34 8 12.15 8.12C12.98 8.24 13.75 8.63 14.34 9.22C14.93 9.81 15.32 10.58 15.4 11.37Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 7.5H16.51"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
