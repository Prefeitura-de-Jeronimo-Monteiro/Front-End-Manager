import {Check, WarningDiamond, X} from "@phosphor-icons/react";
import {useEffect} from "react";

interface ResultProps {
    text: string;
    status: boolean;
    open: boolean;
    onClose: () => void;
}

export default function Result({text, status, open, onClose}: ResultProps) {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [open, onClose]);

    return (
        <>
            {open ? (
                <div
                    className={`${
                        status ? "bg-green-400" : "bg-red-400"
                    } absolute bottom-2 left-2 flex items-center gap-6  text-white rounded py-1 px-2`}
                >
                    {status ? (
                        <div className="flex gap-2 items-center text-lg">
                            <Check size={20} weight="bold"/> {text}
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center text-lg">
                            <WarningDiamond size={20} weight="bold"/> {text}
                        </div>
                    )}

                    <X onClick={onClose} weight="bold"/>
                </div>
            ) : null}
        </>
    );
}
