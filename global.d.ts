export {};

declare global {
  interface StringConstructor {
    format(): string;
  }
  interface String {
    padZero(length: number): string;
  }
}
