console.log("using redis mock");
export const redis = {
  client: {
    set: jest
      .fn()
      .mockImplementation(
        (key: string, data: string, option: { EX: number; NX: boolean }) => {}
      ),
  },
};
