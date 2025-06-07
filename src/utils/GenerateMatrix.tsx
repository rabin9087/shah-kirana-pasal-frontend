import React from "react";
import { QRCodeCanvas } from "qrcode.react";

interface QRWithLogoProps {
    value: string;
    logoUrl: string;
    size?: number;
}

const QRWithLogo: React.FC<QRWithLogoProps> = ({ value, logoUrl, size = 200 }) => {
    const logoSize = size * 0.2; // 20% of QR size

    return (
        <div style={{ position: "relative", width: size, height: size }}>
            {/* QR Code */}
            <QRCodeCanvas
                value={value}
                size={size}
                level="H" // High error correction (needed to embed logo)
                includeMargin={true}
                style={{ width: size, height: size }}
            />

            {/* Logo overlay */}
            <img
                src={logoUrl}
                alt="Logo"
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: logoSize,
                    height: logoSize,
                    transform: "translate(-50%, -50%)",
                    borderRadius: "8px",
                    background: "white",
                    padding: "4px",
                }}
            />
        </div>
    );
};

export default QRWithLogo;
