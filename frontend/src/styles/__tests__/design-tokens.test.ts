import { describe, it, expect } from 'vitest'
import { nn } from '../design-tokens'

describe('design-tokens', () => {
  it('exports nn object with colors', () => {
    expect(nn).toBeDefined()
    expect(nn.colors).toBeDefined()
  })

  it('has expected color properties', () => {
    expect(nn.colors.background).toBeDefined()
    expect(nn.colors.primary).toBeDefined()
    expect(nn.colors.secondary).toBeDefined()
    expect(nn.colors.error).toBeDefined()
    expect(nn.colors.onSurface).toBeDefined()
    expect(nn.colors.outline).toBeDefined()
  })
})
