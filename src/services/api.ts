import {
  Expert,
  Employee,
  Connection,
  MetricDefinition,
  DashboardStats,
  Skill,
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  total?: number;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface SearchFilters {
  search?: string;
  expertise?: string;
  experience?: number;
  rating?: number;
  minRate?: number;
  maxRate?: number;
  availability?: string;
  location?: string;
  limit?: number;
  offset?: number;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Skills API
  async getSkills(): Promise<Skill[]> {
    const response = await this.request<Skill[]>("/skills");
    return response.data;
  }

  async getSkill(id: string): Promise<Skill> {
    const response = await this.request<Skill>(`/skills/${id}`);
    return response.data;
  }

  // Experts API
  async getExperts(filters: SearchFilters = {}): Promise<{
    experts: Expert[];
    pagination: ApiResponse<Expert[]>["pagination"];
  }> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = `/experts${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.request<Expert[]>(endpoint);

    return {
      experts: response.data,
      pagination: response.pagination,
    };
  }

  async getExpert(id: string): Promise<Expert> {
    const response = await this.request<Expert>(`/experts/${id}`);
    return response.data;
  }

  // Employees API
  async getEmployees(
    filters: {
      department?: string;
      company?: string;
      search?: string;
    } = {},
  ): Promise<Employee[]> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = `/employees${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.request<Employee[]>(endpoint);
    return response.data;
  }

  async getEmployee(id: string): Promise<Employee> {
    const response = await this.request<Employee>(`/employees/${id}`);
    return response.data;
  }

  // Connections API
  async getConnections(
    filters: {
      expertId?: string;
      employeeId?: string;
      status?: string;
    } = {},
  ): Promise<Connection[]> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = `/connections${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await this.request<Connection[]>(endpoint);
    return response.data;
  }

  async getConnection(id: string): Promise<Connection> {
    const response = await this.request<Connection>(`/connections/${id}`);
    return response.data;
  }

  async createConnection(data: {
    expertId: string;
    employeeId: string;
    goals?: string[];
  }): Promise<Connection> {
    const response = await this.request<Connection>("/connections", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  }

  // Metrics API
  async getMetrics(): Promise<MetricDefinition[]> {
    const response = await this.request<MetricDefinition[]>("/metrics");
    return response.data;
  }

  // Dashboard API
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.request<DashboardStats>("/dashboard/stats");
    return response.data;
  }

  async getDepartmentMetrics(): Promise<any[]> {
    const response = await this.request<any[]>("/dashboard/departments");
    return response.data;
  }

  async getRecentActivities(limit: number = 10): Promise<any[]> {
    const response = await this.request<any[]>(
      `/dashboard/activities?limit=${limit}`,
    );
    return response.data;
  }

  // Search API
  async search(
    query: string,
    type?: "experts" | "employees" | "skills",
  ): Promise<{
    experts?: Expert[];
    employees?: Employee[];
    skills?: Skill[];
  }> {
    const queryParams = new URLSearchParams({ q: query });
    if (type) {
      queryParams.append("type", type);
    }

    const response = await this.request<{
      experts?: Expert[];
      employees?: Employee[];
      skills?: Skill[];
    }>(`/search?${queryParams.toString()}`);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    environment: string;
  }> {
    const response = await fetch(`${API_BASE_URL.replace("/api", "")}/health`);
    return response.json();
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export individual API functions for easier importing
export const {
  getSkills,
  getSkill,
  getExperts,
  getExpert,
  getEmployees,
  getEmployee,
  getConnections,
  getConnection,
  createConnection,
  getMetrics,
  getDashboardStats,
  getDepartmentMetrics,
  getRecentActivities,
  search,
  healthCheck,
} = apiClient;

// Export types for external use
export type { ApiResponse, SearchFilters };
