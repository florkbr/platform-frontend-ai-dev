import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ConfirmDialog from './ConfirmDialog';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('ConfirmDialog', () => {
  const baseProps = {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders title and message', () => {
    render(<ConfirmDialog {...baseProps} />);
    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('calls onConfirm with undefined when no inputLabel', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...baseProps} onConfirm={onConfirm} />);
    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledWith(undefined);
  });

  it('calls onConfirm with typed value when inputLabel provided', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <ConfirmDialog
        {...baseProps}
        onConfirm={onConfirm}
        inputLabel="Reason"
        inputPlaceholder="Enter reason"
      />,
    );
    const input = screen.getByPlaceholderText('Enter reason');
    await user.type(input, 'needs more work');
    await user.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledWith('needs more work');
  });

  it('calls onCancel when cancel clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ConfirmDialog {...baseProps} onCancel={onCancel} />);
    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('confirm button has btn-delete class when variant is danger', () => {
    render(<ConfirmDialog {...baseProps} variant="danger" confirmLabel="Delete" />);
    const btn = screen.getByText('Delete');
    expect(btn.className).toBe('btn-delete');
  });

  it('confirm button has btn-confirm class when variant is default', () => {
    render(<ConfirmDialog {...baseProps} variant="default" confirmLabel="OK" />);
    const btn = screen.getByText('OK');
    expect(btn.className).toBe('btn-confirm');
  });
});
