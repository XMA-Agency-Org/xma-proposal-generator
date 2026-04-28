"use client";

import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";

const SIGNATURE_PEN_COLOR = "oklch(0.577 0.245 27.325)";

interface Props {
  counterSigning: boolean;
  onSubmit: (pngData: string) => void;
  onError: (msg: string) => void;
}

export function CounterSignPanel({ counterSigning, onSubmit, onError }: Props) {
  const sigRef = useRef<SignatureCanvas>(null);

  function handleSubmit() {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      onError("Draw your counter-signature first.");
      return;
    }
    onSubmit(sigRef.current.getCanvas().toDataURL("image/png"));
  }

  return (
    <div className="mb-8 border border-border-primary rounded-lg p-6">
      <h3 className="font-bold mb-4">Counter-Sign</h3>
      <p className="text-text-muted text-sm mb-4">Client has signed. Draw your counter-signature below.</p>
      <div className="border-2 border-brand-primary rounded-lg overflow-hidden mb-4">
        <SignatureCanvas
          ref={sigRef}
          penColor={SIGNATURE_PEN_COLOR}
          canvasProps={{ className: "w-full", height: 160, style: { background: "white" } }}
        />
      </div>
      <div className="flex gap-3">
        <Button size="sm" onClick={handleSubmit} disabled={counterSigning}>
          {counterSigning ? "Submitting…" : "Submit Counter-Signature"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => sigRef.current?.clear()}>
          Clear
        </Button>
      </div>
    </div>
  );
}
