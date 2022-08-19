import "jsdom-global/register"
import { render } from "@testing-library/svelte"
import TinySlider from '../src/TinySlider.svelte'

test("Renders", () => {
  render(TinySlider)
})
