import QRCode from "react-qr-code";
import Barcode from "react-barcode";

type qrCodeValue = {
  value: string
}

export const QRCodeGenerator = ({ value }: qrCodeValue) => {
  return (
      <QRCode
        className="w-28 h-28"
        size={2}
        style={{ height: "auto", maxWidth: "100%", width: "" }}
        value={value}
        viewBox={`0 0 256 256`}
      />
  )
}

type BarCodeGeneratorProps = {
  value: string;
  width?: number;
  height?: number;
};

export const BarCodeGenerator = ({ value, width = 2, height = 40 }: BarCodeGeneratorProps) => {
  return (
    <Barcode
      value={value}
      width={width}   // barcode line width
      height={height} // barcode height
      displayValue={false} // remove text below barcode if desired
      margin={0}
    />
  );
};
