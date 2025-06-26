import QRCode from "react-qr-code";
import Barcode from "react-barcode";

type QRCodeValueProps = {
  value: string; // or `value: string | number` if needed
  width?: number;
  height?: number;
};


export const QRCodeGenerator = ({
  value,
  width = 100,
  height = 100,
}: QRCodeValueProps) => {
  return (
    <QRCode
      value={value}
      size={width} // QR code is square; `size` controls both width and height
      style={{
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: "100%",
      }}
      viewBox="0 0 256 256"
      className="w-28 h-28"
    />
  );
};

type BarCodeGeneratorProps = {
  value?: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  className?: string
};

export const BarCodeGenerator = ({ value, width = 2, height = 40, displayValue = false, className }: BarCodeGeneratorProps) => {
  return (
    <Barcode
      value={value as string}
      width={width}   // barcode line width
      height={height} // barcode height
      displayValue={displayValue} // remove text below barcode if desired
      margin={1}
      className={className}
    />
  );
};
