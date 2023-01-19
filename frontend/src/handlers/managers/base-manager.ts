import {Signal, dispatchSignal} from "use-signal";

interface BaseNotification<T extends boolean = false> {
  changed: string;
  actor: any;
  batch?: T;
}
export class BaseManager {
  protected isBatching = false;
  protected timeout: any;

  private _pendingDispatches = 0;
  protected batch<T>(task: (...a: unknown[]) => T): T {
    this.isBatching = true;
    let res = task();
    this.isBatching = false;
    return res;
  }
  protected async asyncBatch<T>(
    task: (...a: unknown[]) => Promise<T>
  ): Promise<T> {
    this.isBatching = true;
    let res = await task();
    this.isBatching = false;
    return res;
  }

  protected dispatch<T extends boolean = false>(rest: BaseNotification<T>) {
    clearTimeout(this.timeout);
    const fn = () => {
      dispatchSignal(this.signal, {
        target: rest.actor,
        ...rest,
      });
    };
    if (this._pendingDispatches > 10) {
      this._pendingDispatches = 0;
      fn();
      return;
    }
    this._pendingDispatches++;
    this.timeout = setTimeout(fn, 100);
  }
  public notifyUpdate<T extends boolean = false>(rest: BaseNotification<T>) {
    if (this.isBatching) return;
    this.dispatch(rest);
  }
  constructor(private signal: Signal) {}
}
