export class Pivot {
  role_id: number;
  user_id: number;
}

export class Role {
  created_at: Date;
  description: string;
  display_name: string;
  id: number;
  name: string;
  updated_at: Date;
}

export class Roles {
  roles = [new Role()];
}
