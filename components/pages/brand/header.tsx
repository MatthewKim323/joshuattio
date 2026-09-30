// Page header for the brand route: title and summary above the frame.
export function BrandHeader() {
  return (
    <header className="grid grid-cols-24 border-subtle-stroke border-x max-lg:border-none">
      <div className="col-[3/-3]">
        <header className="flex w-full flex-col pt-30 max-xl:pt-25 max-lg:pt-20 max-lg:items-center pb-20" style={{"--animate-delay":"0ms","--animate-delay-mobile":"0ms"}}>
          <h1 className="max-w-[15em] text-balance text-heading-responsive-lg max-lg:text-center">
            {"Brand guidelines and press kit."}
          </h1>
          <p className="mt-4 max-w-xl text-balance text-lg text-secondary-foreground lg:text-xl max-lg:text-center">
            {"Guidelines and assets for referencing Joshuattio in press coverage and third-party materials."}
          </p>
        </header>
      </div>
    </header>
  );
}
