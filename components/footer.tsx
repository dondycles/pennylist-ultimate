import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-row flex-wrap justify-between w-full gap-4 p-4 text-sm text-muted-foreground mb-0 mt-auto">
      <Link href={"/"}>© pennylist. 1.0.0 | 2024 </Link>
      <div className="flex flex-row gap-4">
        <Link href={"/privacypolicy"}>Privacy Policy</Link>
        <Link href={"/termsandconditions"}>Terms and Conditions</Link>
        <Link href={"/refundpolicy"}>Refund Policy</Link>
      </div>
    </footer>
  );
}
