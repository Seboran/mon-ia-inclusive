import App from '@/App.vue'
import { render } from '@testing-library/vue'
import { suite, expect, test } from 'vitest'
suite('App', () => {
  test('Place holder test', () => {
    // TODO
    const { getByRole } = render(App)
    expect(getByRole('heading').textContent).toEqual('Mon IA inclusive 💖')
  })
})
