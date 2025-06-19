export function ExchangeMoneyIcon({
  strokeWidth = 2,
}: {
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        d="M10 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0M6.066 15C3.694 15 4.033 17.21 2 17.21V21c3.389 0 4.667-1.436 7.455-1.263 5.083.316 5.916-2.698 5.422-3.158s-1.017.631-3.05.631c-2.169 0-3.614.316-4.066.316 0 0 1.694-.631 2.71-.631.852 0 1.017-1.895.34-1.895zM17.934 8C20.306 8 19.967 5.79 22 5.79V2c-3.389 0-4.667 1.436-7.455 1.263-5.083-.316-5.916 2.698-5.422 3.158s1.017-.632 3.05-.632c2.169 0 3.614-.315 4.066-.315 0 0-1.694.631-2.71.631-.852 0-1.017 1.895-.34 1.895z"
      />
    </svg>
  );
}
