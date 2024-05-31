import { render } from '@testing-library/react';

import LangtagChooser from './langtag-chooser';

describe('LangtagChooser', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LangtagChooser />);
    expect(baseElement).toBeTruthy();
  });
});
