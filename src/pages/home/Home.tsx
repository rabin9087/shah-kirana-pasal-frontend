import { BarCodeGenerator, QRCodeGenerator } from "@/components/QRCodeGenerator";
import ProductCard from "../productCart/ProductCart";
function Home() {
  return (
    <div className="border-red-500">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 flex flex-col justify-center gap-5">
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-8 mx-auto">
          <ProductCard />
          <ProductCard />
          <QRCodeGenerator value="https://www.rabinshah.info/" />
          <BarCodeGenerator value="759652639" />
          {/* <WebcamComponent /> */}

        </div>
      </div>

    </div>
  );
}

export default Home;
