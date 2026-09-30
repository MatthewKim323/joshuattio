// Phone-only wording: the longer brand name pushes a few story lines onto an extra
// row at phone width, so these spots swap in a slightly shorter phrase below md.
export function MobileCopy({ sm, children }: { sm: string; children: string }) {
  return (
    <>
      {sm ? <span className="md:hidden">{sm}</span> : null}
      <span className="max-md:hidden">{children}</span>
    </>
  );
}
