declare module "*.css" {
  const value: { [className: string]: string };
  export default value;
}

// Override JSON.parse to return unknown instead of any for better type safety
interface JSON {
  parse(
    text: string,
    reviver?: (this: any, key: string, value: any) => any
  ): unknown;
}
