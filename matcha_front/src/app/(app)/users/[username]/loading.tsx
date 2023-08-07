export default function Loading() {
  return (
    <main className="mx-auto my-5 max-w-[700px]">
      <header className="mb-10 flex flex-wrap justify-center">
        <div className="m-right-2 mr-3 h-[400px] w-[400px]">
          <div className="h-full animate-pulse rounded-lg bg-green-5/80"></div>
        </div>
        <div className="flex-1 pt-2">
          <div className="h-[72px] animate-pulse rounded-lg bg-green-5/80"></div>
        </div>
      </header>

      <div className="mx-auto max-w-[700px]">
        <h2 className="my-5 border-b-2 border-brown pb-1 text-xl text-brown">
          Biography
        </h2>
        <div className="mb-5 h-[54px] animate-pulse rounded-lg bg-green-5/80"></div>
        <h2 className="my-5 border-b-2 border-brown pb-1 text-xl text-brown">
          Interests
        </h2>
        <div className="mb-5 h-[54px] animate-pulse rounded-lg bg-green-5/80"></div>
      </div>
    </main>
  );
}
