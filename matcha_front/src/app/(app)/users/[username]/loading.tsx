export default function Loading() {
  return (
    <main className="mx-auto my-5 flex flex-wrap justify-center">
      <div className="mr-5 h-[500px] w-[500px]">
        <div className="h-full animate-pulse rounded-lg bg-green-5/80"></div>
      </div>

      <div className="min-w-[500px] flex-1">
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
