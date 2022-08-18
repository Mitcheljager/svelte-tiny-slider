import "jsdom-global/register"
import { render } from "@testing-library/svelte"
import TinyGallery from '../src/TinyGallery.svelte'

test("Renders", () => {
  render(TinyGallery)
})
