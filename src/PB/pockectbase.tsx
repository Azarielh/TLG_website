import PocketBase, { type AuthRecord, type RecordModel } from "pocketbase";
import {
	type Accessor,
	batch,
	createContext,
	createEffect,
	createSignal,
	type JSX,
	onCleanup,
	onMount,
	useContext,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";

type CollectionResponses = Record<string, any>;
type TypedPocketBase = PocketBase;

export const PocketBaseContext = createContext<PocketBase>();

interface PocketBaseProviderProps {
	url?: string;
	client?: PocketBase;
	children: JSX.Element;
}

export const PocketBaseProvider = (props: PocketBaseProviderProps) => {
	if (!props.url && !props.client)
		throw new Error("PocketBaseProvider requires a url or client prop");
	if (props.url && props.client)
		throw new Error(
			"PocketBaseProvider requires a url or client prop, not both",
		);
	const client = props.client
		? props.client
		: (new PocketBase(props.url) as TypedPocketBase);
	return (
		<PocketBaseContext.Provider value={client}>
			{props.children}
		</PocketBaseContext.Provider>
	);
};

export const usePocketbase = () => useContext(PocketBaseContext);

export const AuthContext = createContext<{
	user: Accessor<AuthRecord>;
	avatarUrl: Accessor<string>;
	error: Accessor<string | null>;
	loginWithPassword: (email: string, password: string) => void;
	logout: () => void;
}>();

interface AuthProviderProps {
	children: JSX.Element;
}

export const AuthProvider = (props: AuthProviderProps) => {
	const client = usePocketbase();

	if (!client) {
		throw new Error("useAuth must be used within a <PocketBaseProvider>");
	}

	const [user, setUser] = createSignal(client.authStore.record);
	const [avatarUrl, setAvatarUrl] = createSignal("");
	const [error, setError] = createSignal<string | null>(null);

	onMount(async () => {
		const authData = sessionStorage.getItem("auth");
		if (!authData) return;

		client.authStore.loadFromCookie(authData);

		try {
			// get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
			client.authStore.isValid &&
				(await client.collection("users").authRefresh());
		} catch (_) {
			// clear the auth store on failed refresh
			client.authStore.clear();
			sessionStorage.removeItem("auth");
		}
	});

	createEffect(() => {
		const unsubscribe = client.authStore.onChange((token) => {
			if (token) {
				setUser(client.authStore.record);
				sessionStorage.setItem("auth", client.authStore.exportToCookie());
			} else {
				setUser(null);
				sessionStorage.removeItem("auth");
			}
		});
		onCleanup(() => unsubscribe());
	});

	createEffect(() => {
		if (user()) {
			setAvatarUrl(client.files.getURL(user() as RecordModel, user()?.avatar));
		} else {
			setAvatarUrl("");
		}
	});

	const loginWithPassword = (email: string, password: string) => {
		client
			.collection("users")
			.authWithPassword(email, password)
			.catch((err) => {
				console.log("login error:", err.message);
				setError(err.message);
			});
	};

	const logout = () => {
		client.authStore.clear();
	};

	return (
		<AuthContext.Provider
			value={{ user, avatarUrl, error, loginWithPassword, logout }}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);

type CollectionName = keyof CollectionResponses;

export function useRecord<
	C extends CollectionName,
	E extends string | undefined = undefined,
>(
	collection: C,
	id: string,
	options?: {
		realtime?: boolean;
		expand?: E;
	},
) {
	const client = useContext(PocketBaseContext);
	if (!client) {
		throw new Error("useRecord must be used within a <ClientProvider>");
	}
	const realtime = options?.realtime ?? true;

	type ResponseType = E extends undefined
		? CollectionResponses[C]
		: CollectionResponses[C] & { expand?: Record<string, unknown> };

	const [value, setValue] = createSignal<ResponseType | undefined>(undefined);
	const [error, setError] = createSignal<Error | undefined>(undefined);

	createEffect(() => {
		client
			.collection(collection)
			.getOne(id, options?.expand ? { expand: options.expand } : undefined)
			.then((record) => {
				batch(() => {
					setValue(() => record as ResponseType);
					setError(undefined);
				});

				if (realtime) {
					client.realtime.subscribe(`${collection}/${id}`, (event) => {
						switch (event.action) {
							case "update":
								batch(() => {
									setValue(() => event.record as ResponseType);
									setError(undefined);
								});
								break;
							case "delete":
								batch(() => {
									setValue(undefined);
									setError(undefined);
								});
								break;
						}
					});
				}
			})
			.catch((err: Error) => {
				setValue(undefined);
				setError(err);
			});
	});

	const updateRecord = (value: ResponseType) => {
		return client.collection(collection).update(id, value);
	};

	return { value, error, updateRecord };
}

// Helper type to extract the correct response type from CollectionResponses

export function useRecords<
	C extends CollectionName,
	E extends string | undefined = undefined,
>(
	collection: C,
	options?: {
		batchSize?: number;
		realtime?: boolean;
		expand?: E;
	},
) {
	const client = useContext(PocketBaseContext);
	if (!client) {
		throw new Error("useRecords must be used within a <ClientProvider>");
	}
	const batchSize = options?.batchSize ?? 200;
	const realtime = options?.realtime ?? true;
	const [error, setError] = createSignal<Error | undefined>(undefined);

	// Infer the correct response type, including expand
	type ResponseType = E extends undefined
		? CollectionResponses[C]
		: CollectionResponses[C] & { expand?: Record<string, unknown> };

	const [data, setData] = createStore<ResponseType[]>([]);

	createEffect(() => {
		client
			.collection(collection)
			.getFullList(
				batchSize,
				options?.expand ? { expand: options.expand } : undefined,
			)
			.then(async (update) => {
				const records = update as unknown as ResponseType[];
				batch(() => {
					setData(reconcile(records));
					setError(undefined);
				});
				if (realtime) {
					await client.realtime.subscribe(collection, (event) => {
						switch (event.action) {
							case "create":
								batch(() => {
									setData(
										reconcile([...records, event.record as ResponseType]),
									);
									setError(undefined);
								});
								break;
							case "update":
								batch(() => {
									setData(
										reconcile(
											records?.map((record) => {
												if (record.id === event.record.id) {
													record = event.record;
												}
												return record;
											}),
										),
									);
									setError(undefined);
								});
								break;
							case "delete":
								batch(() => {
									setData(
										reconcile(
											records?.filter(
												(record) => record.id !== event.record.id,
											),
										),
									);
									setError(undefined);
								});
								break;
						}
					});
				}
			})
			.catch((error) =>
				batch(() => {
					setData([]);
					setError(error);
				}),
			);
	});

	const createRecord = (record: Omit<ResponseType, "id">) => {
		return client.collection(collection).create(record);
	};

	const updateRecord = (record: ResponseType) => {
		return client.collection(collection).update(record.id, record);
	};

	const deleteRecord = (record: ResponseType) => {
		return client.collection(collection).delete(record.id);
	};

	return { records: data, error, createRecord, updateRecord, deleteRecord };
}

export const is_new_user = (user: AuthRecord | null) => {
	if (!user) return false;
	const created = new Date(user.created);
	const updated = new Date(user.updated);
	const diff = (updated.getTime() - created.getTime()) / 1000;
	return diff < 10;
};