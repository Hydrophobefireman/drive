// yeah this is not performance optimized
//  but we really really don't need to
// every shift will happen once a network request is completed
// this will be perfectly fine even with a few hundred - thousand items
// more than enough
export class Queue<T> {
  private q: T[];
  public put(t: T) {
    this.q.push(t);
  }
  public get() {
    return this.q.shift();
  }
  constructor() {
    this.q = [];
  }
}
