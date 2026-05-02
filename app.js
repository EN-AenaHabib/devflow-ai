let currentTask = "docs";

// switch task (FIXED - no event dependency)
function setTask(task, btn) {
  currentTask = task;

  document.querySelectorAll(".task-btn")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
}

// ==============================
// FULL BOB OUTPUTS (DETAILED)
// ==============================
const OUTPUTS = {

  docs: `/**
 * Fetches user dashboard data including user profile and order history.
 * Makes parallel API requests to retrieve user information and associated orders,
 * then validates the user account status before returning the combined data.
 * 
 * @async
 * @param {string|number} userId - The unique identifier of the user whose dashboard data to fetch
 * @param {Object} [options={}] - Optional configuration object
 * @param {boolean} [options.includeAnalytics=false] - Whether to include analytics data (currently unused)
 * @param {number} [options.maxItems=50] - Maximum number of order items to retrieve
 * 
 * @returns {Promise<{user: Object, orders: Array}>} A promise that resolves to an object containing:
 *   - user: The user profile object from the API
 *   - orders: Array of order objects from the orders.data property
 * 
 * @throws {Error} Throws an error if the user account is deactivated
 * @throws {Error} Throws an error if any API request fails or returns invalid JSON
 * @throws {TypeError} Throws if userId is not provided or is invalid
 * 
 * @example
 * const dashboard = await fetchUserDashboard('user123');
 * console.log(dashboard.user.name);
 * console.log(dashboard.orders.length);
 */
async function fetchUserDashboard(userId, options = {}) {
  const { includeAnalytics = false, maxItems = 50 } = options;

  try {
    const [user, orders] = await Promise.all([
      fetch(\`/api/users/\${userId}\`).then(r => r.json()),
      fetch(\`/api/orders?userId=\${userId}&limit=\${maxItems}\`).then(r => r.json())
    ]);

    if (!user.active) {
      throw new Error("User account is deactivated");
    }

    return {
      user,
      orders: orders.data
    };

  } catch (err) {
    throw err;
  }
}
`,

  tests: `describe('calculateDiscount', () => {

  // ======================
  // PREMIUM USER TESTS
  // ======================
  test('applies 20% discount for premium user without coupon', () => {
    expect(calculateDiscount(100, 'premium')).toBe(80);
  });

  test('applies 30% discount for premium user with SAVE10 coupon', () => {
    expect(calculateDiscount(100, 'premium', 'SAVE10')).toBe(70);
  });

  // ======================
  // MEMBER USER TESTS
  // ======================
  test('applies 10% discount for member user without coupon', () => {
    expect(calculateDiscount(100, 'member')).toBe(90);
  });

  test('applies 20% discount for member user with SAVE10 coupon', () => {
    expect(calculateDiscount(100, 'member', 'SAVE10')).toBe(80);
  });

  // ======================
  // REGULAR USERS
  // ======================
  test('applies no discount for regular user', () => {
    expect(calculateDiscount(100, 'regular')).toBe(100);
  });

  // ======================
  // EDGE CASES
  // ======================
  test('handles decimal values correctly', () => {
    expect(calculateDiscount(99.99, 'premium')).toBe(79.99);
  });

  test('handles zero price correctly', () => {
    expect(calculateDiscount(0, 'premium')).toBe(0);
  });

  test('handles large values correctly', () => {
    expect(calculateDiscount(1000000, 'premium')).toBe(800000);
  });

});
`,

  refactor: `function filterActiveAdultUsers(users) {
  return users
    .filter(user => user.status === 'active' && user.age >= 18)
    .map(({ name, email, age }) => ({ name, email, age }));
}

/**
 * IMPROVEMENTS MADE:
 * - Replaced unclear variable names with meaningful ones
 * - Converted loop-based logic to functional programming (filter + map)
 * - Improved readability and maintainability
 * - Removed unnecessary temporary variables
 * - Applied Single Responsibility Principle
 * - Cleaner destructuring for object transformation
 */
`,

  review: `CRITICAL ISSUES:
- SQL Injection vulnerability: user input directly used in SQL query
- Plain text password storage and comparison (no hashing)
- Sensitive data exposure (entire user object returned)
- Session stores unsafe user data

WARNINGS:
- No input validation (email, password checks missing)
- Weak equality operator used (== instead of ===)
- No rate limiting for login attempts
- No logging for failed authentication

SUGGESTIONS:
- Use parameterized queries or ORM
- Hash passwords using bcrypt
- Return only safe user fields (id, name, email)
- Add input validation middleware
- Implement rate limiting
- Use JWT or secure session tokens
- Add proper error handling

SCORE: 2/10 - Critical security flaws make this unsafe for production`
};

// ==============================
// TIME SAVED METRICS
// ==============================
const TIME_SAVED = {
  docs: 4,
  tests: 6,
  refactor: 5,
  review: 3
};

// ==============================
// TYPING EFFECT
// ==============================
function typeText(element, text, speed = 5) {
  element.innerHTML = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}

// ==============================
// RUN BUTTON
// ==============================
function runTask() {
  const outputBox = document.getElementById("outputBox");
  const timeBox = document.getElementById("timeSaved");

  outputBox.innerHTML = "🎉 Task Completed";

  setTimeout(() => {
    typeText(outputBox, OUTPUTS[currentTask], 8);
    timeBox.innerText = `⚡ Saved ~${TIME_SAVED[currentTask]} minutes`;
  }, 1000);
}