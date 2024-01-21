export type Primitive = number | boolean | string | symbol | bigint;

export type CleanRecord<Something> = {
  [Key in keyof Something as string extends Key ? never : Key]: Something[Key];
};
