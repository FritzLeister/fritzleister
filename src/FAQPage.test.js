import { fireEvent, render, screen } from '@testing-library/react';
import FAQPage from './FAQPage';

describe('FAQPage', () => {
  it('calls the demo handler when the demo button is pressed', () => {
    const onOpenDemo = jest.fn();

    render(<FAQPage setShowApp={jest.fn()} onOpenDemo={onOpenDemo} />);

    fireEvent.click(screen.getByRole('button', { name: /demo-halle ansehen/i }));

    expect(onOpenDemo).toHaveBeenCalledTimes(1);
  });
});
