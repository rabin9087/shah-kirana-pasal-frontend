import { useAppSelector } from "@/hooks";

function Loader() {
  const { isLoading } = useAppSelector((store) => store.loader);
  if (!isLoading) {
    return undefined;
  }
  return (
    <div className="fixed min-h-screen w-screen bg-black/85 top-0 z-50 flex justify-center items-center flex-col backdrop-blur-sm  text-blue-500">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] text-blue-300"
        role="status"
      ></div>
      Please wait...
    </div>
  );
}

export default Loader;
