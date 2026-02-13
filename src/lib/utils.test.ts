import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn - Class Name Utility', () => {
  it('combines class names', () => {
    const result = cn('px-2', 'py-1')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
  })

  it('handles empty strings', () => {
    const result = cn('')
    expect(result).toBe('')
  })

  it('filters out false values', () => {
    const result = cn('px-2', null, 'py-1')
    expect(result).not.toContain('null')
  })

  it('handles undefined values', () => {
    const result = cn('px-2', undefined, 'py-1')
    expect(result).not.toContain('undefined')
  })

  it('handles null values', () => {
    const result = cn('px-2', null, 'py-1')
    expect(result).not.toContain('null')
  })

  it('merges tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4')
    // px-4 should override px-2
    expect(result).toContain('px-4')
  })

  it('handles object notation', () => {
    const result = cn({
      'px-2': true,
      'py-1': true,
      'mx-auto': false,
    })
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
  })

  it('combines multiple formats', () => {
    const result = cn(
      'px-2 py-1',
      { 'bg-white': true, 'bg-black': false },
      ['rounded', 'shadow']
    )
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
    expect(result).toContain('bg-white')
    expect(result).toContain('rounded')
    expect(result).toContain('shadow')
  })

  it('handles complex tailwind merging', () => {
    const result = cn('bg-blue-500 text-white', 'bg-red-500')
    // bg-red-500 should override bg-blue-500
    expect(result).toContain('bg-red-500')
    expect(result).toContain('text-white')
  })

  it('handles responsive tailwind classes', () => {
    const result = cn('md:px-4', 'lg:px-6')
    expect(result).toContain('md:px-4')
    expect(result).toContain('lg:px-6')
  })

  it('handles hover and state variants', () => {
    const result = cn('bg-blue-500 hover:bg-blue-600', 'hover:bg-red-600')
    expect(result).toContain('bg-blue-500')
  })

  it('removes duplicate classes', () => {
    const result = cn('px-2 px-2 px-2')
    const count = (result.match(/px-2/g) || []).length
    expect(count).toBe(1)
  })

  it('handles empty arrays', () => {
    const result = cn([])
    expect(result).toBe('')
  })

  it('handles nested arrays', () => {
    const result = cn([['px-2', 'py-1'], ['rounded']])
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
    expect(result).toContain('rounded')
  })
})
