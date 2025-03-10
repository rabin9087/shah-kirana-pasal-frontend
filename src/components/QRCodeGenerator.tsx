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

export const BarCodeGenerator = ({ value }: qrCodeValue) => {
  return (
    <div className="absolute">
      <Barcode value={value}
        width={2}
        height={50}
        displayValue={true}
      /></div>
  )
}
