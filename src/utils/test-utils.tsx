import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SWRConfig } from 'swr';

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig>{children}</SWRConfig>;
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, {
    wrapper: Wrapper,
    ...options,
  });
};

export * from '@testing-library/react';
export { customRender as render };
