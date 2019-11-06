import { observable, computed, action } from 'mobx';
import jwtDecode from 'jwt-decode';

type SnackBarMessage = {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  time?: number;
};

class CommonStore {
  @observable
  public token: string | null;
  @observable
  public username: string | null;
  @observable
  public role: string | null;
  @observable
  public snackbar: {
    message: string;
    type: 'success' | 'warning' | 'error' | 'info';
  } | null = null;
  constructor() {
    this.token = localStorage.getItem('token');
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
  }
  @computed
  get loggedIn(): boolean {
    return this.token !== null;
  }
  @computed
  get userId(): string | null {
    if (!this.token) {
      return null;
    }
    return jwtDecode(this.token).id as string;
  }
  @action.bound
  notify({ message, type = 'info', time = 4000 }: SnackBarMessage): void {
    this.snackbar = { message, type };
    setTimeout(() => {
      this.snackbar = null;
    }, time);
  }
  @action.bound
  removeMessage(): void {
    this.snackbar = null;
  }
  @action.bound
  login(username: string, token: string, role?: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    if (role) {
      localStorage.setItem('role', role);
      this.role = role;
    }
    this.username = username;
    this.token = token;
  }
  @action.bound
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.token = null;
    this.username = null;
    this.role = null;
  }
}

export default new CommonStore();
