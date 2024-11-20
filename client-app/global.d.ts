import 'jest-fetch-mock';

declare global {
  var fetch: ReturnType<typeof jest.fn>;
}
