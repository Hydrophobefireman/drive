const HAS_SC = "structuredClone" in window;

export const cloneObject = HAS_SC
  ? <T>(x: T) => structuredClone(x)
  : function cloneObject<T>(x: T): T {
      return {...x};
    };
