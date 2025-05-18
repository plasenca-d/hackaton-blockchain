// Tipo utilitario para convertir una unión en una intersección
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I,
) => void
	? I
	: never;

type RecordBase<Base = {}, Key extends keyof any = keyof any, T = any> = Base &
	Record<Key, T>;

type SomePartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ForceProtocolHttps<Req> = Req & {
	force_protocol_https: boolean;
};
