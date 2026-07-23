import { useRef, useEffect, useState } from 'react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  inputLabel?: string;
  inputPlaceholder?: string;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  inputLabel,
  inputPlaceholder,
  onConfirm,
  onCancel,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setInputValue('');
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm(inputLabel ? inputValue : undefined);
  };

  return (
    <dialog
      ref={ref}
      className="confirm-dialog"
      onClose={onCancel}
      onClick={(e) => {
        if (e.target === ref.current) onCancel();
      }}
    >
      <div className="confirm-dialog-content">
        <h3>{title}</h3>
        <p>{message}</p>
        {inputLabel && (
          <div className="confirm-dialog-input">
            <label>{inputLabel}</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              autoFocus
            />
          </div>
        )}
        <div className="confirm-dialog-actions">
          <button className="btn-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={variant === 'danger' ? 'btn-delete' : 'btn-confirm'}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
