import { User, PlanType } from "../types";

// Production: Use relative URL (so it works on nexiro.io/api)
// Local: Use full localhost URL
export const API_URL = import.meta.env.PROD
  ? "/api"
  : "https://nexiro-be-legacy.onrender.com/api";

/**
 * HELPER: Mock Database implementation for the frontend preview.
 * This ensures the app works even if the Node.js backend isn't running.
 */
class MockDB {
  private getUsers(): any[] {
    const users = localStorage.getItem("nexiro_users");
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: any[]) {
    localStorage.setItem("nexiro_users", JSON.stringify(users));
  }

  async login(email: string, password: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 800)); // Simulate network
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) throw new Error("Invalid credentials (Mock DB)");
    // Migrate old users if necessary
    if (user.credits === undefined) user.credits = 0;
    if (!user.plan) user.plan = PlanType.FREE;
    if (user.isDriveConnected === undefined) user.isDriveConnected = false;

    return {
      email: user.email,
      credits: user.credits,
      plan: user.plan,
      isDriveConnected: user.isDriveConnected,
    };
  }

  async signup(
    email: string,
    password: string,
    selectedPlan: PlanType,
  ): Promise<User> {
    await new Promise((r) => setTimeout(r, 800)); // Simulate network
    const users = this.getUsers();
    if (users.find((u) => u.email === email))
      throw new Error("User already exists (Mock DB)");

    let initialCredits = 0;
    if (selectedPlan === PlanType.STARTER) initialCredits = 40;
    if (selectedPlan === PlanType.PRO) initialCredits = 150;

    const newUser = {
      email,
      password,
      credits: initialCredits,
      plan: selectedPlan,
      isDriveConnected: false,
    };
    users.push(newUser);
    this.saveUsers(users);

    return {
      email,
      credits: initialCredits,
      plan: selectedPlan,
      isDriveConnected: false,
    };
  }

  async deductCredits(email: string, amount: number): Promise<User> {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.email === email);
    if (index === -1) throw new Error("User not found");

    const user = users[index];

    if (user.credits < amount) {
      throw new Error("Insufficient credits");
    }

    user.credits -= amount;

    users[index] = user;
    this.saveUsers(users);
    return user;
  }

  async changePlan(email: string, newPlan: PlanType): Promise<User> {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.email === email);
    if (index === -1) throw new Error("User not found");

    let newCredits = 0;
    // On downgrade/cancel, usually we keep credits until end of month, but for simplicity here we reset to plan defaults
    if (newPlan === PlanType.STARTER) newCredits = 40;
    if (newPlan === PlanType.PRO) newCredits = 150;
    if (newPlan === PlanType.FREE) newCredits = 0;

    users[index].plan = newPlan;
    users[index].credits = newCredits;

    this.saveUsers(users);
    return users[index];
  }

  async toggleDrive(email: string, status: boolean): Promise<User> {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.email === email);
    if (index === -1) throw new Error("User not found");

    users[index].isDriveConnected = status;
    this.saveUsers(users);
    return users[index];
  }

  async updateProfile(email: string, newPassword?: string): Promise<User> {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.email === email);
    if (index === -1) throw new Error("User not found");

    if (newPassword) {
      users[index].password = newPassword;
    }
    this.saveUsers(users);
    return users[index];
  }
}

const mockDB = new MockDB();

/**
 * Auth Service
 */
