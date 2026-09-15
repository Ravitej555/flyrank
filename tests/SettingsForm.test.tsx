import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SettingsForm from '@/components/SettingsForm';
import { DEFAULT_USER_PREFERENCES } from '@/lib/validations/settings';

describe('SettingsForm Component (Round 2)', () => {
  it('renders all form elements with accessible names and legends', () => {
    render(<SettingsForm />);

    expect(screen.getByRole('heading', { name: /ranking utility settings/i })).toBeDefined();
    expect(screen.getByText(/multi-criteria utility weights/i)).toBeDefined();
    expect(screen.getByText(/routing & display parameters/i)).toBeDefined();

    // Check slider labels
    expect(screen.getByLabelText(/price sensitivity/i)).toBeDefined();
    expect(screen.getByLabelText(/total flight duration/i)).toBeDefined();
    expect(screen.getByLabelText(/layover friction/i)).toBeDefined();
    expect(screen.getByLabelText(/airline reliability/i)).toBeDefined();
    expect(screen.getByLabelText(/carbon \/ eco-efficiency/i)).toBeDefined();

    // Check live total status badge
    expect(screen.getByRole('status')).toBeDefined();
    expect(screen.getByText(/total: 100%/i)).toBeDefined();
  });

  it('updates live total and displays validation alert when weights do not sum to 100%', async () => {
    render(<SettingsForm />);

    const priceSlider = screen.getByLabelText(/price sensitivity/i);
    // Change price from 40 to 60 -> total becomes 120%
    fireEvent.change(priceSlider, { target: { value: '60' } });

    expect(screen.getByText(/total: 120%/i)).toBeDefined();

    const saveButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(saveButton);

    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
    expect(alert.textContent).toContain('must sum to exactly 100%');
  });

  it('calls onSave callback with validated preferences when valid', () => {
    const onSaveMock = vi.fn();
    render(<SettingsForm onSave={onSaveMock} />);

    const saveButton = screen.getByRole('button', { name: /save preferences/i });
    fireEvent.click(saveButton);

    expect(onSaveMock).toHaveBeenCalledTimes(1);
    expect(onSaveMock).toHaveBeenCalledWith(DEFAULT_USER_PREFERENCES);
    expect(screen.getByText(/preferences saved/i)).toBeDefined();
  });

  it('resets form weights to defaults when "Reset to Defaults" is clicked', () => {
    render(<SettingsForm />);

    const priceSlider = screen.getByLabelText(/price sensitivity/i) as HTMLInputElement;
    fireEvent.change(priceSlider, { target: { value: '80' } });
    expect(priceSlider.value).toBe('80');

    const resetButton = screen.getByRole('button', { name: /reset to defaults/i });
    fireEvent.click(resetButton);

    expect(priceSlider.value).toBe('40');
    expect(screen.getByText(/total: 100%/i)).toBeDefined();
  });
});
