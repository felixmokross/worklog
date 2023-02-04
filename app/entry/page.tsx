import { useId } from "react";

export default function EntryPage() {
  return (
    <div className="flex gap-3 px-10 py-5">
      <TimeInput className="w-32" label="Start" name="start" step="900" />
      <TimeInput className="w-32" label="End" name="end" step="900" />
      <NumberInput
        className="w-32"
        label="Breaks (h)"
        name="break"
        step="0.25"
      />
    </div>
  );
}

type TimeInputProps = {
  label: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function TimeInput({ label, className, ...props }: TimeInputProps) {
  const id = `time-input-${useId()}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          type="time"
          id={id}
          {...props}
        />
      </div>
    </div>
  );
}

type NumberInputProps = {
  label: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

function NumberInput({ label, className, ...props }: NumberInputProps) {
  const id = `number-input-${useId()}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          type="number"
          id={id}
          {...props}
        />
      </div>
    </div>
  );
}
