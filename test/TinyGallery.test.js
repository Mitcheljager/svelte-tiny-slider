import "jsdom-global/register"
import { render } from "@testing-library/svelte"
import TinySlider from '../src/TinySlider.svelte'

beforeEach(() => {
  Object.defineProperty(global, "ResizeObserver", {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    })),
  })
})

test("Renders", () => {
  render(TinySlider)
})
