import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import EmergencyHelpModal from '../src/components/common/EmergencyHelpModal.jsx';
import AccessibilityToolbar from '../src/components/accessibility/AccessibilityToolbar.jsx';
import Login from '../src/components/auth/Login.jsx';
import FeedbackModal from '../src/components/modules/FeedbackModal.jsx';
import { AccessibilityProvider } from '../src/context/AccessibilityContext.jsx';
import { AuthProvider } from '../src/context/AuthContext.jsx';

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AccessibilityProvider>{ui}</AccessibilityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('NeuroVR-2.0 Client Tests', () => {
  it('renders EmergencyHelpModal with calming guidance and trusted adult contacts', () => {
    const handleClose = vi.fn();
    renderWithProviders(<EmergencyHelpModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText(/You Are Safe & Supported/i)).toBeInTheDocument();
    expect(screen.getByText(/Your body belongs to you/i)).toBeInTheDocument();
    expect(screen.getByText(/Saying "NO" is strong and okay/i)).toBeInTheDocument();
    expect(screen.getByText(/Parent or Guardian/i)).toBeInTheDocument();

    const closeBtn = screen.getByText(/I Feel Better Now/i);
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders AccessibilityToolbar and toggles settings', () => {
    renderWithProviders(<AccessibilityToolbar />);

    // Initial pill button
    const pill = screen.getByRole('button', { name: /accessibility & audio/i });
    expect(pill).toBeInTheDocument();

    // Expand
    fireEvent.click(pill);
    expect(screen.getByText(/Accessibility Controls/i)).toBeInTheDocument();
    expect(screen.getByText(/Contrast Theme/i)).toBeInTheDocument();
    expect(screen.getByText(/Speech \(TTS\)/i)).toBeInTheDocument();
  });

  it('renders Login screen with form inputs and demo account options', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/One-Click Demo Accounts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Caregiver \(Elena\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Learner \(Alex\)/i })).toBeInTheDocument();
  });

  it('renders FeedbackModal with constructive guidance for safe choices', () => {
    const handleNext = vi.fn();

    renderWithProviders(
      <FeedbackModal
        isOpen={true}
        isSafeAction={true}
        explanation="Asking for a fist bump respects personal space."
        encouragement="You are doing great!"
        onNext={handleNext}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText(/Safe Choice! Excellent Job!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Asking for a fist bump respects personal space/i)
    ).toBeInTheDocument();
    const nextBtn = screen.getByText(/Next Scenario/i);
    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalled();
  });
});
