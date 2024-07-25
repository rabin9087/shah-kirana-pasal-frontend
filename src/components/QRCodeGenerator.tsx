import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import Webcam from "react-webcam";

type qrCodeValue = {
  value: string
}

export const QRCodeGenerator = ({ value }: qrCodeValue) => {
  return (
    <div>
      <QRCode
        size={2}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={value}
        viewBox={`0 0 256 256`}
      />
    </div>
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

const videoConstraints = {
  width: 1280,
  height: 920,
  facingMode: "user"
};

export const WebcamComponent = () =>

  <Webcam

    audio={true}
    height={1040}
    screenshotFormat="image/jpeg"
    width={1280}
    videoConstraints={videoConstraints}>

    {/* {({ getScreenshot }) => (
      <button
        onClick={() => {
          const imageSrc = getScreenShot()
        }}
      >
        Capture Photo
      </button>
    )
    } */}
  </Webcam>
