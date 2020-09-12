
https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
https://www.typescriptlang.org/docs/handbook/utility-types.html#omittk



interface HelloWorld {
  prop1: string
  prop2: number
  prop3: boolean
  func1(): string
}

// 1 Transform the type to flag all the undesired keys as 'never'
type FlagExcludedType<Base, Type> = { [Key in keyof Base]: Base[Key] extends Type ? never : Key };

// 2 Get the keys that are not flagged as 'never'
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];

// 3 Use this with a simple Pick to get the right interface, excluding the undesired type
type OmitType<Base, Type> = Pick<Base, AllowedNames<Base, Type>>;


type A = FlagExcludedType<HelloWorld, Function | string>
type B = AllowedNames<HelloWorld, Function | string>
type C = OmitType<HelloWorld, Function>
