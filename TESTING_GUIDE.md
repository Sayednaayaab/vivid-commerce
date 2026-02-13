# Testing Quick Start Guide

## 🚀 Getting Started with Tests

### Running Tests

```bash
# Watch mode (recommended during development)
npm run test

# Single run (CI/CD)
npm run test:run

# With UI dashboard
npm run test:ui

# With coverage report
npm run test:coverage
```

## 📝 Writing New Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('Feature Name', () => {
  beforeEach(() => {
    // Clean up before each test
    localStorage.clear()
    sessionStorage.clear()
  })

  it('should do something', () => {
    // Arrange
    const input = 'test'
    
    // Act
    const result = performAction(input)
    
    // Assert
    expect(result).toBe('expected')
  })
})
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useMyHook } from '@/hooks/useMyHook'

describe('useMyHook', () => {
  it('initializes correctly', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.value).toBe('initial')
  })

  it('updates state', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.setValue('new')
    })
    
    expect(result.current.value).toBe('new')
  })
})
```

### Testing Components

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked')).toBeInTheDocument()
  })
})
```

### Testing Storage

```typescript
import { testUtils } from '@/test/setup'

describe('Storage Operations', () => {
  it('persists data', () => {
    const data = { userId: 1, name: 'John' }
    testUtils.setLocalStorage('user', data)
    
    const retrieved = testUtils.getLocalStorage('user')
    expect(retrieved).toEqual(data)
  })

  // OR use localStorage directly
  it('works with raw storage', () => {
    const data = { userId: 1 }
    localStorage.setItem('user', JSON.stringify(data))
    
    const retrieved = JSON.parse(localStorage.getItem('user') || '{}')
    expect(retrieved.userId).toBe(1)
  })
})
```

## 🎯 Common Test Patterns

### Testing Async Operations

```typescript
it('handles async operations', async () => {
  const { result } = renderHook(() => useAsync())
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false)
  })
  
  expect(result.current.data).toBeDefined()
})
```

### Testing form Submission

```typescript
it('submits form correctly', async () => {
  const user = userEvent.setup()
  render(<LoginForm />)
  
  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(screen.getByLabelText('Password'), 'password123')
  await user.click(screen.getByRole('button', { name: /login/i }))
  
  expect(screen.getByText('Successfully logged in')).toBeInTheDocument()
})
```

### Testing error states

```typescript
it('displays error message', () => {
  const error = new Error('Test error')
  render(<ErrorBoundary><Component /></ErrorBoundary>)
  
  expect(screen.getByText('Test error')).toBeInTheDocument()
})
```

## 🔧 Available Test Utilities

### From setup.ts

```typescript
import { testUtils } from '@/test/setup'

// Storage utilities
testUtils.setLocalStorage(key, value)      // Safe JSON storage
testUtils.getLocalStorage(key)              // Safe JSON retrieval
testUtils.setSessionStorage(key, value)    // Session storage
testUtils.getSessionStorage(key)            // Session retrieval

// Mock utilities
testUtils.mockFetch(response, options)     // Mock network requests
testUtils.mockMediaQuery(query, matches)   // Mock media queries
```

### From Testing Library

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Query methods
screen.getByRole(role)        // Get by semantic role
screen.getByText(text)        // Get by text content
screen.getByLabelText(text)   // Get by label
screen.getByPlaceholderText() // Get by placeholder
screen.getByTestId()          // Get by data-testid

// Actions
await userEvent.type(element, text)
await userEvent.click(element)
await userEvent.keyboard(keys)

// Utilities
render(<Component />)         // Render component
waitFor(() => {...})          // Wait for condition
```

## ✅ Checklist for New Tests

- [ ] Import necessary testing utilities
- [ ] Set up describe block with clear name
- [ ] Add beforeEach cleanup if needed
- [ ] Write tests with Arrange-Act-Assert pattern
- [ ] Use descriptive test names
- [ ] Test happy path and error cases
- [ ] Clean up after tests (mocks, storage)
- [ ] Ensure tests are isolated and independent
- [ ] Use userEvent for user interactions
- [ ] Verify async operations with waitFor

## 🐛 Debugging Tests

```typescript
// Print DOM elements
screen.debug()

// Print specific element
screen.debug(element)

// Enable logging of queries
import { screen } from '@testing-library/react'
screen.logTestingPlaygroundURL()
```

## 📂 Test File Organization

```
src/
├── components/
│   ├── MyComponent.tsx
│   └── MyComponent.test.tsx
├── hooks/
│   ├── useMyHook.tsx
│   └── useMyHook.test.tsx
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
├── pages/
│   ├── Home.tsx
│   └── Home.test.tsx
└── test/
    ├── setup.ts
    └── integration.test.ts
```

## 🤝 Best Practices

1. **Test Behavior, Not Implementation**
   - ✅ Test what users see and interact with
   - ❌ Don't test internal state details

2. **Keep Tests Simple**
   - ✅ One concept per test
   - ❌ Don't test multiple features in one test

3. **Use Meaningful Names**
   - ✅ "should display error message when email is invalid"
   - ❌ "test 1"

4. **Avoid Test Interdependence**
   - ✅ Each test should work independently
   - ❌ Don't rely on test execution order

5. **Mock External Dependencies**
   - ✅ Mock API calls, localStorage, etc.
   - ❌ Don't make real API calls in tests

6. **Use Data-TestId Sparingly**
   - ✅ Query by semantic roles first
   - ⚠️  Use test IDs only when necessary

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [React Testing Patterns](https://react.dev/learn/testing)
- [ESLint testing rules](https://github.com/testing-library/eslint-plugin-testing-library)

## 🎓 Example: Complete Test File

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '@/hooks/useCounter'

describe('useCounter Hook', () => {
  beforeEach(() => {
    // Clean up before each test
    localStorage.clear()
  })

  it('initializes with 0', () => {
    const { result } = renderHook(() => useCounter())
    expect(result.current.count).toBe(0)
  })

  it('increments counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
    })
    
    expect(result.current.count).toBe(1)
  })

  it('decrements counter', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
      result.current.decrement()
    })
    
    expect(result.current.count).toBe(0)
  })

  it('persists counter to localStorage', () => {
    const { result } = renderHook(() => useCounter())
    
    act(() => {
      result.current.increment()
      result.current.increment()
    })
    
    const stored = JSON.parse(localStorage.getItem('counter') || '0')
    expect(stored).toBe(2)
  })
})
```

---

**Happy Testing! 🧪**

For questions or issues, refer to the TESTING_REPORT.md for comprehensive documentation.