export const authService = {
  // Session Persistence
  saveSession(user: User) {
    localStorage.setItem("nexiro_user", JSON.stringify(user));
  },

  getSession(): User | null {
    const data = localStorage.getItem("nexiro_user");
    return data ? JSON.parse(data) : null;
  },

  clearSession() {
    localStorage.removeItem("nexiro_user");
  },

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Login Failed");
      const data = await response.json();

      // Fallback: If isPro is true but plan is 'FREE' (or missing), assume PRO (legacy/migration safety)
      let userPlan: PlanType = data.user.plan as PlanType;
      if (data.user.isPro && (!userPlan || userPlan === PlanType.FREE)) {
        userPlan = PlanType.PRO;
      }
      userPlan = userPlan || PlanType.FREE;
      const user = {
        ...data.user,
        credits: this.calculateRemainingCredits(userPlan, data.user.usageCount),
        plan: userPlan,
        isPro: data.user.isPro,
      };
      this.saveSession(user);
      return user;
    } catch (err) {
      console.warn("Backend Login failed, falling back to mock");
      return mockDB.login(email, password);
    }
  },

  // Helper to calculate remaining credits
  calculateRemainingCredits(plan: PlanType, usageCount: number): number {
    let limit = 0;
    if (plan === PlanType.STARTER) limit = 40; // Match App.tsx PlanCard
    else if (plan === PlanType.PRO) limit = 150; // Match App.tsx PlanCard

    // Ensure we don't show negative if usage > limit (though backend should prevent)
    return Math.max(0, limit - (usageCount || 0));
  },

  async googleLogin(token: string, plan?: PlanType): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/google-auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, plan }),
      });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google Login Failed: ${response.status} ${errText}`);
      }
      const data = await response.json();
      console.log("Backend Login Success:", data);

      let userPlan: PlanType = data.user.plan as PlanType;
      if (data.user.isPro && (!userPlan || userPlan === PlanType.FREE)) {
        userPlan = PlanType.PRO;
      }
      userPlan = userPlan || PlanType.FREE;
      const user = {
        email: data.user.email,
        credits: this.calculateRemainingCredits(userPlan, data.user.usageCount),
        plan: userPlan,
        isDriveConnected: false, // Backend doesn't store this yet
        isPro: data.user.isPro, // IMPORTANT: Pass this through for App.tsx check
      };
      this.saveSession(user);
      return user;
    } catch (err) {
      console.error(
        "Backend Google Login failed, falling back to mock. REASON:",
        err,
      );
      // Decode token for mock fallback (simplified)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return mockDB.signup(payload.email, "GOOGLE_AUTH", PlanType.FREE);
    }
  },

  async signup(email: string, password: string, plan: PlanType): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Backend doesn't support plan yet, assumes free/default
      });
      if (!response.ok) throw new Error("Signup Failed");
      const data = await response.json();
      return data.user;
    } catch (err) {
      return mockDB.signup(email, password, plan);
    }
  },

  async consumeCredits(email: string, amount: number): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/usage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount }),
      });
      if (!response.ok) throw new Error("Failed to consume credits");
      const data = await response.json();
      // For now let's assume we return a partial user or the UI handles it.
      // Actually, let's keep it simple: return the updated user state.
      const userPlan: PlanType =
        (data.plan as PlanType) || (data.isPro ? PlanType.PRO : PlanType.FREE);
      return {
        email,
        credits: this.calculateRemainingCredits(userPlan, data.usageCount),
        plan: userPlan,
        isDriveConnected: false,
        isPro: data.isPro,
      };
    } catch (err) {
      console.warn("Backend consumeCredits failed, falling back to mock");
      return mockDB.deductCredits(email, amount);
    }
  },

  async upgradePlan(email: string, plan: PlanType): Promise<User> {
    try {
      // Only supporting upgrade to PRO for now as per backend
      if (plan === PlanType.PRO) {
        const response = await fetch(`${API_URL}/upgrade`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) throw new Error("Upgrade failed");
        const data = await response.json();
        return {
          email,
          credits: 0,
          plan: PlanType.PRO,
          isDriveConnected: false,
        }; // Simplified return
      }
      return mockDB.changePlan(email, plan);
    } catch (err) {}
  },

  async verifyPayment(email: string): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Payment verification failed");
      const data = await response.json();

      // Fallback: If isPro is true but plan is 'FREE' (or missing), assume PRO
      let userPlan: PlanType = data.user.plan as PlanType;
      if (data.user.isPro && (!userPlan || userPlan === PlanType.FREE)) {
        userPlan = PlanType.PRO;
      }
      userPlan = userPlan || PlanType.FREE;

      const user = {
        ...data.user,
        credits: this.calculateRemainingCredits(userPlan, data.user.usageCount),
        plan: userPlan,
        isPro: data.user.isPro,
      };
      this.saveSession(user);
      return user;
    } catch (err) {
      console.warn("Verify payment failed", err);
      // Fallback: return existing generic user or error out
      throw err;
    }
  },

  async cancelSubscription(email: string): Promise<User> {
    // Sets plan to FREE
    return this.upgradePlan(email, PlanType.FREE);
  },

  async toggleGoogleDrive(email: string, isConnected: boolean): Promise<User> {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));
    return mockDB.toggleDrive(email, isConnected);
  },

  async updateProfile(email: string, newPassword?: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 500));
    return mockDB.updateProfile(email, newPassword);
  },
};
