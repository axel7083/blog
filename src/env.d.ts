declare module '@primer/octicons' {
  interface Octicon {
    toSVG(options?: Record<string, string | number | undefined>): string;
  }
  const octicons: Record<string, Octicon | undefined>;
  export default octicons;
}
