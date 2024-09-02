console.log("Using mocked nat module");

// export const nat = {
//   client: {
//     publish: jest
//       .fn()
//       .mockImplementation(
//         (subject: string, data: string, callback: () => void) => {
//           callback();
//         }
//       ),
//   },
// };
export const nat = {
  client: {
    publish: jest.fn((subject: string, data: string, callback: () => void) => {
      callback();
    }),
  },
};
