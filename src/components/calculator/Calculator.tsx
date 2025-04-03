import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Calculator: React.FC = () => {
    const [expression, setExpression] = useState<string>("");
    const [result, setResult] = useState<string>("");

    const handleButtonClick = (value: string) => {
        if (value === "C") {
            setExpression("");
            setResult("");
            return;
        }

        if (value === "DEL") {
            setExpression((prev) => prev.slice(0, -1));
            return;
        }

        if (value === "=") {
            try {
                const evalResult = eval(expression);
                setResult(evalResult.toString());
            } catch {
                setResult("Error");
            }
            return;
        }

        setExpression((prev) => prev + value);
    };

    return (
        <div className="max-w-xs mx-auto p-4 bg-gray-200 rounded-lg shadow-lg">
            <Input value={expression} readOnly className="mb-2 text-right text-lg" />
            <Input value={result} readOnly className="mb-4 text-right text-xl font-bold" />
            <div className="grid grid-cols-4 gap-2">
                <Button onClick={() => handleButtonClick("C")} className="p-4 text-lg font-bold">C</Button>
                <Button onClick={() => handleButtonClick("DEL")} className="p-4 text-lg font-bold">DEL</Button>
                <Button onClick={() => handleButtonClick("% ")} className="p-4 text-lg font-bold">%</Button>
                <Button onClick={() => handleButtonClick("/")} className="p-4 text-lg font-bold">/</Button>
                {["7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "(", ")"].map((char) => (
                    <Button key={char} onClick={() => handleButtonClick(char)} className="p-4 text-lg font-bold">
                        {char}
                    </Button>
                    
                ))}
                <Button className="text-end col-span-2 p-4 text-lg font-bold"></Button>

                <Button onClick={() => handleButtonClick("=")} className="text-end col-span-2 p-4 text-lg font-bold">=</Button>
            </div>
        </div>
    );
};

export default Calculator;