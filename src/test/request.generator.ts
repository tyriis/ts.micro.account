import {Request} from "../model/request";

export class RequestGenerator {

  private base:string;
  private count: number;

  constructor(prefix: string) {
    this.base = `${prefix}-${Date.now()}-`;
    this.count = 1;
  };

  get id(): string {
    return `${this.base}${this.count++}`;
  }

  getValid(): Request {
    return {
      id: this.id,
      user: {id: 1, roles: ['USER']},
    };
  }

  getInvalid(): Request {
    return {
      id: this.id,
      user: {id: 1, roles: []},
    };
  }
}
