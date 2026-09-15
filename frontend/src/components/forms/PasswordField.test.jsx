import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordField from './PasswordField';

/**
 * Proves the actual click behavior via real DOM events (not a static read of
 * the source), so this regression can never silently reappear.
 */
// lucide-react's <Eye> renders a <circle> (the pupil) plus one <path>;
// <EyeOff> renders no <circle> at all (just the slashed-eye paths/lines).
// That's a reliable, implementation-level way to assert which icon is
// actually on screen, not just which aria-label string was chosen.
const hasEyeIcon = (button) => button.querySelector('circle') !== null;

describe('PasswordField show/hide toggle', () => {
  it('starts hidden (EyeOff, reflecting current state) and reveals/hides on each click', () => {
    render(<PasswordField label="Password" name="password" value="ttt" onChange={() => {}} />);

    const input = screen.getByLabelText('Password');
    const toggle = screen.getByRole('button');

    // 1. Initial state: hidden -> EyeOff icon (password is currently hidden)
    expect(input).toHaveAttribute('type', 'password');
    expect(toggle).toHaveAttribute('aria-label', 'Show password');
    expect(hasEyeIcon(toggle)).toBe(false);

    // 2. First click: reveal -> Eye icon (password is currently visible)
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAttribute('aria-label', 'Hide password');
    expect(hasEyeIcon(toggle)).toBe(true);

    // 3. Second click: hide again -> EyeOff icon
    fireEvent.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
    expect(toggle).toHaveAttribute('aria-label', 'Show password');
    expect(hasEyeIcon(toggle)).toBe(false);
  });

  it('toggle button never submits the surrounding form', () => {
    render(<PasswordField label="Password" name="password" value="" onChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
