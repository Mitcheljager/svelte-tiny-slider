import { render } from '@testing-library/svelte'
import { describe, expect, it, beforeEach, vi } from 'vitest'

import TinySlider from "$lib/TinySlider.svelte"

describe(("TinySlider", () => {
  beforeEach(() => {
    Object.defineProperty(global, "ResizeObserver", {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
      })),
    })
  })

  it("Should render", () => {
    const { container } = render(TinySlider)
    expect(container).toBeTruthy()
  })
}))
