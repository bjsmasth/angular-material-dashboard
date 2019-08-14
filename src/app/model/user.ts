export class User {
  id: number;
  email: string;
  name: string;
  created_at: Date;
  email_verified: Date;
}

export class UserPagination {
  current_page: number;
  data = new User();
  first_page_url: URL;
  from: number;
  last_page: number;
  last_page_url: URL;
  next_page_url: URL;
  path: URL;
  per_page: number;
  prev_page_url: number;
  to: number;
  total: number;
}

export class Users {
  status: string;
  users = new UserPagination();
}

export class Token {
  access_token: string;
  token_type: string;
  expires_at: Date;
}

export class InvalidLogin {
  errors: object;
  message: string;
}
