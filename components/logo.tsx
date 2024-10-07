import { cn } from "@/lib/utils";
/**
 * Logo component.
 * @param {Object} props - The component props.
 * @param {React.HTMLAttributes<SVGElement>["className"]} props.className - The class name for the SVG element.
 * @param {React.SVGAttributes<SVGElement>["strokeWidth"]} props.strokeWidth - The stroke width for the SVG element.
 * @param {number} props.zoom - The zoom level for the SVG element.
 * @returns {JSX.Element} The rendered Logo component.
 */

export default function Logo({
  className,
  strokeWidth,
  zoom,
}: {
  className?: React.HTMLAttributes<SVGElement>["className"];
  strokeWidth?: React.SVGAttributes<SVGElement>["strokeWidth"];
  zoom: number;
}): JSX.Element {
  const minX = 0 + (zoom * 100) / 2;
  const minY = 0 + (zoom * 100) / 2;
  const width = 3000 - zoom * 100;
  const height = 3000 - zoom * 100;

  const viewBox = `${minX} ${minY} ${width} ${height}`;

  return (
    <svg
      className={cn("", className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
    >
      <rect className="fill-background" width="3000" height="3000" />
      <rect
        className="fill-background"
        x="481.17"
        y="2222.02"
        width="2037.66"
        height="296.81"
        rx="59"
      />
      <path
        className="fill-foreground"
        stroke="hsl(var(--foreground))"
        strokeWidth={strokeWidth}
        d="M2459.83,2238a43,43,0,0,1,43,43v178.81a43,43,0,0,1-43,43H540.17a43,43,0,0,1-43-43V2281a43,43,0,0,1,43-43H2459.83m0-32H540.17a75,75,0,0,0-75,75v178.81a75,75,0,0,0,75,75H2459.83a75,75,0,0,0,75-75V2281a75,75,0,0,0-75-75Z"
      />
      <rect
        className="fill-background"
        x="481.17"
        y="1786.81"
        width="2037.66"
        height="296.81"
        rx="59"
      />
      <path
        className="fill-foreground"
        stroke="hsl(var(--foreground))"
        strokeWidth={strokeWidth}
        d="M2459.83,1802.81a43,43,0,0,1,43,43v178.81a43,43,0,0,1-43,43H540.17a43,43,0,0,1-43-43V1845.81a43,43,0,0,1,43-43H2459.83m0-32H540.17a75,75,0,0,0-75,75v178.81a75,75,0,0,0,75,75H2459.83a75,75,0,0,0,75-75V1845.81a75,75,0,0,0-75-75Z"
      />
      <rect
        className="fill-background"
        x="481.17"
        y="1351.59"
        width="2037.66"
        height="296.81"
        rx="59"
      />
      <path
        className="fill-foreground"
        stroke="hsl(var(--foreground))"
        strokeWidth={strokeWidth}
        d="M2459.83,1367.59a43,43,0,0,1,43,43v178.82a43,43,0,0,1-43,43H540.17a43,43,0,0,1-43-43V1410.59a43,43,0,0,1,43-43H2459.83m0-32H540.17a75,75,0,0,0-75,75v178.82a75,75,0,0,0,75,75H2459.83a75,75,0,0,0,75-75V1410.59a75,75,0,0,0-75-75Z"
      />
      <rect
        className="fill-foreground"
        x="481.17"
        y="481.18"
        width="2037.66"
        height="732.02"
        rx="59"
      />
      <path
        className="fill-foreground"
        stroke="hsl(var(--foreground))"
        strokeWidth={strokeWidth}
        d="M2459.83,497.18a43,43,0,0,1,43,43v614a43,43,0,0,1-43,43H540.17a43,43,0,0,1-43-43v-614a43,43,0,0,1,43-43H2459.83m0-32H540.17a75,75,0,0,0-75,75v614a75,75,0,0,0,75,75H2459.83a75,75,0,0,0,75-75v-614a75,75,0,0,0-75-75Z"
      />
    </svg>
  );
}
