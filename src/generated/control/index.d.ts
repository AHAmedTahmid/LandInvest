
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model Plan
 * 
 */
export type Plan = $Result.DefaultSelection<Prisma.$PlanPayload>
/**
 * Model Subscription
 * 
 */
export type Subscription = $Result.DefaultSelection<Prisma.$SubscriptionPayload>
/**
 * Model GlobalUser
 * 
 */
export type GlobalUser = $Result.DefaultSelection<Prisma.$GlobalUserPayload>
/**
 * Model UserInvitation
 * 
 */
export type UserInvitation = $Result.DefaultSelection<Prisma.$UserInvitationPayload>
/**
 * Model BillingInvoice
 * 
 */
export type BillingInvoice = $Result.DefaultSelection<Prisma.$BillingInvoicePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plans
    * const plans = await prisma.plan.findMany()
    * ```
    */
  get plan(): Prisma.PlanDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Subscriptions
    * const subscriptions = await prisma.subscription.findMany()
    * ```
    */
  get subscription(): Prisma.SubscriptionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.globalUser`: Exposes CRUD operations for the **GlobalUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GlobalUsers
    * const globalUsers = await prisma.globalUser.findMany()
    * ```
    */
  get globalUser(): Prisma.GlobalUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userInvitation`: Exposes CRUD operations for the **UserInvitation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserInvitations
    * const userInvitations = await prisma.userInvitation.findMany()
    * ```
    */
  get userInvitation(): Prisma.UserInvitationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.billingInvoice`: Exposes CRUD operations for the **BillingInvoice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BillingInvoices
    * const billingInvoices = await prisma.billingInvoice.findMany()
    * ```
    */
  get billingInvoice(): Prisma.BillingInvoiceDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    Plan: 'Plan',
    Subscription: 'Subscription',
    GlobalUser: 'GlobalUser',
    UserInvitation: 'UserInvitation',
    BillingInvoice: 'BillingInvoice'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "tenant" | "plan" | "subscription" | "globalUser" | "userInvitation" | "billingInvoice"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      Plan: {
        payload: Prisma.$PlanPayload<ExtArgs>
        fields: Prisma.PlanFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlanFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlanFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findFirst: {
            args: Prisma.PlanFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlanFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          findMany: {
            args: Prisma.PlanFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>[]
          }
          create: {
            args: Prisma.PlanCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          createMany: {
            args: Prisma.PlanCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PlanDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          update: {
            args: Prisma.PlanUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          deleteMany: {
            args: Prisma.PlanDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlanUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PlanUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlanPayload>
          }
          aggregate: {
            args: Prisma.PlanAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlan>
          }
          groupBy: {
            args: Prisma.PlanGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlanGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlanCountArgs<ExtArgs>
            result: $Utils.Optional<PlanCountAggregateOutputType> | number
          }
        }
      }
      Subscription: {
        payload: Prisma.$SubscriptionPayload<ExtArgs>
        fields: Prisma.SubscriptionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubscriptionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubscriptionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findFirst: {
            args: Prisma.SubscriptionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubscriptionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          findMany: {
            args: Prisma.SubscriptionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>[]
          }
          create: {
            args: Prisma.SubscriptionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          createMany: {
            args: Prisma.SubscriptionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SubscriptionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          update: {
            args: Prisma.SubscriptionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          deleteMany: {
            args: Prisma.SubscriptionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubscriptionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubscriptionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubscriptionPayload>
          }
          aggregate: {
            args: Prisma.SubscriptionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubscription>
          }
          groupBy: {
            args: Prisma.SubscriptionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubscriptionCountArgs<ExtArgs>
            result: $Utils.Optional<SubscriptionCountAggregateOutputType> | number
          }
        }
      }
      GlobalUser: {
        payload: Prisma.$GlobalUserPayload<ExtArgs>
        fields: Prisma.GlobalUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GlobalUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GlobalUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload>
          }
          findFirst: {
            args: Prisma.GlobalUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GlobalUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload>
          }
          findMany: {
            args: Prisma.GlobalUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload>[]
          }
          create: {
            args: Prisma.GlobalUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload>
          }
          createMany: {
            args: Prisma.GlobalUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GlobalUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload>
          }
          update: {
            args: Prisma.GlobalUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload>
          }
          deleteMany: {
            args: Prisma.GlobalUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GlobalUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GlobalUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GlobalUserPayload>
          }
          aggregate: {
            args: Prisma.GlobalUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGlobalUser>
          }
          groupBy: {
            args: Prisma.GlobalUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<GlobalUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.GlobalUserCountArgs<ExtArgs>
            result: $Utils.Optional<GlobalUserCountAggregateOutputType> | number
          }
        }
      }
      UserInvitation: {
        payload: Prisma.$UserInvitationPayload<ExtArgs>
        fields: Prisma.UserInvitationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserInvitationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserInvitationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          findFirst: {
            args: Prisma.UserInvitationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserInvitationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          findMany: {
            args: Prisma.UserInvitationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>[]
          }
          create: {
            args: Prisma.UserInvitationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          createMany: {
            args: Prisma.UserInvitationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserInvitationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          update: {
            args: Prisma.UserInvitationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          deleteMany: {
            args: Prisma.UserInvitationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserInvitationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserInvitationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserInvitationPayload>
          }
          aggregate: {
            args: Prisma.UserInvitationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserInvitation>
          }
          groupBy: {
            args: Prisma.UserInvitationGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserInvitationGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserInvitationCountArgs<ExtArgs>
            result: $Utils.Optional<UserInvitationCountAggregateOutputType> | number
          }
        }
      }
      BillingInvoice: {
        payload: Prisma.$BillingInvoicePayload<ExtArgs>
        fields: Prisma.BillingInvoiceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingInvoiceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingInvoiceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          findFirst: {
            args: Prisma.BillingInvoiceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingInvoiceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          findMany: {
            args: Prisma.BillingInvoiceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>[]
          }
          create: {
            args: Prisma.BillingInvoiceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          createMany: {
            args: Prisma.BillingInvoiceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BillingInvoiceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          update: {
            args: Prisma.BillingInvoiceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          deleteMany: {
            args: Prisma.BillingInvoiceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingInvoiceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BillingInvoiceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingInvoicePayload>
          }
          aggregate: {
            args: Prisma.BillingInvoiceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBillingInvoice>
          }
          groupBy: {
            args: Prisma.BillingInvoiceGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingInvoiceCountArgs<ExtArgs>
            result: $Utils.Optional<BillingInvoiceCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    tenant?: TenantOmit
    plan?: PlanOmit
    subscription?: SubscriptionOmit
    globalUser?: GlobalUserOmit
    userInvitation?: UserInvitationOmit
    billingInvoice?: BillingInvoiceOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    subscriptions: number
    globalUsers: number
    userInvitations: number
    billingInvoices: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | TenantCountOutputTypeCountSubscriptionsArgs
    globalUsers?: boolean | TenantCountOutputTypeCountGlobalUsersArgs
    userInvitations?: boolean | TenantCountOutputTypeCountUserInvitationsArgs
    billingInvoices?: boolean | TenantCountOutputTypeCountBillingInvoicesArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountGlobalUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GlobalUserWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUserInvitationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserInvitationWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountBillingInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
  }


  /**
   * Count Type PlanCountOutputType
   */

  export type PlanCountOutputType = {
    subscriptions: number
  }

  export type PlanCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | PlanCountOutputTypeCountSubscriptionsArgs
  }

  // Custom InputTypes
  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlanCountOutputType
     */
    select?: PlanCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeCountSubscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
  }


  /**
   * Count Type SubscriptionCountOutputType
   */

  export type SubscriptionCountOutputType = {
    billingInvoices: number
  }

  export type SubscriptionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billingInvoices?: boolean | SubscriptionCountOutputTypeCountBillingInvoicesArgs
  }

  // Custom InputTypes
  /**
   * SubscriptionCountOutputType without action
   */
  export type SubscriptionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubscriptionCountOutputType
     */
    select?: SubscriptionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubscriptionCountOutputType without action
   */
  export type SubscriptionCountOutputTypeCountBillingInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    companyName: string | null
    dbHost: string | null
    dbName: string | null
    dbUser: string | null
    dbPasswordEncrypted: string | null
    status: string | null
    createdAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    companyName: string | null
    dbHost: string | null
    dbName: string | null
    dbUser: string | null
    dbPasswordEncrypted: string | null
    status: string | null
    createdAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    companyName: number
    dbHost: number
    dbName: number
    dbUser: number
    dbPasswordEncrypted: number
    status: number
    createdAt: number
    _all: number
  }


  export type TenantMinAggregateInputType = {
    id?: true
    companyName?: true
    dbHost?: true
    dbName?: true
    dbUser?: true
    dbPasswordEncrypted?: true
    status?: true
    createdAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    companyName?: true
    dbHost?: true
    dbName?: true
    dbUser?: true
    dbPasswordEncrypted?: true
    status?: true
    createdAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    companyName?: true
    dbHost?: true
    dbName?: true
    dbUser?: true
    dbPasswordEncrypted?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status: string
    createdAt: Date
    _count: TenantCountAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    companyName?: boolean
    dbHost?: boolean
    dbName?: boolean
    dbUser?: boolean
    dbPasswordEncrypted?: boolean
    status?: boolean
    createdAt?: boolean
    subscriptions?: boolean | Tenant$subscriptionsArgs<ExtArgs>
    globalUsers?: boolean | Tenant$globalUsersArgs<ExtArgs>
    userInvitations?: boolean | Tenant$userInvitationsArgs<ExtArgs>
    billingInvoices?: boolean | Tenant$billingInvoicesArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>



  export type TenantSelectScalar = {
    id?: boolean
    companyName?: boolean
    dbHost?: boolean
    dbName?: boolean
    dbUser?: boolean
    dbPasswordEncrypted?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "companyName" | "dbHost" | "dbName" | "dbUser" | "dbPasswordEncrypted" | "status" | "createdAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | Tenant$subscriptionsArgs<ExtArgs>
    globalUsers?: boolean | Tenant$globalUsersArgs<ExtArgs>
    userInvitations?: boolean | Tenant$userInvitationsArgs<ExtArgs>
    billingInvoices?: boolean | Tenant$billingInvoicesArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
      globalUsers: Prisma.$GlobalUserPayload<ExtArgs>[]
      userInvitations: Prisma.$UserInvitationPayload<ExtArgs>[]
      billingInvoices: Prisma.$BillingInvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      companyName: string
      dbHost: string
      dbName: string
      dbUser: string
      dbPasswordEncrypted: string
      status: string
      createdAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscriptions<T extends Tenant$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    globalUsers<T extends Tenant$globalUsersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$globalUsersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userInvitations<T extends Tenant$userInvitationsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$userInvitationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    billingInvoices<T extends Tenant$billingInvoicesArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$billingInvoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly companyName: FieldRef<"Tenant", 'String'>
    readonly dbHost: FieldRef<"Tenant", 'String'>
    readonly dbName: FieldRef<"Tenant", 'String'>
    readonly dbUser: FieldRef<"Tenant", 'String'>
    readonly dbPasswordEncrypted: FieldRef<"Tenant", 'String'>
    readonly status: FieldRef<"Tenant", 'String'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.subscriptions
   */
  export type Tenant$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Tenant.globalUsers
   */
  export type Tenant$globalUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    where?: GlobalUserWhereInput
    orderBy?: GlobalUserOrderByWithRelationInput | GlobalUserOrderByWithRelationInput[]
    cursor?: GlobalUserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GlobalUserScalarFieldEnum | GlobalUserScalarFieldEnum[]
  }

  /**
   * Tenant.userInvitations
   */
  export type Tenant$userInvitationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    where?: UserInvitationWhereInput
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    cursor?: UserInvitationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserInvitationScalarFieldEnum | UserInvitationScalarFieldEnum[]
  }

  /**
   * Tenant.billingInvoices
   */
  export type Tenant$billingInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    cursor?: BillingInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model Plan
   */

  export type AggregatePlan = {
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  export type PlanAvgAggregateOutputType = {
    priceMonthly: Decimal | null
    priceYearly: Decimal | null
    maxUsers: number | null
    maxProjects: number | null
  }

  export type PlanSumAggregateOutputType = {
    priceMonthly: Decimal | null
    priceYearly: Decimal | null
    maxUsers: number | null
    maxProjects: number | null
  }

  export type PlanMinAggregateOutputType = {
    id: string | null
    name: string | null
    priceMonthly: Decimal | null
    priceYearly: Decimal | null
    maxUsers: number | null
    maxProjects: number | null
  }

  export type PlanMaxAggregateOutputType = {
    id: string | null
    name: string | null
    priceMonthly: Decimal | null
    priceYearly: Decimal | null
    maxUsers: number | null
    maxProjects: number | null
  }

  export type PlanCountAggregateOutputType = {
    id: number
    name: number
    priceMonthly: number
    priceYearly: number
    maxUsers: number
    maxProjects: number
    features: number
    _all: number
  }


  export type PlanAvgAggregateInputType = {
    priceMonthly?: true
    priceYearly?: true
    maxUsers?: true
    maxProjects?: true
  }

  export type PlanSumAggregateInputType = {
    priceMonthly?: true
    priceYearly?: true
    maxUsers?: true
    maxProjects?: true
  }

  export type PlanMinAggregateInputType = {
    id?: true
    name?: true
    priceMonthly?: true
    priceYearly?: true
    maxUsers?: true
    maxProjects?: true
  }

  export type PlanMaxAggregateInputType = {
    id?: true
    name?: true
    priceMonthly?: true
    priceYearly?: true
    maxUsers?: true
    maxProjects?: true
  }

  export type PlanCountAggregateInputType = {
    id?: true
    name?: true
    priceMonthly?: true
    priceYearly?: true
    maxUsers?: true
    maxProjects?: true
    features?: true
    _all?: true
  }

  export type PlanAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plan to aggregate.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plans
    **/
    _count?: true | PlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlanAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlanSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanMaxAggregateInputType
  }

  export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
        [P in keyof T & keyof AggregatePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlan[P]>
      : GetScalarType<T[P], AggregatePlan[P]>
  }




  export type PlanGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlanWhereInput
    orderBy?: PlanOrderByWithAggregationInput | PlanOrderByWithAggregationInput[]
    by: PlanScalarFieldEnum[] | PlanScalarFieldEnum
    having?: PlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanCountAggregateInputType | true
    _avg?: PlanAvgAggregateInputType
    _sum?: PlanSumAggregateInputType
    _min?: PlanMinAggregateInputType
    _max?: PlanMaxAggregateInputType
  }

  export type PlanGroupByOutputType = {
    id: string
    name: string
    priceMonthly: Decimal
    priceYearly: Decimal | null
    maxUsers: number
    maxProjects: number
    features: JsonValue | null
    _count: PlanCountAggregateOutputType | null
    _avg: PlanAvgAggregateOutputType | null
    _sum: PlanSumAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  type GetPlanGroupByPayload<T extends PlanGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanGroupByOutputType[P]>
            : GetScalarType<T[P], PlanGroupByOutputType[P]>
        }
      >
    >


  export type PlanSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    priceMonthly?: boolean
    priceYearly?: boolean
    maxUsers?: boolean
    maxProjects?: boolean
    features?: boolean
    subscriptions?: boolean | Plan$subscriptionsArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["plan"]>



  export type PlanSelectScalar = {
    id?: boolean
    name?: boolean
    priceMonthly?: boolean
    priceYearly?: boolean
    maxUsers?: boolean
    maxProjects?: boolean
    features?: boolean
  }

  export type PlanOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "priceMonthly" | "priceYearly" | "maxUsers" | "maxProjects" | "features", ExtArgs["result"]["plan"]>
  export type PlanInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subscriptions?: boolean | Plan$subscriptionsArgs<ExtArgs>
    _count?: boolean | PlanCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PlanPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Plan"
    objects: {
      subscriptions: Prisma.$SubscriptionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      priceMonthly: Prisma.Decimal
      priceYearly: Prisma.Decimal | null
      maxUsers: number
      maxProjects: number
      features: Prisma.JsonValue | null
    }, ExtArgs["result"]["plan"]>
    composites: {}
  }

  type PlanGetPayload<S extends boolean | null | undefined | PlanDefaultArgs> = $Result.GetResult<Prisma.$PlanPayload, S>

  type PlanCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlanCountAggregateInputType | true
    }

  export interface PlanDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Plan'], meta: { name: 'Plan' } }
    /**
     * Find zero or one Plan that matches the filter.
     * @param {PlanFindUniqueArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlanFindUniqueArgs>(args: SelectSubset<T, PlanFindUniqueArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Plan that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlanFindUniqueOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(args: SelectSubset<T, PlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlanFindFirstArgs>(args?: SelectSubset<T, PlanFindFirstArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Plan that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(args?: SelectSubset<T, PlanFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plans
     * const plans = await prisma.plan.findMany()
     * 
     * // Get first 10 Plans
     * const plans = await prisma.plan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planWithIdOnly = await prisma.plan.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlanFindManyArgs>(args?: SelectSubset<T, PlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Plan.
     * @param {PlanCreateArgs} args - Arguments to create a Plan.
     * @example
     * // Create one Plan
     * const Plan = await prisma.plan.create({
     *   data: {
     *     // ... data to create a Plan
     *   }
     * })
     * 
     */
    create<T extends PlanCreateArgs>(args: SelectSubset<T, PlanCreateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Plans.
     * @param {PlanCreateManyArgs} args - Arguments to create many Plans.
     * @example
     * // Create many Plans
     * const plan = await prisma.plan.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlanCreateManyArgs>(args?: SelectSubset<T, PlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Plan.
     * @param {PlanDeleteArgs} args - Arguments to delete one Plan.
     * @example
     * // Delete one Plan
     * const Plan = await prisma.plan.delete({
     *   where: {
     *     // ... filter to delete one Plan
     *   }
     * })
     * 
     */
    delete<T extends PlanDeleteArgs>(args: SelectSubset<T, PlanDeleteArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Plan.
     * @param {PlanUpdateArgs} args - Arguments to update one Plan.
     * @example
     * // Update one Plan
     * const plan = await prisma.plan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlanUpdateArgs>(args: SelectSubset<T, PlanUpdateArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Plans.
     * @param {PlanDeleteManyArgs} args - Arguments to filter Plans to delete.
     * @example
     * // Delete a few Plans
     * const { count } = await prisma.plan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlanDeleteManyArgs>(args?: SelectSubset<T, PlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plans
     * const plan = await prisma.plan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlanUpdateManyArgs>(args: SelectSubset<T, PlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Plan.
     * @param {PlanUpsertArgs} args - Arguments to update or create a Plan.
     * @example
     * // Update or create a Plan
     * const plan = await prisma.plan.upsert({
     *   create: {
     *     // ... data to create a Plan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plan we want to update
     *   }
     * })
     */
    upsert<T extends PlanUpsertArgs>(args: SelectSubset<T, PlanUpsertArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanCountArgs} args - Arguments to filter Plans to count.
     * @example
     * // Count the number of Plans
     * const count = await prisma.plan.count({
     *   where: {
     *     // ... the filter for the Plans we want to count
     *   }
     * })
    **/
    count<T extends PlanCountArgs>(
      args?: Subset<T, PlanCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanAggregateArgs>(args: Subset<T, PlanAggregateArgs>): Prisma.PrismaPromise<GetPlanAggregateType<T>>

    /**
     * Group by Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanGroupByArgs['orderBy'] }
        : { orderBy?: PlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Plan model
   */
  readonly fields: PlanFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Plan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlanClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subscriptions<T extends Plan$subscriptionsArgs<ExtArgs> = {}>(args?: Subset<T, Plan$subscriptionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Plan model
   */
  interface PlanFieldRefs {
    readonly id: FieldRef<"Plan", 'String'>
    readonly name: FieldRef<"Plan", 'String'>
    readonly priceMonthly: FieldRef<"Plan", 'Decimal'>
    readonly priceYearly: FieldRef<"Plan", 'Decimal'>
    readonly maxUsers: FieldRef<"Plan", 'Int'>
    readonly maxProjects: FieldRef<"Plan", 'Int'>
    readonly features: FieldRef<"Plan", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * Plan findUnique
   */
  export type PlanFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findUniqueOrThrow
   */
  export type PlanFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan findFirst
   */
  export type PlanFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findFirstOrThrow
   */
  export type PlanFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plan to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     */
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan findMany
   */
  export type PlanFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter, which Plans to fetch.
     */
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     */
    orderBy?: PlanOrderByWithRelationInput | PlanOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plans.
     */
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     */
    skip?: number
    distinct?: PlanScalarFieldEnum | PlanScalarFieldEnum[]
  }

  /**
   * Plan create
   */
  export type PlanCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to create a Plan.
     */
    data: XOR<PlanCreateInput, PlanUncheckedCreateInput>
  }

  /**
   * Plan createMany
   */
  export type PlanCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Plans.
     */
    data: PlanCreateManyInput | PlanCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Plan update
   */
  export type PlanUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The data needed to update a Plan.
     */
    data: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
    /**
     * Choose, which Plan to update.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan updateMany
   */
  export type PlanUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Plans.
     */
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>
    /**
     * Filter which Plans to update
     */
    where?: PlanWhereInput
    /**
     * Limit how many Plans to update.
     */
    limit?: number
  }

  /**
   * Plan upsert
   */
  export type PlanUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * The filter to search for the Plan to update in case it exists.
     */
    where: PlanWhereUniqueInput
    /**
     * In case the Plan found by the `where` argument doesn't exist, create a new Plan with this data.
     */
    create: XOR<PlanCreateInput, PlanUncheckedCreateInput>
    /**
     * In case the Plan was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
  }

  /**
   * Plan delete
   */
  export type PlanDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
    /**
     * Filter which Plan to delete.
     */
    where: PlanWhereUniqueInput
  }

  /**
   * Plan deleteMany
   */
  export type PlanDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Plans to delete
     */
    where?: PlanWhereInput
    /**
     * Limit how many Plans to delete.
     */
    limit?: number
  }

  /**
   * Plan.subscriptions
   */
  export type Plan$subscriptionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    cursor?: SubscriptionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Plan without action
   */
  export type PlanDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Plan
     */
    select?: PlanSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Plan
     */
    omit?: PlanOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlanInclude<ExtArgs> | null
  }


  /**
   * Model Subscription
   */

  export type AggregateSubscription = {
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  export type SubscriptionMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planId: string | null
    billingCycle: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    paymentProvider: string | null
    providerSubscriptionId: string | null
    status: string | null
  }

  export type SubscriptionMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    planId: string | null
    billingCycle: string | null
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    paymentProvider: string | null
    providerSubscriptionId: string | null
    status: string | null
  }

  export type SubscriptionCountAggregateOutputType = {
    id: number
    tenantId: number
    planId: number
    billingCycle: number
    currentPeriodStart: number
    currentPeriodEnd: number
    paymentProvider: number
    providerSubscriptionId: number
    status: number
    _all: number
  }


  export type SubscriptionMinAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    billingCycle?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    paymentProvider?: true
    providerSubscriptionId?: true
    status?: true
  }

  export type SubscriptionMaxAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    billingCycle?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    paymentProvider?: true
    providerSubscriptionId?: true
    status?: true
  }

  export type SubscriptionCountAggregateInputType = {
    id?: true
    tenantId?: true
    planId?: true
    billingCycle?: true
    currentPeriodStart?: true
    currentPeriodEnd?: true
    paymentProvider?: true
    providerSubscriptionId?: true
    status?: true
    _all?: true
  }

  export type SubscriptionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscription to aggregate.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Subscriptions
    **/
    _count?: true | SubscriptionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubscriptionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubscriptionMaxAggregateInputType
  }

  export type GetSubscriptionAggregateType<T extends SubscriptionAggregateArgs> = {
        [P in keyof T & keyof AggregateSubscription]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubscription[P]>
      : GetScalarType<T[P], AggregateSubscription[P]>
  }




  export type SubscriptionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubscriptionWhereInput
    orderBy?: SubscriptionOrderByWithAggregationInput | SubscriptionOrderByWithAggregationInput[]
    by: SubscriptionScalarFieldEnum[] | SubscriptionScalarFieldEnum
    having?: SubscriptionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubscriptionCountAggregateInputType | true
    _min?: SubscriptionMinAggregateInputType
    _max?: SubscriptionMaxAggregateInputType
  }

  export type SubscriptionGroupByOutputType = {
    id: string
    tenantId: string
    planId: string
    billingCycle: string
    currentPeriodStart: Date | null
    currentPeriodEnd: Date | null
    paymentProvider: string | null
    providerSubscriptionId: string | null
    status: string
    _count: SubscriptionCountAggregateOutputType | null
    _min: SubscriptionMinAggregateOutputType | null
    _max: SubscriptionMaxAggregateOutputType | null
  }

  type GetSubscriptionGroupByPayload<T extends SubscriptionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubscriptionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubscriptionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
            : GetScalarType<T[P], SubscriptionGroupByOutputType[P]>
        }
      >
    >


  export type SubscriptionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    billingCycle?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    paymentProvider?: boolean
    providerSubscriptionId?: boolean
    status?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | PlanDefaultArgs<ExtArgs>
    billingInvoices?: boolean | Subscription$billingInvoicesArgs<ExtArgs>
    _count?: boolean | SubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subscription"]>



  export type SubscriptionSelectScalar = {
    id?: boolean
    tenantId?: boolean
    planId?: boolean
    billingCycle?: boolean
    currentPeriodStart?: boolean
    currentPeriodEnd?: boolean
    paymentProvider?: boolean
    providerSubscriptionId?: boolean
    status?: boolean
  }

  export type SubscriptionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "planId" | "billingCycle" | "currentPeriodStart" | "currentPeriodEnd" | "paymentProvider" | "providerSubscriptionId" | "status", ExtArgs["result"]["subscription"]>
  export type SubscriptionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    plan?: boolean | PlanDefaultArgs<ExtArgs>
    billingInvoices?: boolean | Subscription$billingInvoicesArgs<ExtArgs>
    _count?: boolean | SubscriptionCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SubscriptionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Subscription"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      plan: Prisma.$PlanPayload<ExtArgs>
      billingInvoices: Prisma.$BillingInvoicePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      planId: string
      billingCycle: string
      currentPeriodStart: Date | null
      currentPeriodEnd: Date | null
      paymentProvider: string | null
      providerSubscriptionId: string | null
      status: string
    }, ExtArgs["result"]["subscription"]>
    composites: {}
  }

  type SubscriptionGetPayload<S extends boolean | null | undefined | SubscriptionDefaultArgs> = $Result.GetResult<Prisma.$SubscriptionPayload, S>

  type SubscriptionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SubscriptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SubscriptionCountAggregateInputType | true
    }

  export interface SubscriptionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Subscription'], meta: { name: 'Subscription' } }
    /**
     * Find zero or one Subscription that matches the filter.
     * @param {SubscriptionFindUniqueArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubscriptionFindUniqueArgs>(args: SelectSubset<T, SubscriptionFindUniqueArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Subscription that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SubscriptionFindUniqueOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubscriptionFindUniqueOrThrowArgs>(args: SelectSubset<T, SubscriptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubscriptionFindFirstArgs>(args?: SelectSubset<T, SubscriptionFindFirstArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Subscription that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindFirstOrThrowArgs} args - Arguments to find a Subscription
     * @example
     * // Get one Subscription
     * const subscription = await prisma.subscription.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubscriptionFindFirstOrThrowArgs>(args?: SelectSubset<T, SubscriptionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Subscriptions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Subscriptions
     * const subscriptions = await prisma.subscription.findMany()
     * 
     * // Get first 10 Subscriptions
     * const subscriptions = await prisma.subscription.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subscriptionWithIdOnly = await prisma.subscription.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubscriptionFindManyArgs>(args?: SelectSubset<T, SubscriptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Subscription.
     * @param {SubscriptionCreateArgs} args - Arguments to create a Subscription.
     * @example
     * // Create one Subscription
     * const Subscription = await prisma.subscription.create({
     *   data: {
     *     // ... data to create a Subscription
     *   }
     * })
     * 
     */
    create<T extends SubscriptionCreateArgs>(args: SelectSubset<T, SubscriptionCreateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Subscriptions.
     * @param {SubscriptionCreateManyArgs} args - Arguments to create many Subscriptions.
     * @example
     * // Create many Subscriptions
     * const subscription = await prisma.subscription.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubscriptionCreateManyArgs>(args?: SelectSubset<T, SubscriptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Subscription.
     * @param {SubscriptionDeleteArgs} args - Arguments to delete one Subscription.
     * @example
     * // Delete one Subscription
     * const Subscription = await prisma.subscription.delete({
     *   where: {
     *     // ... filter to delete one Subscription
     *   }
     * })
     * 
     */
    delete<T extends SubscriptionDeleteArgs>(args: SelectSubset<T, SubscriptionDeleteArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Subscription.
     * @param {SubscriptionUpdateArgs} args - Arguments to update one Subscription.
     * @example
     * // Update one Subscription
     * const subscription = await prisma.subscription.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubscriptionUpdateArgs>(args: SelectSubset<T, SubscriptionUpdateArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Subscriptions.
     * @param {SubscriptionDeleteManyArgs} args - Arguments to filter Subscriptions to delete.
     * @example
     * // Delete a few Subscriptions
     * const { count } = await prisma.subscription.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubscriptionDeleteManyArgs>(args?: SelectSubset<T, SubscriptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Subscriptions
     * const subscription = await prisma.subscription.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubscriptionUpdateManyArgs>(args: SelectSubset<T, SubscriptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Subscription.
     * @param {SubscriptionUpsertArgs} args - Arguments to update or create a Subscription.
     * @example
     * // Update or create a Subscription
     * const subscription = await prisma.subscription.upsert({
     *   create: {
     *     // ... data to create a Subscription
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Subscription we want to update
     *   }
     * })
     */
    upsert<T extends SubscriptionUpsertArgs>(args: SelectSubset<T, SubscriptionUpsertArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Subscriptions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionCountArgs} args - Arguments to filter Subscriptions to count.
     * @example
     * // Count the number of Subscriptions
     * const count = await prisma.subscription.count({
     *   where: {
     *     // ... the filter for the Subscriptions we want to count
     *   }
     * })
    **/
    count<T extends SubscriptionCountArgs>(
      args?: Subset<T, SubscriptionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubscriptionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubscriptionAggregateArgs>(args: Subset<T, SubscriptionAggregateArgs>): Prisma.PrismaPromise<GetSubscriptionAggregateType<T>>

    /**
     * Group by Subscription.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubscriptionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubscriptionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubscriptionGroupByArgs['orderBy'] }
        : { orderBy?: SubscriptionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubscriptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubscriptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Subscription model
   */
  readonly fields: SubscriptionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Subscription.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubscriptionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plan<T extends PlanDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlanDefaultArgs<ExtArgs>>): Prisma__PlanClient<$Result.GetResult<Prisma.$PlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    billingInvoices<T extends Subscription$billingInvoicesArgs<ExtArgs> = {}>(args?: Subset<T, Subscription$billingInvoicesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Subscription model
   */
  interface SubscriptionFieldRefs {
    readonly id: FieldRef<"Subscription", 'String'>
    readonly tenantId: FieldRef<"Subscription", 'String'>
    readonly planId: FieldRef<"Subscription", 'String'>
    readonly billingCycle: FieldRef<"Subscription", 'String'>
    readonly currentPeriodStart: FieldRef<"Subscription", 'DateTime'>
    readonly currentPeriodEnd: FieldRef<"Subscription", 'DateTime'>
    readonly paymentProvider: FieldRef<"Subscription", 'String'>
    readonly providerSubscriptionId: FieldRef<"Subscription", 'String'>
    readonly status: FieldRef<"Subscription", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Subscription findUnique
   */
  export type SubscriptionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findUniqueOrThrow
   */
  export type SubscriptionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription findFirst
   */
  export type SubscriptionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findFirstOrThrow
   */
  export type SubscriptionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscription to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Subscriptions.
     */
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription findMany
   */
  export type SubscriptionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter, which Subscriptions to fetch.
     */
    where?: SubscriptionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Subscriptions to fetch.
     */
    orderBy?: SubscriptionOrderByWithRelationInput | SubscriptionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Subscriptions.
     */
    cursor?: SubscriptionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Subscriptions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Subscriptions.
     */
    skip?: number
    distinct?: SubscriptionScalarFieldEnum | SubscriptionScalarFieldEnum[]
  }

  /**
   * Subscription create
   */
  export type SubscriptionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to create a Subscription.
     */
    data: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
  }

  /**
   * Subscription createMany
   */
  export type SubscriptionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Subscriptions.
     */
    data: SubscriptionCreateManyInput | SubscriptionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Subscription update
   */
  export type SubscriptionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The data needed to update a Subscription.
     */
    data: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
    /**
     * Choose, which Subscription to update.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription updateMany
   */
  export type SubscriptionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Subscriptions.
     */
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyInput>
    /**
     * Filter which Subscriptions to update
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to update.
     */
    limit?: number
  }

  /**
   * Subscription upsert
   */
  export type SubscriptionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * The filter to search for the Subscription to update in case it exists.
     */
    where: SubscriptionWhereUniqueInput
    /**
     * In case the Subscription found by the `where` argument doesn't exist, create a new Subscription with this data.
     */
    create: XOR<SubscriptionCreateInput, SubscriptionUncheckedCreateInput>
    /**
     * In case the Subscription was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubscriptionUpdateInput, SubscriptionUncheckedUpdateInput>
  }

  /**
   * Subscription delete
   */
  export type SubscriptionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    /**
     * Filter which Subscription to delete.
     */
    where: SubscriptionWhereUniqueInput
  }

  /**
   * Subscription deleteMany
   */
  export type SubscriptionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Subscriptions to delete
     */
    where?: SubscriptionWhereInput
    /**
     * Limit how many Subscriptions to delete.
     */
    limit?: number
  }

  /**
   * Subscription.billingInvoices
   */
  export type Subscription$billingInvoicesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    cursor?: BillingInvoiceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * Subscription without action
   */
  export type SubscriptionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
  }


  /**
   * Model GlobalUser
   */

  export type AggregateGlobalUser = {
    _count: GlobalUserCountAggregateOutputType | null
    _min: GlobalUserMinAggregateOutputType | null
    _max: GlobalUserMaxAggregateOutputType | null
  }

  export type GlobalUserMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    fullName: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
  }

  export type GlobalUserMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    fullName: string | null
    email: string | null
    passwordHash: string | null
    role: string | null
    isActive: boolean | null
    lastLoginAt: Date | null
    createdAt: Date | null
  }

  export type GlobalUserCountAggregateOutputType = {
    id: number
    tenantId: number
    fullName: number
    email: number
    passwordHash: number
    role: number
    isActive: number
    lastLoginAt: number
    createdAt: number
    _all: number
  }


  export type GlobalUserMinAggregateInputType = {
    id?: true
    tenantId?: true
    fullName?: true
    email?: true
    passwordHash?: true
    role?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
  }

  export type GlobalUserMaxAggregateInputType = {
    id?: true
    tenantId?: true
    fullName?: true
    email?: true
    passwordHash?: true
    role?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
  }

  export type GlobalUserCountAggregateInputType = {
    id?: true
    tenantId?: true
    fullName?: true
    email?: true
    passwordHash?: true
    role?: true
    isActive?: true
    lastLoginAt?: true
    createdAt?: true
    _all?: true
  }

  export type GlobalUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalUser to aggregate.
     */
    where?: GlobalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalUsers to fetch.
     */
    orderBy?: GlobalUserOrderByWithRelationInput | GlobalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GlobalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GlobalUsers
    **/
    _count?: true | GlobalUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GlobalUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GlobalUserMaxAggregateInputType
  }

  export type GetGlobalUserAggregateType<T extends GlobalUserAggregateArgs> = {
        [P in keyof T & keyof AggregateGlobalUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGlobalUser[P]>
      : GetScalarType<T[P], AggregateGlobalUser[P]>
  }




  export type GlobalUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GlobalUserWhereInput
    orderBy?: GlobalUserOrderByWithAggregationInput | GlobalUserOrderByWithAggregationInput[]
    by: GlobalUserScalarFieldEnum[] | GlobalUserScalarFieldEnum
    having?: GlobalUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GlobalUserCountAggregateInputType | true
    _min?: GlobalUserMinAggregateInputType
    _max?: GlobalUserMaxAggregateInputType
  }

  export type GlobalUserGroupByOutputType = {
    id: string
    tenantId: string
    fullName: string
    email: string
    passwordHash: string
    role: string
    isActive: boolean
    lastLoginAt: Date | null
    createdAt: Date
    _count: GlobalUserCountAggregateOutputType | null
    _min: GlobalUserMinAggregateOutputType | null
    _max: GlobalUserMaxAggregateOutputType | null
  }

  type GetGlobalUserGroupByPayload<T extends GlobalUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GlobalUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GlobalUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GlobalUserGroupByOutputType[P]>
            : GetScalarType<T[P], GlobalUserGroupByOutputType[P]>
        }
      >
    >


  export type GlobalUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["globalUser"]>



  export type GlobalUserSelectScalar = {
    id?: boolean
    tenantId?: boolean
    fullName?: boolean
    email?: boolean
    passwordHash?: boolean
    role?: boolean
    isActive?: boolean
    lastLoginAt?: boolean
    createdAt?: boolean
  }

  export type GlobalUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "fullName" | "email" | "passwordHash" | "role" | "isActive" | "lastLoginAt" | "createdAt", ExtArgs["result"]["globalUser"]>
  export type GlobalUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $GlobalUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GlobalUser"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      fullName: string
      email: string
      passwordHash: string
      role: string
      isActive: boolean
      lastLoginAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["globalUser"]>
    composites: {}
  }

  type GlobalUserGetPayload<S extends boolean | null | undefined | GlobalUserDefaultArgs> = $Result.GetResult<Prisma.$GlobalUserPayload, S>

  type GlobalUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GlobalUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GlobalUserCountAggregateInputType | true
    }

  export interface GlobalUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GlobalUser'], meta: { name: 'GlobalUser' } }
    /**
     * Find zero or one GlobalUser that matches the filter.
     * @param {GlobalUserFindUniqueArgs} args - Arguments to find a GlobalUser
     * @example
     * // Get one GlobalUser
     * const globalUser = await prisma.globalUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GlobalUserFindUniqueArgs>(args: SelectSubset<T, GlobalUserFindUniqueArgs<ExtArgs>>): Prisma__GlobalUserClient<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GlobalUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GlobalUserFindUniqueOrThrowArgs} args - Arguments to find a GlobalUser
     * @example
     * // Get one GlobalUser
     * const globalUser = await prisma.globalUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GlobalUserFindUniqueOrThrowArgs>(args: SelectSubset<T, GlobalUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GlobalUserClient<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GlobalUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalUserFindFirstArgs} args - Arguments to find a GlobalUser
     * @example
     * // Get one GlobalUser
     * const globalUser = await prisma.globalUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GlobalUserFindFirstArgs>(args?: SelectSubset<T, GlobalUserFindFirstArgs<ExtArgs>>): Prisma__GlobalUserClient<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GlobalUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalUserFindFirstOrThrowArgs} args - Arguments to find a GlobalUser
     * @example
     * // Get one GlobalUser
     * const globalUser = await prisma.globalUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GlobalUserFindFirstOrThrowArgs>(args?: SelectSubset<T, GlobalUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__GlobalUserClient<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GlobalUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GlobalUsers
     * const globalUsers = await prisma.globalUser.findMany()
     * 
     * // Get first 10 GlobalUsers
     * const globalUsers = await prisma.globalUser.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const globalUserWithIdOnly = await prisma.globalUser.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GlobalUserFindManyArgs>(args?: SelectSubset<T, GlobalUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GlobalUser.
     * @param {GlobalUserCreateArgs} args - Arguments to create a GlobalUser.
     * @example
     * // Create one GlobalUser
     * const GlobalUser = await prisma.globalUser.create({
     *   data: {
     *     // ... data to create a GlobalUser
     *   }
     * })
     * 
     */
    create<T extends GlobalUserCreateArgs>(args: SelectSubset<T, GlobalUserCreateArgs<ExtArgs>>): Prisma__GlobalUserClient<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GlobalUsers.
     * @param {GlobalUserCreateManyArgs} args - Arguments to create many GlobalUsers.
     * @example
     * // Create many GlobalUsers
     * const globalUser = await prisma.globalUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GlobalUserCreateManyArgs>(args?: SelectSubset<T, GlobalUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GlobalUser.
     * @param {GlobalUserDeleteArgs} args - Arguments to delete one GlobalUser.
     * @example
     * // Delete one GlobalUser
     * const GlobalUser = await prisma.globalUser.delete({
     *   where: {
     *     // ... filter to delete one GlobalUser
     *   }
     * })
     * 
     */
    delete<T extends GlobalUserDeleteArgs>(args: SelectSubset<T, GlobalUserDeleteArgs<ExtArgs>>): Prisma__GlobalUserClient<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GlobalUser.
     * @param {GlobalUserUpdateArgs} args - Arguments to update one GlobalUser.
     * @example
     * // Update one GlobalUser
     * const globalUser = await prisma.globalUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GlobalUserUpdateArgs>(args: SelectSubset<T, GlobalUserUpdateArgs<ExtArgs>>): Prisma__GlobalUserClient<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GlobalUsers.
     * @param {GlobalUserDeleteManyArgs} args - Arguments to filter GlobalUsers to delete.
     * @example
     * // Delete a few GlobalUsers
     * const { count } = await prisma.globalUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GlobalUserDeleteManyArgs>(args?: SelectSubset<T, GlobalUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GlobalUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GlobalUsers
     * const globalUser = await prisma.globalUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GlobalUserUpdateManyArgs>(args: SelectSubset<T, GlobalUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GlobalUser.
     * @param {GlobalUserUpsertArgs} args - Arguments to update or create a GlobalUser.
     * @example
     * // Update or create a GlobalUser
     * const globalUser = await prisma.globalUser.upsert({
     *   create: {
     *     // ... data to create a GlobalUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GlobalUser we want to update
     *   }
     * })
     */
    upsert<T extends GlobalUserUpsertArgs>(args: SelectSubset<T, GlobalUserUpsertArgs<ExtArgs>>): Prisma__GlobalUserClient<$Result.GetResult<Prisma.$GlobalUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GlobalUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalUserCountArgs} args - Arguments to filter GlobalUsers to count.
     * @example
     * // Count the number of GlobalUsers
     * const count = await prisma.globalUser.count({
     *   where: {
     *     // ... the filter for the GlobalUsers we want to count
     *   }
     * })
    **/
    count<T extends GlobalUserCountArgs>(
      args?: Subset<T, GlobalUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GlobalUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GlobalUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GlobalUserAggregateArgs>(args: Subset<T, GlobalUserAggregateArgs>): Prisma.PrismaPromise<GetGlobalUserAggregateType<T>>

    /**
     * Group by GlobalUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GlobalUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GlobalUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GlobalUserGroupByArgs['orderBy'] }
        : { orderBy?: GlobalUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GlobalUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGlobalUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GlobalUser model
   */
  readonly fields: GlobalUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GlobalUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GlobalUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GlobalUser model
   */
  interface GlobalUserFieldRefs {
    readonly id: FieldRef<"GlobalUser", 'String'>
    readonly tenantId: FieldRef<"GlobalUser", 'String'>
    readonly fullName: FieldRef<"GlobalUser", 'String'>
    readonly email: FieldRef<"GlobalUser", 'String'>
    readonly passwordHash: FieldRef<"GlobalUser", 'String'>
    readonly role: FieldRef<"GlobalUser", 'String'>
    readonly isActive: FieldRef<"GlobalUser", 'Boolean'>
    readonly lastLoginAt: FieldRef<"GlobalUser", 'DateTime'>
    readonly createdAt: FieldRef<"GlobalUser", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GlobalUser findUnique
   */
  export type GlobalUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * Filter, which GlobalUser to fetch.
     */
    where: GlobalUserWhereUniqueInput
  }

  /**
   * GlobalUser findUniqueOrThrow
   */
  export type GlobalUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * Filter, which GlobalUser to fetch.
     */
    where: GlobalUserWhereUniqueInput
  }

  /**
   * GlobalUser findFirst
   */
  export type GlobalUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * Filter, which GlobalUser to fetch.
     */
    where?: GlobalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalUsers to fetch.
     */
    orderBy?: GlobalUserOrderByWithRelationInput | GlobalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalUsers.
     */
    cursor?: GlobalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalUsers.
     */
    distinct?: GlobalUserScalarFieldEnum | GlobalUserScalarFieldEnum[]
  }

  /**
   * GlobalUser findFirstOrThrow
   */
  export type GlobalUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * Filter, which GlobalUser to fetch.
     */
    where?: GlobalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalUsers to fetch.
     */
    orderBy?: GlobalUserOrderByWithRelationInput | GlobalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GlobalUsers.
     */
    cursor?: GlobalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GlobalUsers.
     */
    distinct?: GlobalUserScalarFieldEnum | GlobalUserScalarFieldEnum[]
  }

  /**
   * GlobalUser findMany
   */
  export type GlobalUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * Filter, which GlobalUsers to fetch.
     */
    where?: GlobalUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GlobalUsers to fetch.
     */
    orderBy?: GlobalUserOrderByWithRelationInput | GlobalUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GlobalUsers.
     */
    cursor?: GlobalUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GlobalUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GlobalUsers.
     */
    skip?: number
    distinct?: GlobalUserScalarFieldEnum | GlobalUserScalarFieldEnum[]
  }

  /**
   * GlobalUser create
   */
  export type GlobalUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * The data needed to create a GlobalUser.
     */
    data: XOR<GlobalUserCreateInput, GlobalUserUncheckedCreateInput>
  }

  /**
   * GlobalUser createMany
   */
  export type GlobalUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GlobalUsers.
     */
    data: GlobalUserCreateManyInput | GlobalUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GlobalUser update
   */
  export type GlobalUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * The data needed to update a GlobalUser.
     */
    data: XOR<GlobalUserUpdateInput, GlobalUserUncheckedUpdateInput>
    /**
     * Choose, which GlobalUser to update.
     */
    where: GlobalUserWhereUniqueInput
  }

  /**
   * GlobalUser updateMany
   */
  export type GlobalUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GlobalUsers.
     */
    data: XOR<GlobalUserUpdateManyMutationInput, GlobalUserUncheckedUpdateManyInput>
    /**
     * Filter which GlobalUsers to update
     */
    where?: GlobalUserWhereInput
    /**
     * Limit how many GlobalUsers to update.
     */
    limit?: number
  }

  /**
   * GlobalUser upsert
   */
  export type GlobalUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * The filter to search for the GlobalUser to update in case it exists.
     */
    where: GlobalUserWhereUniqueInput
    /**
     * In case the GlobalUser found by the `where` argument doesn't exist, create a new GlobalUser with this data.
     */
    create: XOR<GlobalUserCreateInput, GlobalUserUncheckedCreateInput>
    /**
     * In case the GlobalUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GlobalUserUpdateInput, GlobalUserUncheckedUpdateInput>
  }

  /**
   * GlobalUser delete
   */
  export type GlobalUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
    /**
     * Filter which GlobalUser to delete.
     */
    where: GlobalUserWhereUniqueInput
  }

  /**
   * GlobalUser deleteMany
   */
  export type GlobalUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GlobalUsers to delete
     */
    where?: GlobalUserWhereInput
    /**
     * Limit how many GlobalUsers to delete.
     */
    limit?: number
  }

  /**
   * GlobalUser without action
   */
  export type GlobalUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GlobalUser
     */
    select?: GlobalUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GlobalUser
     */
    omit?: GlobalUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GlobalUserInclude<ExtArgs> | null
  }


  /**
   * Model UserInvitation
   */

  export type AggregateUserInvitation = {
    _count: UserInvitationCountAggregateOutputType | null
    _min: UserInvitationMinAggregateOutputType | null
    _max: UserInvitationMaxAggregateOutputType | null
  }

  export type UserInvitationMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    email: string | null
    role: string | null
    inviteToken: string | null
    expiresAt: Date | null
    accepted: boolean | null
  }

  export type UserInvitationMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    email: string | null
    role: string | null
    inviteToken: string | null
    expiresAt: Date | null
    accepted: boolean | null
  }

  export type UserInvitationCountAggregateOutputType = {
    id: number
    tenantId: number
    email: number
    role: number
    inviteToken: number
    expiresAt: number
    accepted: number
    _all: number
  }


  export type UserInvitationMinAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    role?: true
    inviteToken?: true
    expiresAt?: true
    accepted?: true
  }

  export type UserInvitationMaxAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    role?: true
    inviteToken?: true
    expiresAt?: true
    accepted?: true
  }

  export type UserInvitationCountAggregateInputType = {
    id?: true
    tenantId?: true
    email?: true
    role?: true
    inviteToken?: true
    expiresAt?: true
    accepted?: true
    _all?: true
  }

  export type UserInvitationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserInvitation to aggregate.
     */
    where?: UserInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserInvitations to fetch.
     */
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserInvitations
    **/
    _count?: true | UserInvitationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserInvitationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserInvitationMaxAggregateInputType
  }

  export type GetUserInvitationAggregateType<T extends UserInvitationAggregateArgs> = {
        [P in keyof T & keyof AggregateUserInvitation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserInvitation[P]>
      : GetScalarType<T[P], AggregateUserInvitation[P]>
  }




  export type UserInvitationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserInvitationWhereInput
    orderBy?: UserInvitationOrderByWithAggregationInput | UserInvitationOrderByWithAggregationInput[]
    by: UserInvitationScalarFieldEnum[] | UserInvitationScalarFieldEnum
    having?: UserInvitationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserInvitationCountAggregateInputType | true
    _min?: UserInvitationMinAggregateInputType
    _max?: UserInvitationMaxAggregateInputType
  }

  export type UserInvitationGroupByOutputType = {
    id: string
    tenantId: string
    email: string
    role: string
    inviteToken: string
    expiresAt: Date
    accepted: boolean
    _count: UserInvitationCountAggregateOutputType | null
    _min: UserInvitationMinAggregateOutputType | null
    _max: UserInvitationMaxAggregateOutputType | null
  }

  type GetUserInvitationGroupByPayload<T extends UserInvitationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserInvitationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserInvitationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserInvitationGroupByOutputType[P]>
            : GetScalarType<T[P], UserInvitationGroupByOutputType[P]>
        }
      >
    >


  export type UserInvitationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    email?: boolean
    role?: boolean
    inviteToken?: boolean
    expiresAt?: boolean
    accepted?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userInvitation"]>



  export type UserInvitationSelectScalar = {
    id?: boolean
    tenantId?: boolean
    email?: boolean
    role?: boolean
    inviteToken?: boolean
    expiresAt?: boolean
    accepted?: boolean
  }

  export type UserInvitationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "email" | "role" | "inviteToken" | "expiresAt" | "accepted", ExtArgs["result"]["userInvitation"]>
  export type UserInvitationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $UserInvitationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserInvitation"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      email: string
      role: string
      inviteToken: string
      expiresAt: Date
      accepted: boolean
    }, ExtArgs["result"]["userInvitation"]>
    composites: {}
  }

  type UserInvitationGetPayload<S extends boolean | null | undefined | UserInvitationDefaultArgs> = $Result.GetResult<Prisma.$UserInvitationPayload, S>

  type UserInvitationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserInvitationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserInvitationCountAggregateInputType | true
    }

  export interface UserInvitationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserInvitation'], meta: { name: 'UserInvitation' } }
    /**
     * Find zero or one UserInvitation that matches the filter.
     * @param {UserInvitationFindUniqueArgs} args - Arguments to find a UserInvitation
     * @example
     * // Get one UserInvitation
     * const userInvitation = await prisma.userInvitation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserInvitationFindUniqueArgs>(args: SelectSubset<T, UserInvitationFindUniqueArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserInvitation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserInvitationFindUniqueOrThrowArgs} args - Arguments to find a UserInvitation
     * @example
     * // Get one UserInvitation
     * const userInvitation = await prisma.userInvitation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserInvitationFindUniqueOrThrowArgs>(args: SelectSubset<T, UserInvitationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserInvitation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationFindFirstArgs} args - Arguments to find a UserInvitation
     * @example
     * // Get one UserInvitation
     * const userInvitation = await prisma.userInvitation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserInvitationFindFirstArgs>(args?: SelectSubset<T, UserInvitationFindFirstArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserInvitation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationFindFirstOrThrowArgs} args - Arguments to find a UserInvitation
     * @example
     * // Get one UserInvitation
     * const userInvitation = await prisma.userInvitation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserInvitationFindFirstOrThrowArgs>(args?: SelectSubset<T, UserInvitationFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserInvitations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserInvitations
     * const userInvitations = await prisma.userInvitation.findMany()
     * 
     * // Get first 10 UserInvitations
     * const userInvitations = await prisma.userInvitation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userInvitationWithIdOnly = await prisma.userInvitation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserInvitationFindManyArgs>(args?: SelectSubset<T, UserInvitationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserInvitation.
     * @param {UserInvitationCreateArgs} args - Arguments to create a UserInvitation.
     * @example
     * // Create one UserInvitation
     * const UserInvitation = await prisma.userInvitation.create({
     *   data: {
     *     // ... data to create a UserInvitation
     *   }
     * })
     * 
     */
    create<T extends UserInvitationCreateArgs>(args: SelectSubset<T, UserInvitationCreateArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserInvitations.
     * @param {UserInvitationCreateManyArgs} args - Arguments to create many UserInvitations.
     * @example
     * // Create many UserInvitations
     * const userInvitation = await prisma.userInvitation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserInvitationCreateManyArgs>(args?: SelectSubset<T, UserInvitationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserInvitation.
     * @param {UserInvitationDeleteArgs} args - Arguments to delete one UserInvitation.
     * @example
     * // Delete one UserInvitation
     * const UserInvitation = await prisma.userInvitation.delete({
     *   where: {
     *     // ... filter to delete one UserInvitation
     *   }
     * })
     * 
     */
    delete<T extends UserInvitationDeleteArgs>(args: SelectSubset<T, UserInvitationDeleteArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserInvitation.
     * @param {UserInvitationUpdateArgs} args - Arguments to update one UserInvitation.
     * @example
     * // Update one UserInvitation
     * const userInvitation = await prisma.userInvitation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserInvitationUpdateArgs>(args: SelectSubset<T, UserInvitationUpdateArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserInvitations.
     * @param {UserInvitationDeleteManyArgs} args - Arguments to filter UserInvitations to delete.
     * @example
     * // Delete a few UserInvitations
     * const { count } = await prisma.userInvitation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserInvitationDeleteManyArgs>(args?: SelectSubset<T, UserInvitationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserInvitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserInvitations
     * const userInvitation = await prisma.userInvitation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserInvitationUpdateManyArgs>(args: SelectSubset<T, UserInvitationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserInvitation.
     * @param {UserInvitationUpsertArgs} args - Arguments to update or create a UserInvitation.
     * @example
     * // Update or create a UserInvitation
     * const userInvitation = await prisma.userInvitation.upsert({
     *   create: {
     *     // ... data to create a UserInvitation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserInvitation we want to update
     *   }
     * })
     */
    upsert<T extends UserInvitationUpsertArgs>(args: SelectSubset<T, UserInvitationUpsertArgs<ExtArgs>>): Prisma__UserInvitationClient<$Result.GetResult<Prisma.$UserInvitationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserInvitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationCountArgs} args - Arguments to filter UserInvitations to count.
     * @example
     * // Count the number of UserInvitations
     * const count = await prisma.userInvitation.count({
     *   where: {
     *     // ... the filter for the UserInvitations we want to count
     *   }
     * })
    **/
    count<T extends UserInvitationCountArgs>(
      args?: Subset<T, UserInvitationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserInvitationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserInvitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserInvitationAggregateArgs>(args: Subset<T, UserInvitationAggregateArgs>): Prisma.PrismaPromise<GetUserInvitationAggregateType<T>>

    /**
     * Group by UserInvitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserInvitationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserInvitationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserInvitationGroupByArgs['orderBy'] }
        : { orderBy?: UserInvitationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserInvitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserInvitationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserInvitation model
   */
  readonly fields: UserInvitationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserInvitation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserInvitationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserInvitation model
   */
  interface UserInvitationFieldRefs {
    readonly id: FieldRef<"UserInvitation", 'String'>
    readonly tenantId: FieldRef<"UserInvitation", 'String'>
    readonly email: FieldRef<"UserInvitation", 'String'>
    readonly role: FieldRef<"UserInvitation", 'String'>
    readonly inviteToken: FieldRef<"UserInvitation", 'String'>
    readonly expiresAt: FieldRef<"UserInvitation", 'DateTime'>
    readonly accepted: FieldRef<"UserInvitation", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * UserInvitation findUnique
   */
  export type UserInvitationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitation to fetch.
     */
    where: UserInvitationWhereUniqueInput
  }

  /**
   * UserInvitation findUniqueOrThrow
   */
  export type UserInvitationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitation to fetch.
     */
    where: UserInvitationWhereUniqueInput
  }

  /**
   * UserInvitation findFirst
   */
  export type UserInvitationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitation to fetch.
     */
    where?: UserInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserInvitations to fetch.
     */
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserInvitations.
     */
    cursor?: UserInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserInvitations.
     */
    distinct?: UserInvitationScalarFieldEnum | UserInvitationScalarFieldEnum[]
  }

  /**
   * UserInvitation findFirstOrThrow
   */
  export type UserInvitationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitation to fetch.
     */
    where?: UserInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserInvitations to fetch.
     */
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserInvitations.
     */
    cursor?: UserInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserInvitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserInvitations.
     */
    distinct?: UserInvitationScalarFieldEnum | UserInvitationScalarFieldEnum[]
  }

  /**
   * UserInvitation findMany
   */
  export type UserInvitationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter, which UserInvitations to fetch.
     */
    where?: UserInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserInvitations to fetch.
     */
    orderBy?: UserInvitationOrderByWithRelationInput | UserInvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserInvitations.
     */
    cursor?: UserInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserInvitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserInvitations.
     */
    skip?: number
    distinct?: UserInvitationScalarFieldEnum | UserInvitationScalarFieldEnum[]
  }

  /**
   * UserInvitation create
   */
  export type UserInvitationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * The data needed to create a UserInvitation.
     */
    data: XOR<UserInvitationCreateInput, UserInvitationUncheckedCreateInput>
  }

  /**
   * UserInvitation createMany
   */
  export type UserInvitationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserInvitations.
     */
    data: UserInvitationCreateManyInput | UserInvitationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserInvitation update
   */
  export type UserInvitationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * The data needed to update a UserInvitation.
     */
    data: XOR<UserInvitationUpdateInput, UserInvitationUncheckedUpdateInput>
    /**
     * Choose, which UserInvitation to update.
     */
    where: UserInvitationWhereUniqueInput
  }

  /**
   * UserInvitation updateMany
   */
  export type UserInvitationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserInvitations.
     */
    data: XOR<UserInvitationUpdateManyMutationInput, UserInvitationUncheckedUpdateManyInput>
    /**
     * Filter which UserInvitations to update
     */
    where?: UserInvitationWhereInput
    /**
     * Limit how many UserInvitations to update.
     */
    limit?: number
  }

  /**
   * UserInvitation upsert
   */
  export type UserInvitationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * The filter to search for the UserInvitation to update in case it exists.
     */
    where: UserInvitationWhereUniqueInput
    /**
     * In case the UserInvitation found by the `where` argument doesn't exist, create a new UserInvitation with this data.
     */
    create: XOR<UserInvitationCreateInput, UserInvitationUncheckedCreateInput>
    /**
     * In case the UserInvitation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserInvitationUpdateInput, UserInvitationUncheckedUpdateInput>
  }

  /**
   * UserInvitation delete
   */
  export type UserInvitationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
    /**
     * Filter which UserInvitation to delete.
     */
    where: UserInvitationWhereUniqueInput
  }

  /**
   * UserInvitation deleteMany
   */
  export type UserInvitationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserInvitations to delete
     */
    where?: UserInvitationWhereInput
    /**
     * Limit how many UserInvitations to delete.
     */
    limit?: number
  }

  /**
   * UserInvitation without action
   */
  export type UserInvitationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserInvitation
     */
    select?: UserInvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserInvitation
     */
    omit?: UserInvitationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInvitationInclude<ExtArgs> | null
  }


  /**
   * Model BillingInvoice
   */

  export type AggregateBillingInvoice = {
    _count: BillingInvoiceCountAggregateOutputType | null
    _avg: BillingInvoiceAvgAggregateOutputType | null
    _sum: BillingInvoiceSumAggregateOutputType | null
    _min: BillingInvoiceMinAggregateOutputType | null
    _max: BillingInvoiceMaxAggregateOutputType | null
  }

  export type BillingInvoiceAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type BillingInvoiceSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type BillingInvoiceMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    subscriptionId: string | null
    amount: Decimal | null
    currency: string | null
    status: string | null
    invoiceDate: Date | null
    providerInvoiceId: string | null
  }

  export type BillingInvoiceMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    subscriptionId: string | null
    amount: Decimal | null
    currency: string | null
    status: string | null
    invoiceDate: Date | null
    providerInvoiceId: string | null
  }

  export type BillingInvoiceCountAggregateOutputType = {
    id: number
    tenantId: number
    subscriptionId: number
    amount: number
    currency: number
    status: number
    invoiceDate: number
    providerInvoiceId: number
    _all: number
  }


  export type BillingInvoiceAvgAggregateInputType = {
    amount?: true
  }

  export type BillingInvoiceSumAggregateInputType = {
    amount?: true
  }

  export type BillingInvoiceMinAggregateInputType = {
    id?: true
    tenantId?: true
    subscriptionId?: true
    amount?: true
    currency?: true
    status?: true
    invoiceDate?: true
    providerInvoiceId?: true
  }

  export type BillingInvoiceMaxAggregateInputType = {
    id?: true
    tenantId?: true
    subscriptionId?: true
    amount?: true
    currency?: true
    status?: true
    invoiceDate?: true
    providerInvoiceId?: true
  }

  export type BillingInvoiceCountAggregateInputType = {
    id?: true
    tenantId?: true
    subscriptionId?: true
    amount?: true
    currency?: true
    status?: true
    invoiceDate?: true
    providerInvoiceId?: true
    _all?: true
  }

  export type BillingInvoiceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoice to aggregate.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BillingInvoices
    **/
    _count?: true | BillingInvoiceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingInvoiceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingInvoiceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingInvoiceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingInvoiceMaxAggregateInputType
  }

  export type GetBillingInvoiceAggregateType<T extends BillingInvoiceAggregateArgs> = {
        [P in keyof T & keyof AggregateBillingInvoice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBillingInvoice[P]>
      : GetScalarType<T[P], AggregateBillingInvoice[P]>
  }




  export type BillingInvoiceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingInvoiceWhereInput
    orderBy?: BillingInvoiceOrderByWithAggregationInput | BillingInvoiceOrderByWithAggregationInput[]
    by: BillingInvoiceScalarFieldEnum[] | BillingInvoiceScalarFieldEnum
    having?: BillingInvoiceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingInvoiceCountAggregateInputType | true
    _avg?: BillingInvoiceAvgAggregateInputType
    _sum?: BillingInvoiceSumAggregateInputType
    _min?: BillingInvoiceMinAggregateInputType
    _max?: BillingInvoiceMaxAggregateInputType
  }

  export type BillingInvoiceGroupByOutputType = {
    id: string
    tenantId: string
    subscriptionId: string | null
    amount: Decimal
    currency: string
    status: string | null
    invoiceDate: Date
    providerInvoiceId: string | null
    _count: BillingInvoiceCountAggregateOutputType | null
    _avg: BillingInvoiceAvgAggregateOutputType | null
    _sum: BillingInvoiceSumAggregateOutputType | null
    _min: BillingInvoiceMinAggregateOutputType | null
    _max: BillingInvoiceMaxAggregateOutputType | null
  }

  type GetBillingInvoiceGroupByPayload<T extends BillingInvoiceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingInvoiceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingInvoiceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingInvoiceGroupByOutputType[P]>
            : GetScalarType<T[P], BillingInvoiceGroupByOutputType[P]>
        }
      >
    >


  export type BillingInvoiceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    subscriptionId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    invoiceDate?: boolean
    providerInvoiceId?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    subscription?: boolean | BillingInvoice$subscriptionArgs<ExtArgs>
  }, ExtArgs["result"]["billingInvoice"]>



  export type BillingInvoiceSelectScalar = {
    id?: boolean
    tenantId?: boolean
    subscriptionId?: boolean
    amount?: boolean
    currency?: boolean
    status?: boolean
    invoiceDate?: boolean
    providerInvoiceId?: boolean
  }

  export type BillingInvoiceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "subscriptionId" | "amount" | "currency" | "status" | "invoiceDate" | "providerInvoiceId", ExtArgs["result"]["billingInvoice"]>
  export type BillingInvoiceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    subscription?: boolean | BillingInvoice$subscriptionArgs<ExtArgs>
  }

  export type $BillingInvoicePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BillingInvoice"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      subscription: Prisma.$SubscriptionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      subscriptionId: string | null
      amount: Prisma.Decimal
      currency: string
      status: string | null
      invoiceDate: Date
      providerInvoiceId: string | null
    }, ExtArgs["result"]["billingInvoice"]>
    composites: {}
  }

  type BillingInvoiceGetPayload<S extends boolean | null | undefined | BillingInvoiceDefaultArgs> = $Result.GetResult<Prisma.$BillingInvoicePayload, S>

  type BillingInvoiceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BillingInvoiceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BillingInvoiceCountAggregateInputType | true
    }

  export interface BillingInvoiceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BillingInvoice'], meta: { name: 'BillingInvoice' } }
    /**
     * Find zero or one BillingInvoice that matches the filter.
     * @param {BillingInvoiceFindUniqueArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingInvoiceFindUniqueArgs>(args: SelectSubset<T, BillingInvoiceFindUniqueArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BillingInvoice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BillingInvoiceFindUniqueOrThrowArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingInvoiceFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingInvoiceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindFirstArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingInvoiceFindFirstArgs>(args?: SelectSubset<T, BillingInvoiceFindFirstArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BillingInvoice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindFirstOrThrowArgs} args - Arguments to find a BillingInvoice
     * @example
     * // Get one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingInvoiceFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingInvoiceFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BillingInvoices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BillingInvoices
     * const billingInvoices = await prisma.billingInvoice.findMany()
     * 
     * // Get first 10 BillingInvoices
     * const billingInvoices = await prisma.billingInvoice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingInvoiceWithIdOnly = await prisma.billingInvoice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingInvoiceFindManyArgs>(args?: SelectSubset<T, BillingInvoiceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BillingInvoice.
     * @param {BillingInvoiceCreateArgs} args - Arguments to create a BillingInvoice.
     * @example
     * // Create one BillingInvoice
     * const BillingInvoice = await prisma.billingInvoice.create({
     *   data: {
     *     // ... data to create a BillingInvoice
     *   }
     * })
     * 
     */
    create<T extends BillingInvoiceCreateArgs>(args: SelectSubset<T, BillingInvoiceCreateArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BillingInvoices.
     * @param {BillingInvoiceCreateManyArgs} args - Arguments to create many BillingInvoices.
     * @example
     * // Create many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingInvoiceCreateManyArgs>(args?: SelectSubset<T, BillingInvoiceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BillingInvoice.
     * @param {BillingInvoiceDeleteArgs} args - Arguments to delete one BillingInvoice.
     * @example
     * // Delete one BillingInvoice
     * const BillingInvoice = await prisma.billingInvoice.delete({
     *   where: {
     *     // ... filter to delete one BillingInvoice
     *   }
     * })
     * 
     */
    delete<T extends BillingInvoiceDeleteArgs>(args: SelectSubset<T, BillingInvoiceDeleteArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BillingInvoice.
     * @param {BillingInvoiceUpdateArgs} args - Arguments to update one BillingInvoice.
     * @example
     * // Update one BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingInvoiceUpdateArgs>(args: SelectSubset<T, BillingInvoiceUpdateArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BillingInvoices.
     * @param {BillingInvoiceDeleteManyArgs} args - Arguments to filter BillingInvoices to delete.
     * @example
     * // Delete a few BillingInvoices
     * const { count } = await prisma.billingInvoice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingInvoiceDeleteManyArgs>(args?: SelectSubset<T, BillingInvoiceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BillingInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BillingInvoices
     * const billingInvoice = await prisma.billingInvoice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingInvoiceUpdateManyArgs>(args: SelectSubset<T, BillingInvoiceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BillingInvoice.
     * @param {BillingInvoiceUpsertArgs} args - Arguments to update or create a BillingInvoice.
     * @example
     * // Update or create a BillingInvoice
     * const billingInvoice = await prisma.billingInvoice.upsert({
     *   create: {
     *     // ... data to create a BillingInvoice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BillingInvoice we want to update
     *   }
     * })
     */
    upsert<T extends BillingInvoiceUpsertArgs>(args: SelectSubset<T, BillingInvoiceUpsertArgs<ExtArgs>>): Prisma__BillingInvoiceClient<$Result.GetResult<Prisma.$BillingInvoicePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BillingInvoices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceCountArgs} args - Arguments to filter BillingInvoices to count.
     * @example
     * // Count the number of BillingInvoices
     * const count = await prisma.billingInvoice.count({
     *   where: {
     *     // ... the filter for the BillingInvoices we want to count
     *   }
     * })
    **/
    count<T extends BillingInvoiceCountArgs>(
      args?: Subset<T, BillingInvoiceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingInvoiceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BillingInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingInvoiceAggregateArgs>(args: Subset<T, BillingInvoiceAggregateArgs>): Prisma.PrismaPromise<GetBillingInvoiceAggregateType<T>>

    /**
     * Group by BillingInvoice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingInvoiceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingInvoiceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingInvoiceGroupByArgs['orderBy'] }
        : { orderBy?: BillingInvoiceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingInvoiceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingInvoiceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BillingInvoice model
   */
  readonly fields: BillingInvoiceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BillingInvoice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingInvoiceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    subscription<T extends BillingInvoice$subscriptionArgs<ExtArgs> = {}>(args?: Subset<T, BillingInvoice$subscriptionArgs<ExtArgs>>): Prisma__SubscriptionClient<$Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the BillingInvoice model
   */
  interface BillingInvoiceFieldRefs {
    readonly id: FieldRef<"BillingInvoice", 'String'>
    readonly tenantId: FieldRef<"BillingInvoice", 'String'>
    readonly subscriptionId: FieldRef<"BillingInvoice", 'String'>
    readonly amount: FieldRef<"BillingInvoice", 'Decimal'>
    readonly currency: FieldRef<"BillingInvoice", 'String'>
    readonly status: FieldRef<"BillingInvoice", 'String'>
    readonly invoiceDate: FieldRef<"BillingInvoice", 'DateTime'>
    readonly providerInvoiceId: FieldRef<"BillingInvoice", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BillingInvoice findUnique
   */
  export type BillingInvoiceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice findUniqueOrThrow
   */
  export type BillingInvoiceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice findFirst
   */
  export type BillingInvoiceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice findFirstOrThrow
   */
  export type BillingInvoiceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoice to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BillingInvoices.
     */
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice findMany
   */
  export type BillingInvoiceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter, which BillingInvoices to fetch.
     */
    where?: BillingInvoiceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BillingInvoices to fetch.
     */
    orderBy?: BillingInvoiceOrderByWithRelationInput | BillingInvoiceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BillingInvoices.
     */
    cursor?: BillingInvoiceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BillingInvoices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BillingInvoices.
     */
    skip?: number
    distinct?: BillingInvoiceScalarFieldEnum | BillingInvoiceScalarFieldEnum[]
  }

  /**
   * BillingInvoice create
   */
  export type BillingInvoiceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to create a BillingInvoice.
     */
    data: XOR<BillingInvoiceCreateInput, BillingInvoiceUncheckedCreateInput>
  }

  /**
   * BillingInvoice createMany
   */
  export type BillingInvoiceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BillingInvoices.
     */
    data: BillingInvoiceCreateManyInput | BillingInvoiceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BillingInvoice update
   */
  export type BillingInvoiceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The data needed to update a BillingInvoice.
     */
    data: XOR<BillingInvoiceUpdateInput, BillingInvoiceUncheckedUpdateInput>
    /**
     * Choose, which BillingInvoice to update.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice updateMany
   */
  export type BillingInvoiceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BillingInvoices.
     */
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyInput>
    /**
     * Filter which BillingInvoices to update
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to update.
     */
    limit?: number
  }

  /**
   * BillingInvoice upsert
   */
  export type BillingInvoiceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * The filter to search for the BillingInvoice to update in case it exists.
     */
    where: BillingInvoiceWhereUniqueInput
    /**
     * In case the BillingInvoice found by the `where` argument doesn't exist, create a new BillingInvoice with this data.
     */
    create: XOR<BillingInvoiceCreateInput, BillingInvoiceUncheckedCreateInput>
    /**
     * In case the BillingInvoice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingInvoiceUpdateInput, BillingInvoiceUncheckedUpdateInput>
  }

  /**
   * BillingInvoice delete
   */
  export type BillingInvoiceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
    /**
     * Filter which BillingInvoice to delete.
     */
    where: BillingInvoiceWhereUniqueInput
  }

  /**
   * BillingInvoice deleteMany
   */
  export type BillingInvoiceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BillingInvoices to delete
     */
    where?: BillingInvoiceWhereInput
    /**
     * Limit how many BillingInvoices to delete.
     */
    limit?: number
  }

  /**
   * BillingInvoice.subscription
   */
  export type BillingInvoice$subscriptionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Subscription
     */
    select?: SubscriptionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Subscription
     */
    omit?: SubscriptionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubscriptionInclude<ExtArgs> | null
    where?: SubscriptionWhereInput
  }

  /**
   * BillingInvoice without action
   */
  export type BillingInvoiceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BillingInvoice
     */
    select?: BillingInvoiceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BillingInvoice
     */
    omit?: BillingInvoiceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInvoiceInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    companyName: 'companyName',
    dbHost: 'dbHost',
    dbName: 'dbName',
    dbUser: 'dbUser',
    dbPasswordEncrypted: 'dbPasswordEncrypted',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const PlanScalarFieldEnum: {
    id: 'id',
    name: 'name',
    priceMonthly: 'priceMonthly',
    priceYearly: 'priceYearly',
    maxUsers: 'maxUsers',
    maxProjects: 'maxProjects',
    features: 'features'
  };

  export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum]


  export const SubscriptionScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    planId: 'planId',
    billingCycle: 'billingCycle',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    paymentProvider: 'paymentProvider',
    providerSubscriptionId: 'providerSubscriptionId',
    status: 'status'
  };

  export type SubscriptionScalarFieldEnum = (typeof SubscriptionScalarFieldEnum)[keyof typeof SubscriptionScalarFieldEnum]


  export const GlobalUserScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    fullName: 'fullName',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role',
    isActive: 'isActive',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt'
  };

  export type GlobalUserScalarFieldEnum = (typeof GlobalUserScalarFieldEnum)[keyof typeof GlobalUserScalarFieldEnum]


  export const UserInvitationScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    email: 'email',
    role: 'role',
    inviteToken: 'inviteToken',
    expiresAt: 'expiresAt',
    accepted: 'accepted'
  };

  export type UserInvitationScalarFieldEnum = (typeof UserInvitationScalarFieldEnum)[keyof typeof UserInvitationScalarFieldEnum]


  export const BillingInvoiceScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    subscriptionId: 'subscriptionId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    invoiceDate: 'invoiceDate',
    providerInvoiceId: 'providerInvoiceId'
  };

  export type BillingInvoiceScalarFieldEnum = (typeof BillingInvoiceScalarFieldEnum)[keyof typeof BillingInvoiceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const TenantOrderByRelevanceFieldEnum: {
    id: 'id',
    companyName: 'companyName',
    dbHost: 'dbHost',
    dbName: 'dbName',
    dbUser: 'dbUser',
    dbPasswordEncrypted: 'dbPasswordEncrypted',
    status: 'status'
  };

  export type TenantOrderByRelevanceFieldEnum = (typeof TenantOrderByRelevanceFieldEnum)[keyof typeof TenantOrderByRelevanceFieldEnum]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const PlanOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type PlanOrderByRelevanceFieldEnum = (typeof PlanOrderByRelevanceFieldEnum)[keyof typeof PlanOrderByRelevanceFieldEnum]


  export const SubscriptionOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    planId: 'planId',
    billingCycle: 'billingCycle',
    paymentProvider: 'paymentProvider',
    providerSubscriptionId: 'providerSubscriptionId',
    status: 'status'
  };

  export type SubscriptionOrderByRelevanceFieldEnum = (typeof SubscriptionOrderByRelevanceFieldEnum)[keyof typeof SubscriptionOrderByRelevanceFieldEnum]


  export const GlobalUserOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    fullName: 'fullName',
    email: 'email',
    passwordHash: 'passwordHash',
    role: 'role'
  };

  export type GlobalUserOrderByRelevanceFieldEnum = (typeof GlobalUserOrderByRelevanceFieldEnum)[keyof typeof GlobalUserOrderByRelevanceFieldEnum]


  export const UserInvitationOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    email: 'email',
    role: 'role',
    inviteToken: 'inviteToken'
  };

  export type UserInvitationOrderByRelevanceFieldEnum = (typeof UserInvitationOrderByRelevanceFieldEnum)[keyof typeof UserInvitationOrderByRelevanceFieldEnum]


  export const BillingInvoiceOrderByRelevanceFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    subscriptionId: 'subscriptionId',
    currency: 'currency',
    status: 'status',
    providerInvoiceId: 'providerInvoiceId'
  };

  export type BillingInvoiceOrderByRelevanceFieldEnum = (typeof BillingInvoiceOrderByRelevanceFieldEnum)[keyof typeof BillingInvoiceOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    companyName?: StringFilter<"Tenant"> | string
    dbHost?: StringFilter<"Tenant"> | string
    dbName?: StringFilter<"Tenant"> | string
    dbUser?: StringFilter<"Tenant"> | string
    dbPasswordEncrypted?: StringFilter<"Tenant"> | string
    status?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    subscriptions?: SubscriptionListRelationFilter
    globalUsers?: GlobalUserListRelationFilter
    userInvitations?: UserInvitationListRelationFilter
    billingInvoices?: BillingInvoiceListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    companyName?: SortOrder
    dbHost?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPasswordEncrypted?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    globalUsers?: GlobalUserOrderByRelationAggregateInput
    userInvitations?: UserInvitationOrderByRelationAggregateInput
    billingInvoices?: BillingInvoiceOrderByRelationAggregateInput
    _relevance?: TenantOrderByRelevanceInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    dbName?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    companyName?: StringFilter<"Tenant"> | string
    dbHost?: StringFilter<"Tenant"> | string
    dbUser?: StringFilter<"Tenant"> | string
    dbPasswordEncrypted?: StringFilter<"Tenant"> | string
    status?: StringFilter<"Tenant"> | string
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    subscriptions?: SubscriptionListRelationFilter
    globalUsers?: GlobalUserListRelationFilter
    userInvitations?: UserInvitationListRelationFilter
    billingInvoices?: BillingInvoiceListRelationFilter
  }, "id" | "dbName">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    companyName?: SortOrder
    dbHost?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPasswordEncrypted?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    companyName?: StringWithAggregatesFilter<"Tenant"> | string
    dbHost?: StringWithAggregatesFilter<"Tenant"> | string
    dbName?: StringWithAggregatesFilter<"Tenant"> | string
    dbUser?: StringWithAggregatesFilter<"Tenant"> | string
    dbPasswordEncrypted?: StringWithAggregatesFilter<"Tenant"> | string
    status?: StringWithAggregatesFilter<"Tenant"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type PlanWhereInput = {
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    id?: StringFilter<"Plan"> | string
    name?: StringFilter<"Plan"> | string
    priceMonthly?: DecimalFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalNullableFilter<"Plan"> | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntFilter<"Plan"> | number
    maxProjects?: IntFilter<"Plan"> | number
    features?: JsonNullableFilter<"Plan">
    subscriptions?: SubscriptionListRelationFilter
  }

  export type PlanOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrderInput | SortOrder
    maxUsers?: SortOrder
    maxProjects?: SortOrder
    features?: SortOrderInput | SortOrder
    subscriptions?: SubscriptionOrderByRelationAggregateInput
    _relevance?: PlanOrderByRelevanceInput
  }

  export type PlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PlanWhereInput | PlanWhereInput[]
    OR?: PlanWhereInput[]
    NOT?: PlanWhereInput | PlanWhereInput[]
    name?: StringFilter<"Plan"> | string
    priceMonthly?: DecimalFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalNullableFilter<"Plan"> | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntFilter<"Plan"> | number
    maxProjects?: IntFilter<"Plan"> | number
    features?: JsonNullableFilter<"Plan">
    subscriptions?: SubscriptionListRelationFilter
  }, "id">

  export type PlanOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrderInput | SortOrder
    maxUsers?: SortOrder
    maxProjects?: SortOrder
    features?: SortOrderInput | SortOrder
    _count?: PlanCountOrderByAggregateInput
    _avg?: PlanAvgOrderByAggregateInput
    _max?: PlanMaxOrderByAggregateInput
    _min?: PlanMinOrderByAggregateInput
    _sum?: PlanSumOrderByAggregateInput
  }

  export type PlanScalarWhereWithAggregatesInput = {
    AND?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    OR?: PlanScalarWhereWithAggregatesInput[]
    NOT?: PlanScalarWhereWithAggregatesInput | PlanScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Plan"> | string
    name?: StringWithAggregatesFilter<"Plan"> | string
    priceMonthly?: DecimalWithAggregatesFilter<"Plan"> | Decimal | DecimalJsLike | number | string
    priceYearly?: DecimalNullableWithAggregatesFilter<"Plan"> | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntWithAggregatesFilter<"Plan"> | number
    maxProjects?: IntWithAggregatesFilter<"Plan"> | number
    features?: JsonNullableWithAggregatesFilter<"Plan">
  }

  export type SubscriptionWhereInput = {
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    id?: StringFilter<"Subscription"> | string
    tenantId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    billingCycle?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    paymentProvider?: StringNullableFilter<"Subscription"> | string | null
    providerSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    plan?: XOR<PlanScalarRelationFilter, PlanWhereInput>
    billingInvoices?: BillingInvoiceListRelationFilter
  }

  export type SubscriptionOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    billingCycle?: SortOrder
    currentPeriodStart?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    paymentProvider?: SortOrderInput | SortOrder
    providerSubscriptionId?: SortOrderInput | SortOrder
    status?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    plan?: PlanOrderByWithRelationInput
    billingInvoices?: BillingInvoiceOrderByRelationAggregateInput
    _relevance?: SubscriptionOrderByRelevanceInput
  }

  export type SubscriptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubscriptionWhereInput | SubscriptionWhereInput[]
    OR?: SubscriptionWhereInput[]
    NOT?: SubscriptionWhereInput | SubscriptionWhereInput[]
    tenantId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    billingCycle?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    paymentProvider?: StringNullableFilter<"Subscription"> | string | null
    providerSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    plan?: XOR<PlanScalarRelationFilter, PlanWhereInput>
    billingInvoices?: BillingInvoiceListRelationFilter
  }, "id">

  export type SubscriptionOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    billingCycle?: SortOrder
    currentPeriodStart?: SortOrderInput | SortOrder
    currentPeriodEnd?: SortOrderInput | SortOrder
    paymentProvider?: SortOrderInput | SortOrder
    providerSubscriptionId?: SortOrderInput | SortOrder
    status?: SortOrder
    _count?: SubscriptionCountOrderByAggregateInput
    _max?: SubscriptionMaxOrderByAggregateInput
    _min?: SubscriptionMinOrderByAggregateInput
  }

  export type SubscriptionScalarWhereWithAggregatesInput = {
    AND?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    OR?: SubscriptionScalarWhereWithAggregatesInput[]
    NOT?: SubscriptionScalarWhereWithAggregatesInput | SubscriptionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Subscription"> | string
    tenantId?: StringWithAggregatesFilter<"Subscription"> | string
    planId?: StringWithAggregatesFilter<"Subscription"> | string
    billingCycle?: StringWithAggregatesFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableWithAggregatesFilter<"Subscription"> | Date | string | null
    paymentProvider?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    providerSubscriptionId?: StringNullableWithAggregatesFilter<"Subscription"> | string | null
    status?: StringWithAggregatesFilter<"Subscription"> | string
  }

  export type GlobalUserWhereInput = {
    AND?: GlobalUserWhereInput | GlobalUserWhereInput[]
    OR?: GlobalUserWhereInput[]
    NOT?: GlobalUserWhereInput | GlobalUserWhereInput[]
    id?: StringFilter<"GlobalUser"> | string
    tenantId?: StringFilter<"GlobalUser"> | string
    fullName?: StringFilter<"GlobalUser"> | string
    email?: StringFilter<"GlobalUser"> | string
    passwordHash?: StringFilter<"GlobalUser"> | string
    role?: StringFilter<"GlobalUser"> | string
    isActive?: BoolFilter<"GlobalUser"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"GlobalUser"> | Date | string | null
    createdAt?: DateTimeFilter<"GlobalUser"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type GlobalUserOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: GlobalUserOrderByRelevanceInput
  }

  export type GlobalUserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: GlobalUserWhereInput | GlobalUserWhereInput[]
    OR?: GlobalUserWhereInput[]
    NOT?: GlobalUserWhereInput | GlobalUserWhereInput[]
    tenantId?: StringFilter<"GlobalUser"> | string
    fullName?: StringFilter<"GlobalUser"> | string
    passwordHash?: StringFilter<"GlobalUser"> | string
    role?: StringFilter<"GlobalUser"> | string
    isActive?: BoolFilter<"GlobalUser"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"GlobalUser"> | Date | string | null
    createdAt?: DateTimeFilter<"GlobalUser"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "email">

  export type GlobalUserOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: GlobalUserCountOrderByAggregateInput
    _max?: GlobalUserMaxOrderByAggregateInput
    _min?: GlobalUserMinOrderByAggregateInput
  }

  export type GlobalUserScalarWhereWithAggregatesInput = {
    AND?: GlobalUserScalarWhereWithAggregatesInput | GlobalUserScalarWhereWithAggregatesInput[]
    OR?: GlobalUserScalarWhereWithAggregatesInput[]
    NOT?: GlobalUserScalarWhereWithAggregatesInput | GlobalUserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GlobalUser"> | string
    tenantId?: StringWithAggregatesFilter<"GlobalUser"> | string
    fullName?: StringWithAggregatesFilter<"GlobalUser"> | string
    email?: StringWithAggregatesFilter<"GlobalUser"> | string
    passwordHash?: StringWithAggregatesFilter<"GlobalUser"> | string
    role?: StringWithAggregatesFilter<"GlobalUser"> | string
    isActive?: BoolWithAggregatesFilter<"GlobalUser"> | boolean
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"GlobalUser"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"GlobalUser"> | Date | string
  }

  export type UserInvitationWhereInput = {
    AND?: UserInvitationWhereInput | UserInvitationWhereInput[]
    OR?: UserInvitationWhereInput[]
    NOT?: UserInvitationWhereInput | UserInvitationWhereInput[]
    id?: StringFilter<"UserInvitation"> | string
    tenantId?: StringFilter<"UserInvitation"> | string
    email?: StringFilter<"UserInvitation"> | string
    role?: StringFilter<"UserInvitation"> | string
    inviteToken?: StringFilter<"UserInvitation"> | string
    expiresAt?: DateTimeFilter<"UserInvitation"> | Date | string
    accepted?: BoolFilter<"UserInvitation"> | boolean
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type UserInvitationOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    role?: SortOrder
    inviteToken?: SortOrder
    expiresAt?: SortOrder
    accepted?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: UserInvitationOrderByRelevanceInput
  }

  export type UserInvitationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    inviteToken?: string
    AND?: UserInvitationWhereInput | UserInvitationWhereInput[]
    OR?: UserInvitationWhereInput[]
    NOT?: UserInvitationWhereInput | UserInvitationWhereInput[]
    tenantId?: StringFilter<"UserInvitation"> | string
    email?: StringFilter<"UserInvitation"> | string
    role?: StringFilter<"UserInvitation"> | string
    expiresAt?: DateTimeFilter<"UserInvitation"> | Date | string
    accepted?: BoolFilter<"UserInvitation"> | boolean
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "inviteToken">

  export type UserInvitationOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    role?: SortOrder
    inviteToken?: SortOrder
    expiresAt?: SortOrder
    accepted?: SortOrder
    _count?: UserInvitationCountOrderByAggregateInput
    _max?: UserInvitationMaxOrderByAggregateInput
    _min?: UserInvitationMinOrderByAggregateInput
  }

  export type UserInvitationScalarWhereWithAggregatesInput = {
    AND?: UserInvitationScalarWhereWithAggregatesInput | UserInvitationScalarWhereWithAggregatesInput[]
    OR?: UserInvitationScalarWhereWithAggregatesInput[]
    NOT?: UserInvitationScalarWhereWithAggregatesInput | UserInvitationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserInvitation"> | string
    tenantId?: StringWithAggregatesFilter<"UserInvitation"> | string
    email?: StringWithAggregatesFilter<"UserInvitation"> | string
    role?: StringWithAggregatesFilter<"UserInvitation"> | string
    inviteToken?: StringWithAggregatesFilter<"UserInvitation"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"UserInvitation"> | Date | string
    accepted?: BoolWithAggregatesFilter<"UserInvitation"> | boolean
  }

  export type BillingInvoiceWhereInput = {
    AND?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    OR?: BillingInvoiceWhereInput[]
    NOT?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    id?: StringFilter<"BillingInvoice"> | string
    tenantId?: StringFilter<"BillingInvoice"> | string
    subscriptionId?: StringNullableFilter<"BillingInvoice"> | string | null
    amount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"BillingInvoice"> | string
    status?: StringNullableFilter<"BillingInvoice"> | string | null
    invoiceDate?: DateTimeFilter<"BillingInvoice"> | Date | string
    providerInvoiceId?: StringNullableFilter<"BillingInvoice"> | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    subscription?: XOR<SubscriptionNullableScalarRelationFilter, SubscriptionWhereInput> | null
  }

  export type BillingInvoiceOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrderInput | SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrderInput | SortOrder
    invoiceDate?: SortOrder
    providerInvoiceId?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
    subscription?: SubscriptionOrderByWithRelationInput
    _relevance?: BillingInvoiceOrderByRelevanceInput
  }

  export type BillingInvoiceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    OR?: BillingInvoiceWhereInput[]
    NOT?: BillingInvoiceWhereInput | BillingInvoiceWhereInput[]
    tenantId?: StringFilter<"BillingInvoice"> | string
    subscriptionId?: StringNullableFilter<"BillingInvoice"> | string | null
    amount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"BillingInvoice"> | string
    status?: StringNullableFilter<"BillingInvoice"> | string | null
    invoiceDate?: DateTimeFilter<"BillingInvoice"> | Date | string
    providerInvoiceId?: StringNullableFilter<"BillingInvoice"> | string | null
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    subscription?: XOR<SubscriptionNullableScalarRelationFilter, SubscriptionWhereInput> | null
  }, "id">

  export type BillingInvoiceOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrderInput | SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrderInput | SortOrder
    invoiceDate?: SortOrder
    providerInvoiceId?: SortOrderInput | SortOrder
    _count?: BillingInvoiceCountOrderByAggregateInput
    _avg?: BillingInvoiceAvgOrderByAggregateInput
    _max?: BillingInvoiceMaxOrderByAggregateInput
    _min?: BillingInvoiceMinOrderByAggregateInput
    _sum?: BillingInvoiceSumOrderByAggregateInput
  }

  export type BillingInvoiceScalarWhereWithAggregatesInput = {
    AND?: BillingInvoiceScalarWhereWithAggregatesInput | BillingInvoiceScalarWhereWithAggregatesInput[]
    OR?: BillingInvoiceScalarWhereWithAggregatesInput[]
    NOT?: BillingInvoiceScalarWhereWithAggregatesInput | BillingInvoiceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BillingInvoice"> | string
    tenantId?: StringWithAggregatesFilter<"BillingInvoice"> | string
    subscriptionId?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    amount?: DecimalWithAggregatesFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    currency?: StringWithAggregatesFilter<"BillingInvoice"> | string
    status?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
    invoiceDate?: DateTimeWithAggregatesFilter<"BillingInvoice"> | Date | string
    providerInvoiceId?: StringNullableWithAggregatesFilter<"BillingInvoice"> | string | null
  }

  export type TenantCreateInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    globalUsers?: GlobalUserCreateNestedManyWithoutTenantInput
    userInvitations?: UserInvitationCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    globalUsers?: GlobalUserUncheckedCreateNestedManyWithoutTenantInput
    userInvitations?: UserInvitationUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    globalUsers?: GlobalUserUpdateManyWithoutTenantNestedInput
    userInvitations?: UserInvitationUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    globalUsers?: GlobalUserUncheckedUpdateManyWithoutTenantNestedInput
    userInvitations?: UserInvitationUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlanCreateInput = {
    id?: string
    name: string
    priceMonthly: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string | null
    maxUsers?: number
    maxProjects?: number
    features?: NullableJsonNullValueInput | InputJsonValue
    subscriptions?: SubscriptionCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateInput = {
    id?: string
    name: string
    priceMonthly: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string | null
    maxUsers?: number
    maxProjects?: number
    features?: NullableJsonNullValueInput | InputJsonValue
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxProjects?: IntFieldUpdateOperationsInput | number
    features?: NullableJsonNullValueInput | InputJsonValue
    subscriptions?: SubscriptionUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxProjects?: IntFieldUpdateOperationsInput | number
    features?: NullableJsonNullValueInput | InputJsonValue
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanCreateManyInput = {
    id?: string
    name: string
    priceMonthly: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string | null
    maxUsers?: number
    maxProjects?: number
    features?: NullableJsonNullValueInput | InputJsonValue
  }

  export type PlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxProjects?: IntFieldUpdateOperationsInput | number
    features?: NullableJsonNullValueInput | InputJsonValue
  }

  export type PlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxProjects?: IntFieldUpdateOperationsInput | number
    features?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SubscriptionCreateInput = {
    id?: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput
    plan: PlanCreateNestedOneWithoutSubscriptionsInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateInput = {
    id?: string
    tenantId: string
    planId: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsNestedInput
    plan?: PlanUpdateOneRequiredWithoutSubscriptionsNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionCreateManyInput = {
    id?: string
    tenantId: string
    planId: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
  }

  export type SubscriptionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type GlobalUserCreateInput = {
    id?: string
    fullName: string
    email: string
    passwordHash: string
    role: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutGlobalUsersInput
  }

  export type GlobalUserUncheckedCreateInput = {
    id?: string
    tenantId: string
    fullName: string
    email: string
    passwordHash: string
    role: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GlobalUserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutGlobalUsersNestedInput
  }

  export type GlobalUserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalUserCreateManyInput = {
    id?: string
    tenantId: string
    fullName: string
    email: string
    passwordHash: string
    role: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GlobalUserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalUserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserInvitationCreateInput = {
    id?: string
    email: string
    role: string
    inviteToken: string
    expiresAt: Date | string
    accepted?: boolean
    tenant: TenantCreateNestedOneWithoutUserInvitationsInput
  }

  export type UserInvitationUncheckedCreateInput = {
    id?: string
    tenantId: string
    email: string
    role: string
    inviteToken: string
    expiresAt: Date | string
    accepted?: boolean
  }

  export type UserInvitationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    inviteToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
    tenant?: TenantUpdateOneRequiredWithoutUserInvitationsNestedInput
  }

  export type UserInvitationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    inviteToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserInvitationCreateManyInput = {
    id?: string
    tenantId: string
    email: string
    role: string
    inviteToken: string
    expiresAt: Date | string
    accepted?: boolean
  }

  export type UserInvitationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    inviteToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserInvitationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    inviteToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BillingInvoiceCreateInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
    tenant: TenantCreateNestedOneWithoutBillingInvoicesInput
    subscription?: SubscriptionCreateNestedOneWithoutBillingInvoicesInput
  }

  export type BillingInvoiceUncheckedCreateInput = {
    id?: string
    tenantId: string
    subscriptionId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
  }

  export type BillingInvoiceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    tenant?: TenantUpdateOneRequiredWithoutBillingInvoicesNestedInput
    subscription?: SubscriptionUpdateOneWithoutBillingInvoicesNestedInput
  }

  export type BillingInvoiceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingInvoiceCreateManyInput = {
    id?: string
    tenantId: string
    subscriptionId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
  }

  export type BillingInvoiceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingInvoiceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SubscriptionListRelationFilter = {
    every?: SubscriptionWhereInput
    some?: SubscriptionWhereInput
    none?: SubscriptionWhereInput
  }

  export type GlobalUserListRelationFilter = {
    every?: GlobalUserWhereInput
    some?: GlobalUserWhereInput
    none?: GlobalUserWhereInput
  }

  export type UserInvitationListRelationFilter = {
    every?: UserInvitationWhereInput
    some?: UserInvitationWhereInput
    none?: UserInvitationWhereInput
  }

  export type BillingInvoiceListRelationFilter = {
    every?: BillingInvoiceWhereInput
    some?: BillingInvoiceWhereInput
    none?: BillingInvoiceWhereInput
  }

  export type SubscriptionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GlobalUserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserInvitationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingInvoiceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantOrderByRelevanceInput = {
    fields: TenantOrderByRelevanceFieldEnum | TenantOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    dbHost?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPasswordEncrypted?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    dbHost?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPasswordEncrypted?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    companyName?: SortOrder
    dbHost?: SortOrder
    dbName?: SortOrder
    dbUser?: SortOrder
    dbPasswordEncrypted?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PlanOrderByRelevanceInput = {
    fields: PlanOrderByRelevanceFieldEnum | PlanOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PlanCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    maxUsers?: SortOrder
    maxProjects?: SortOrder
    features?: SortOrder
  }

  export type PlanAvgOrderByAggregateInput = {
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    maxUsers?: SortOrder
    maxProjects?: SortOrder
  }

  export type PlanMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    maxUsers?: SortOrder
    maxProjects?: SortOrder
  }

  export type PlanMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    maxUsers?: SortOrder
    maxProjects?: SortOrder
  }

  export type PlanSumOrderByAggregateInput = {
    priceMonthly?: SortOrder
    priceYearly?: SortOrder
    maxUsers?: SortOrder
    maxProjects?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type PlanScalarRelationFilter = {
    is?: PlanWhereInput
    isNot?: PlanWhereInput
  }

  export type SubscriptionOrderByRelevanceInput = {
    fields: SubscriptionOrderByRelevanceFieldEnum | SubscriptionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SubscriptionCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    billingCycle?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    paymentProvider?: SortOrder
    providerSubscriptionId?: SortOrder
    status?: SortOrder
  }

  export type SubscriptionMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    billingCycle?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    paymentProvider?: SortOrder
    providerSubscriptionId?: SortOrder
    status?: SortOrder
  }

  export type SubscriptionMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    planId?: SortOrder
    billingCycle?: SortOrder
    currentPeriodStart?: SortOrder
    currentPeriodEnd?: SortOrder
    paymentProvider?: SortOrder
    providerSubscriptionId?: SortOrder
    status?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type GlobalUserOrderByRelevanceInput = {
    fields: GlobalUserOrderByRelevanceFieldEnum | GlobalUserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type GlobalUserCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GlobalUserMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
  }

  export type GlobalUserMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    lastLoginAt?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type UserInvitationOrderByRelevanceInput = {
    fields: UserInvitationOrderByRelevanceFieldEnum | UserInvitationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserInvitationCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    role?: SortOrder
    inviteToken?: SortOrder
    expiresAt?: SortOrder
    accepted?: SortOrder
  }

  export type UserInvitationMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    role?: SortOrder
    inviteToken?: SortOrder
    expiresAt?: SortOrder
    accepted?: SortOrder
  }

  export type UserInvitationMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    email?: SortOrder
    role?: SortOrder
    inviteToken?: SortOrder
    expiresAt?: SortOrder
    accepted?: SortOrder
  }

  export type SubscriptionNullableScalarRelationFilter = {
    is?: SubscriptionWhereInput | null
    isNot?: SubscriptionWhereInput | null
  }

  export type BillingInvoiceOrderByRelevanceInput = {
    fields: BillingInvoiceOrderByRelevanceFieldEnum | BillingInvoiceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BillingInvoiceCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    invoiceDate?: SortOrder
    providerInvoiceId?: SortOrder
  }

  export type BillingInvoiceAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type BillingInvoiceMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    invoiceDate?: SortOrder
    providerInvoiceId?: SortOrder
  }

  export type BillingInvoiceMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    subscriptionId?: SortOrder
    amount?: SortOrder
    currency?: SortOrder
    status?: SortOrder
    invoiceDate?: SortOrder
    providerInvoiceId?: SortOrder
  }

  export type BillingInvoiceSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type SubscriptionCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type GlobalUserCreateNestedManyWithoutTenantInput = {
    create?: XOR<GlobalUserCreateWithoutTenantInput, GlobalUserUncheckedCreateWithoutTenantInput> | GlobalUserCreateWithoutTenantInput[] | GlobalUserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: GlobalUserCreateOrConnectWithoutTenantInput | GlobalUserCreateOrConnectWithoutTenantInput[]
    createMany?: GlobalUserCreateManyTenantInputEnvelope
    connect?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
  }

  export type UserInvitationCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserInvitationCreateWithoutTenantInput, UserInvitationUncheckedCreateWithoutTenantInput> | UserInvitationCreateWithoutTenantInput[] | UserInvitationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserInvitationCreateOrConnectWithoutTenantInput | UserInvitationCreateOrConnectWithoutTenantInput[]
    createMany?: UserInvitationCreateManyTenantInputEnvelope
    connect?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
  }

  export type BillingInvoiceCreateNestedManyWithoutTenantInput = {
    create?: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput> | BillingInvoiceCreateWithoutTenantInput[] | BillingInvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutTenantInput | BillingInvoiceCreateOrConnectWithoutTenantInput[]
    createMany?: BillingInvoiceCreateManyTenantInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type GlobalUserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<GlobalUserCreateWithoutTenantInput, GlobalUserUncheckedCreateWithoutTenantInput> | GlobalUserCreateWithoutTenantInput[] | GlobalUserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: GlobalUserCreateOrConnectWithoutTenantInput | GlobalUserCreateOrConnectWithoutTenantInput[]
    createMany?: GlobalUserCreateManyTenantInputEnvelope
    connect?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
  }

  export type UserInvitationUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UserInvitationCreateWithoutTenantInput, UserInvitationUncheckedCreateWithoutTenantInput> | UserInvitationCreateWithoutTenantInput[] | UserInvitationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserInvitationCreateOrConnectWithoutTenantInput | UserInvitationCreateOrConnectWithoutTenantInput[]
    createMany?: UserInvitationCreateManyTenantInputEnvelope
    connect?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
  }

  export type BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput> | BillingInvoiceCreateWithoutTenantInput[] | BillingInvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutTenantInput | BillingInvoiceCreateOrConnectWithoutTenantInput[]
    createMany?: BillingInvoiceCreateManyTenantInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SubscriptionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutTenantInput | SubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutTenantInput | SubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutTenantInput | SubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type GlobalUserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<GlobalUserCreateWithoutTenantInput, GlobalUserUncheckedCreateWithoutTenantInput> | GlobalUserCreateWithoutTenantInput[] | GlobalUserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: GlobalUserCreateOrConnectWithoutTenantInput | GlobalUserCreateOrConnectWithoutTenantInput[]
    upsert?: GlobalUserUpsertWithWhereUniqueWithoutTenantInput | GlobalUserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: GlobalUserCreateManyTenantInputEnvelope
    set?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
    disconnect?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
    delete?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
    connect?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
    update?: GlobalUserUpdateWithWhereUniqueWithoutTenantInput | GlobalUserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: GlobalUserUpdateManyWithWhereWithoutTenantInput | GlobalUserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: GlobalUserScalarWhereInput | GlobalUserScalarWhereInput[]
  }

  export type UserInvitationUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserInvitationCreateWithoutTenantInput, UserInvitationUncheckedCreateWithoutTenantInput> | UserInvitationCreateWithoutTenantInput[] | UserInvitationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserInvitationCreateOrConnectWithoutTenantInput | UserInvitationCreateOrConnectWithoutTenantInput[]
    upsert?: UserInvitationUpsertWithWhereUniqueWithoutTenantInput | UserInvitationUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserInvitationCreateManyTenantInputEnvelope
    set?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
    disconnect?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
    delete?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
    connect?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
    update?: UserInvitationUpdateWithWhereUniqueWithoutTenantInput | UserInvitationUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserInvitationUpdateManyWithWhereWithoutTenantInput | UserInvitationUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserInvitationScalarWhereInput | UserInvitationScalarWhereInput[]
  }

  export type BillingInvoiceUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput> | BillingInvoiceCreateWithoutTenantInput[] | BillingInvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutTenantInput | BillingInvoiceCreateOrConnectWithoutTenantInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput | BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BillingInvoiceCreateManyTenantInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput | BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutTenantInput | BillingInvoiceUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput> | SubscriptionCreateWithoutTenantInput[] | SubscriptionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutTenantInput | SubscriptionCreateOrConnectWithoutTenantInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutTenantInput | SubscriptionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: SubscriptionCreateManyTenantInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutTenantInput | SubscriptionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutTenantInput | SubscriptionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type GlobalUserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<GlobalUserCreateWithoutTenantInput, GlobalUserUncheckedCreateWithoutTenantInput> | GlobalUserCreateWithoutTenantInput[] | GlobalUserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: GlobalUserCreateOrConnectWithoutTenantInput | GlobalUserCreateOrConnectWithoutTenantInput[]
    upsert?: GlobalUserUpsertWithWhereUniqueWithoutTenantInput | GlobalUserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: GlobalUserCreateManyTenantInputEnvelope
    set?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
    disconnect?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
    delete?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
    connect?: GlobalUserWhereUniqueInput | GlobalUserWhereUniqueInput[]
    update?: GlobalUserUpdateWithWhereUniqueWithoutTenantInput | GlobalUserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: GlobalUserUpdateManyWithWhereWithoutTenantInput | GlobalUserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: GlobalUserScalarWhereInput | GlobalUserScalarWhereInput[]
  }

  export type UserInvitationUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UserInvitationCreateWithoutTenantInput, UserInvitationUncheckedCreateWithoutTenantInput> | UserInvitationCreateWithoutTenantInput[] | UserInvitationUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UserInvitationCreateOrConnectWithoutTenantInput | UserInvitationCreateOrConnectWithoutTenantInput[]
    upsert?: UserInvitationUpsertWithWhereUniqueWithoutTenantInput | UserInvitationUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UserInvitationCreateManyTenantInputEnvelope
    set?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
    disconnect?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
    delete?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
    connect?: UserInvitationWhereUniqueInput | UserInvitationWhereUniqueInput[]
    update?: UserInvitationUpdateWithWhereUniqueWithoutTenantInput | UserInvitationUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UserInvitationUpdateManyWithWhereWithoutTenantInput | UserInvitationUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UserInvitationScalarWhereInput | UserInvitationScalarWhereInput[]
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput> | BillingInvoiceCreateWithoutTenantInput[] | BillingInvoiceUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutTenantInput | BillingInvoiceCreateOrConnectWithoutTenantInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput | BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: BillingInvoiceCreateManyTenantInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput | BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutTenantInput | BillingInvoiceUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type SubscriptionCreateNestedManyWithoutPlanInput = {
    create?: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput> | SubscriptionCreateWithoutPlanInput[] | SubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: SubscriptionCreateManyPlanInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type SubscriptionUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput> | SubscriptionCreateWithoutPlanInput[] | SubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[]
    createMany?: SubscriptionCreateManyPlanInputEnvelope
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SubscriptionUpdateManyWithoutPlanNestedInput = {
    create?: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput> | SubscriptionCreateWithoutPlanInput[] | SubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutPlanInput | SubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: SubscriptionCreateManyPlanInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutPlanInput | SubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutPlanInput | SubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type SubscriptionUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput> | SubscriptionCreateWithoutPlanInput[] | SubscriptionUncheckedCreateWithoutPlanInput[]
    connectOrCreate?: SubscriptionCreateOrConnectWithoutPlanInput | SubscriptionCreateOrConnectWithoutPlanInput[]
    upsert?: SubscriptionUpsertWithWhereUniqueWithoutPlanInput | SubscriptionUpsertWithWhereUniqueWithoutPlanInput[]
    createMany?: SubscriptionCreateManyPlanInputEnvelope
    set?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    disconnect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    delete?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    connect?: SubscriptionWhereUniqueInput | SubscriptionWhereUniqueInput[]
    update?: SubscriptionUpdateWithWhereUniqueWithoutPlanInput | SubscriptionUpdateWithWhereUniqueWithoutPlanInput[]
    updateMany?: SubscriptionUpdateManyWithWhereWithoutPlanInput | SubscriptionUpdateManyWithWhereWithoutPlanInput[]
    deleteMany?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionsInput
    connect?: TenantWhereUniqueInput
  }

  export type PlanCreateNestedOneWithoutSubscriptionsInput = {
    create?: XOR<PlanCreateWithoutSubscriptionsInput, PlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutSubscriptionsInput
    connect?: PlanWhereUniqueInput
  }

  export type BillingInvoiceCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput> | BillingInvoiceCreateWithoutSubscriptionInput[] | BillingInvoiceUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutSubscriptionInput | BillingInvoiceCreateOrConnectWithoutSubscriptionInput[]
    createMany?: BillingInvoiceCreateManySubscriptionInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput = {
    create?: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput> | BillingInvoiceCreateWithoutSubscriptionInput[] | BillingInvoiceUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutSubscriptionInput | BillingInvoiceCreateOrConnectWithoutSubscriptionInput[]
    createMany?: BillingInvoiceCreateManySubscriptionInputEnvelope
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TenantUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSubscriptionsInput
    upsert?: TenantUpsertWithoutSubscriptionsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSubscriptionsInput, TenantUpdateWithoutSubscriptionsInput>, TenantUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type PlanUpdateOneRequiredWithoutSubscriptionsNestedInput = {
    create?: XOR<PlanCreateWithoutSubscriptionsInput, PlanUncheckedCreateWithoutSubscriptionsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutSubscriptionsInput
    upsert?: PlanUpsertWithoutSubscriptionsInput
    connect?: PlanWhereUniqueInput
    update?: XOR<XOR<PlanUpdateToOneWithWhereWithoutSubscriptionsInput, PlanUpdateWithoutSubscriptionsInput>, PlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type BillingInvoiceUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput> | BillingInvoiceCreateWithoutSubscriptionInput[] | BillingInvoiceUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutSubscriptionInput | BillingInvoiceCreateOrConnectWithoutSubscriptionInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput | BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: BillingInvoiceCreateManySubscriptionInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput | BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput | BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput = {
    create?: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput> | BillingInvoiceCreateWithoutSubscriptionInput[] | BillingInvoiceUncheckedCreateWithoutSubscriptionInput[]
    connectOrCreate?: BillingInvoiceCreateOrConnectWithoutSubscriptionInput | BillingInvoiceCreateOrConnectWithoutSubscriptionInput[]
    upsert?: BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput | BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput[]
    createMany?: BillingInvoiceCreateManySubscriptionInputEnvelope
    set?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    disconnect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    delete?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    connect?: BillingInvoiceWhereUniqueInput | BillingInvoiceWhereUniqueInput[]
    update?: BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput | BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput[]
    updateMany?: BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput | BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput[]
    deleteMany?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutGlobalUsersInput = {
    create?: XOR<TenantCreateWithoutGlobalUsersInput, TenantUncheckedCreateWithoutGlobalUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutGlobalUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TenantUpdateOneRequiredWithoutGlobalUsersNestedInput = {
    create?: XOR<TenantCreateWithoutGlobalUsersInput, TenantUncheckedCreateWithoutGlobalUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutGlobalUsersInput
    upsert?: TenantUpsertWithoutGlobalUsersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutGlobalUsersInput, TenantUpdateWithoutGlobalUsersInput>, TenantUncheckedUpdateWithoutGlobalUsersInput>
  }

  export type TenantCreateNestedOneWithoutUserInvitationsInput = {
    create?: XOR<TenantCreateWithoutUserInvitationsInput, TenantUncheckedCreateWithoutUserInvitationsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUserInvitationsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutUserInvitationsNestedInput = {
    create?: XOR<TenantCreateWithoutUserInvitationsInput, TenantUncheckedCreateWithoutUserInvitationsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUserInvitationsInput
    upsert?: TenantUpsertWithoutUserInvitationsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUserInvitationsInput, TenantUpdateWithoutUserInvitationsInput>, TenantUncheckedUpdateWithoutUserInvitationsInput>
  }

  export type TenantCreateNestedOneWithoutBillingInvoicesInput = {
    create?: XOR<TenantCreateWithoutBillingInvoicesInput, TenantUncheckedCreateWithoutBillingInvoicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBillingInvoicesInput
    connect?: TenantWhereUniqueInput
  }

  export type SubscriptionCreateNestedOneWithoutBillingInvoicesInput = {
    create?: XOR<SubscriptionCreateWithoutBillingInvoicesInput, SubscriptionUncheckedCreateWithoutBillingInvoicesInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutBillingInvoicesInput
    connect?: SubscriptionWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutBillingInvoicesNestedInput = {
    create?: XOR<TenantCreateWithoutBillingInvoicesInput, TenantUncheckedCreateWithoutBillingInvoicesInput>
    connectOrCreate?: TenantCreateOrConnectWithoutBillingInvoicesInput
    upsert?: TenantUpsertWithoutBillingInvoicesInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutBillingInvoicesInput, TenantUpdateWithoutBillingInvoicesInput>, TenantUncheckedUpdateWithoutBillingInvoicesInput>
  }

  export type SubscriptionUpdateOneWithoutBillingInvoicesNestedInput = {
    create?: XOR<SubscriptionCreateWithoutBillingInvoicesInput, SubscriptionUncheckedCreateWithoutBillingInvoicesInput>
    connectOrCreate?: SubscriptionCreateOrConnectWithoutBillingInvoicesInput
    upsert?: SubscriptionUpsertWithoutBillingInvoicesInput
    disconnect?: SubscriptionWhereInput | boolean
    delete?: SubscriptionWhereInput | boolean
    connect?: SubscriptionWhereUniqueInput
    update?: XOR<XOR<SubscriptionUpdateToOneWithWhereWithoutBillingInvoicesInput, SubscriptionUpdateWithoutBillingInvoicesInput>, SubscriptionUncheckedUpdateWithoutBillingInvoicesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type SubscriptionCreateWithoutTenantInput = {
    id?: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
    plan: PlanCreateNestedOneWithoutSubscriptionsInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateWithoutTenantInput = {
    id?: string
    planId: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionCreateOrConnectWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionCreateManyTenantInputEnvelope = {
    data: SubscriptionCreateManyTenantInput | SubscriptionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type GlobalUserCreateWithoutTenantInput = {
    id?: string
    fullName: string
    email: string
    passwordHash: string
    role: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GlobalUserUncheckedCreateWithoutTenantInput = {
    id?: string
    fullName: string
    email: string
    passwordHash: string
    role: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
  }

  export type GlobalUserCreateOrConnectWithoutTenantInput = {
    where: GlobalUserWhereUniqueInput
    create: XOR<GlobalUserCreateWithoutTenantInput, GlobalUserUncheckedCreateWithoutTenantInput>
  }

  export type GlobalUserCreateManyTenantInputEnvelope = {
    data: GlobalUserCreateManyTenantInput | GlobalUserCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UserInvitationCreateWithoutTenantInput = {
    id?: string
    email: string
    role: string
    inviteToken: string
    expiresAt: Date | string
    accepted?: boolean
  }

  export type UserInvitationUncheckedCreateWithoutTenantInput = {
    id?: string
    email: string
    role: string
    inviteToken: string
    expiresAt: Date | string
    accepted?: boolean
  }

  export type UserInvitationCreateOrConnectWithoutTenantInput = {
    where: UserInvitationWhereUniqueInput
    create: XOR<UserInvitationCreateWithoutTenantInput, UserInvitationUncheckedCreateWithoutTenantInput>
  }

  export type UserInvitationCreateManyTenantInputEnvelope = {
    data: UserInvitationCreateManyTenantInput | UserInvitationCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type BillingInvoiceCreateWithoutTenantInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
    subscription?: SubscriptionCreateNestedOneWithoutBillingInvoicesInput
  }

  export type BillingInvoiceUncheckedCreateWithoutTenantInput = {
    id?: string
    subscriptionId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
  }

  export type BillingInvoiceCreateOrConnectWithoutTenantInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput>
  }

  export type BillingInvoiceCreateManyTenantInputEnvelope = {
    data: BillingInvoiceCreateManyTenantInput | BillingInvoiceCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutTenantInput, SubscriptionUncheckedUpdateWithoutTenantInput>
    create: XOR<SubscriptionCreateWithoutTenantInput, SubscriptionUncheckedCreateWithoutTenantInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutTenantInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutTenantInput, SubscriptionUncheckedUpdateWithoutTenantInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutTenantInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutTenantInput>
  }

  export type SubscriptionScalarWhereInput = {
    AND?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    OR?: SubscriptionScalarWhereInput[]
    NOT?: SubscriptionScalarWhereInput | SubscriptionScalarWhereInput[]
    id?: StringFilter<"Subscription"> | string
    tenantId?: StringFilter<"Subscription"> | string
    planId?: StringFilter<"Subscription"> | string
    billingCycle?: StringFilter<"Subscription"> | string
    currentPeriodStart?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    currentPeriodEnd?: DateTimeNullableFilter<"Subscription"> | Date | string | null
    paymentProvider?: StringNullableFilter<"Subscription"> | string | null
    providerSubscriptionId?: StringNullableFilter<"Subscription"> | string | null
    status?: StringFilter<"Subscription"> | string
  }

  export type GlobalUserUpsertWithWhereUniqueWithoutTenantInput = {
    where: GlobalUserWhereUniqueInput
    update: XOR<GlobalUserUpdateWithoutTenantInput, GlobalUserUncheckedUpdateWithoutTenantInput>
    create: XOR<GlobalUserCreateWithoutTenantInput, GlobalUserUncheckedCreateWithoutTenantInput>
  }

  export type GlobalUserUpdateWithWhereUniqueWithoutTenantInput = {
    where: GlobalUserWhereUniqueInput
    data: XOR<GlobalUserUpdateWithoutTenantInput, GlobalUserUncheckedUpdateWithoutTenantInput>
  }

  export type GlobalUserUpdateManyWithWhereWithoutTenantInput = {
    where: GlobalUserScalarWhereInput
    data: XOR<GlobalUserUpdateManyMutationInput, GlobalUserUncheckedUpdateManyWithoutTenantInput>
  }

  export type GlobalUserScalarWhereInput = {
    AND?: GlobalUserScalarWhereInput | GlobalUserScalarWhereInput[]
    OR?: GlobalUserScalarWhereInput[]
    NOT?: GlobalUserScalarWhereInput | GlobalUserScalarWhereInput[]
    id?: StringFilter<"GlobalUser"> | string
    tenantId?: StringFilter<"GlobalUser"> | string
    fullName?: StringFilter<"GlobalUser"> | string
    email?: StringFilter<"GlobalUser"> | string
    passwordHash?: StringFilter<"GlobalUser"> | string
    role?: StringFilter<"GlobalUser"> | string
    isActive?: BoolFilter<"GlobalUser"> | boolean
    lastLoginAt?: DateTimeNullableFilter<"GlobalUser"> | Date | string | null
    createdAt?: DateTimeFilter<"GlobalUser"> | Date | string
  }

  export type UserInvitationUpsertWithWhereUniqueWithoutTenantInput = {
    where: UserInvitationWhereUniqueInput
    update: XOR<UserInvitationUpdateWithoutTenantInput, UserInvitationUncheckedUpdateWithoutTenantInput>
    create: XOR<UserInvitationCreateWithoutTenantInput, UserInvitationUncheckedCreateWithoutTenantInput>
  }

  export type UserInvitationUpdateWithWhereUniqueWithoutTenantInput = {
    where: UserInvitationWhereUniqueInput
    data: XOR<UserInvitationUpdateWithoutTenantInput, UserInvitationUncheckedUpdateWithoutTenantInput>
  }

  export type UserInvitationUpdateManyWithWhereWithoutTenantInput = {
    where: UserInvitationScalarWhereInput
    data: XOR<UserInvitationUpdateManyMutationInput, UserInvitationUncheckedUpdateManyWithoutTenantInput>
  }

  export type UserInvitationScalarWhereInput = {
    AND?: UserInvitationScalarWhereInput | UserInvitationScalarWhereInput[]
    OR?: UserInvitationScalarWhereInput[]
    NOT?: UserInvitationScalarWhereInput | UserInvitationScalarWhereInput[]
    id?: StringFilter<"UserInvitation"> | string
    tenantId?: StringFilter<"UserInvitation"> | string
    email?: StringFilter<"UserInvitation"> | string
    role?: StringFilter<"UserInvitation"> | string
    inviteToken?: StringFilter<"UserInvitation"> | string
    expiresAt?: DateTimeFilter<"UserInvitation"> | Date | string
    accepted?: BoolFilter<"UserInvitation"> | boolean
  }

  export type BillingInvoiceUpsertWithWhereUniqueWithoutTenantInput = {
    where: BillingInvoiceWhereUniqueInput
    update: XOR<BillingInvoiceUpdateWithoutTenantInput, BillingInvoiceUncheckedUpdateWithoutTenantInput>
    create: XOR<BillingInvoiceCreateWithoutTenantInput, BillingInvoiceUncheckedCreateWithoutTenantInput>
  }

  export type BillingInvoiceUpdateWithWhereUniqueWithoutTenantInput = {
    where: BillingInvoiceWhereUniqueInput
    data: XOR<BillingInvoiceUpdateWithoutTenantInput, BillingInvoiceUncheckedUpdateWithoutTenantInput>
  }

  export type BillingInvoiceUpdateManyWithWhereWithoutTenantInput = {
    where: BillingInvoiceScalarWhereInput
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyWithoutTenantInput>
  }

  export type BillingInvoiceScalarWhereInput = {
    AND?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
    OR?: BillingInvoiceScalarWhereInput[]
    NOT?: BillingInvoiceScalarWhereInput | BillingInvoiceScalarWhereInput[]
    id?: StringFilter<"BillingInvoice"> | string
    tenantId?: StringFilter<"BillingInvoice"> | string
    subscriptionId?: StringNullableFilter<"BillingInvoice"> | string | null
    amount?: DecimalFilter<"BillingInvoice"> | Decimal | DecimalJsLike | number | string
    currency?: StringFilter<"BillingInvoice"> | string
    status?: StringNullableFilter<"BillingInvoice"> | string | null
    invoiceDate?: DateTimeFilter<"BillingInvoice"> | Date | string
    providerInvoiceId?: StringNullableFilter<"BillingInvoice"> | string | null
  }

  export type SubscriptionCreateWithoutPlanInput = {
    id?: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionUncheckedCreateWithoutPlanInput = {
    id?: string
    tenantId: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutSubscriptionInput
  }

  export type SubscriptionCreateOrConnectWithoutPlanInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type SubscriptionCreateManyPlanInputEnvelope = {
    data: SubscriptionCreateManyPlanInput | SubscriptionCreateManyPlanInput[]
    skipDuplicates?: boolean
  }

  export type SubscriptionUpsertWithWhereUniqueWithoutPlanInput = {
    where: SubscriptionWhereUniqueInput
    update: XOR<SubscriptionUpdateWithoutPlanInput, SubscriptionUncheckedUpdateWithoutPlanInput>
    create: XOR<SubscriptionCreateWithoutPlanInput, SubscriptionUncheckedCreateWithoutPlanInput>
  }

  export type SubscriptionUpdateWithWhereUniqueWithoutPlanInput = {
    where: SubscriptionWhereUniqueInput
    data: XOR<SubscriptionUpdateWithoutPlanInput, SubscriptionUncheckedUpdateWithoutPlanInput>
  }

  export type SubscriptionUpdateManyWithWhereWithoutPlanInput = {
    where: SubscriptionScalarWhereInput
    data: XOR<SubscriptionUpdateManyMutationInput, SubscriptionUncheckedUpdateManyWithoutPlanInput>
  }

  export type TenantCreateWithoutSubscriptionsInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    globalUsers?: GlobalUserCreateNestedManyWithoutTenantInput
    userInvitations?: UserInvitationCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    globalUsers?: GlobalUserUncheckedCreateNestedManyWithoutTenantInput
    userInvitations?: UserInvitationUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSubscriptionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
  }

  export type PlanCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    priceMonthly: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string | null
    maxUsers?: number
    maxProjects?: number
    features?: NullableJsonNullValueInput | InputJsonValue
  }

  export type PlanUncheckedCreateWithoutSubscriptionsInput = {
    id?: string
    name: string
    priceMonthly: Decimal | DecimalJsLike | number | string
    priceYearly?: Decimal | DecimalJsLike | number | string | null
    maxUsers?: number
    maxProjects?: number
    features?: NullableJsonNullValueInput | InputJsonValue
  }

  export type PlanCreateOrConnectWithoutSubscriptionsInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutSubscriptionsInput, PlanUncheckedCreateWithoutSubscriptionsInput>
  }

  export type BillingInvoiceCreateWithoutSubscriptionInput = {
    id?: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
    tenant: TenantCreateNestedOneWithoutBillingInvoicesInput
  }

  export type BillingInvoiceUncheckedCreateWithoutSubscriptionInput = {
    id?: string
    tenantId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
  }

  export type BillingInvoiceCreateOrConnectWithoutSubscriptionInput = {
    where: BillingInvoiceWhereUniqueInput
    create: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput>
  }

  export type BillingInvoiceCreateManySubscriptionInputEnvelope = {
    data: BillingInvoiceCreateManySubscriptionInput | BillingInvoiceCreateManySubscriptionInput[]
    skipDuplicates?: boolean
  }

  export type TenantUpsertWithoutSubscriptionsInput = {
    update: XOR<TenantUpdateWithoutSubscriptionsInput, TenantUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<TenantCreateWithoutSubscriptionsInput, TenantUncheckedCreateWithoutSubscriptionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSubscriptionsInput, TenantUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type TenantUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    globalUsers?: GlobalUserUpdateManyWithoutTenantNestedInput
    userInvitations?: UserInvitationUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    globalUsers?: GlobalUserUncheckedUpdateManyWithoutTenantNestedInput
    userInvitations?: UserInvitationUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type PlanUpsertWithoutSubscriptionsInput = {
    update: XOR<PlanUpdateWithoutSubscriptionsInput, PlanUncheckedUpdateWithoutSubscriptionsInput>
    create: XOR<PlanCreateWithoutSubscriptionsInput, PlanUncheckedCreateWithoutSubscriptionsInput>
    where?: PlanWhereInput
  }

  export type PlanUpdateToOneWithWhereWithoutSubscriptionsInput = {
    where?: PlanWhereInput
    data: XOR<PlanUpdateWithoutSubscriptionsInput, PlanUncheckedUpdateWithoutSubscriptionsInput>
  }

  export type PlanUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxProjects?: IntFieldUpdateOperationsInput | number
    features?: NullableJsonNullValueInput | InputJsonValue
  }

  export type PlanUncheckedUpdateWithoutSubscriptionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    priceMonthly?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    priceYearly?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxProjects?: IntFieldUpdateOperationsInput | number
    features?: NullableJsonNullValueInput | InputJsonValue
  }

  export type BillingInvoiceUpsertWithWhereUniqueWithoutSubscriptionInput = {
    where: BillingInvoiceWhereUniqueInput
    update: XOR<BillingInvoiceUpdateWithoutSubscriptionInput, BillingInvoiceUncheckedUpdateWithoutSubscriptionInput>
    create: XOR<BillingInvoiceCreateWithoutSubscriptionInput, BillingInvoiceUncheckedCreateWithoutSubscriptionInput>
  }

  export type BillingInvoiceUpdateWithWhereUniqueWithoutSubscriptionInput = {
    where: BillingInvoiceWhereUniqueInput
    data: XOR<BillingInvoiceUpdateWithoutSubscriptionInput, BillingInvoiceUncheckedUpdateWithoutSubscriptionInput>
  }

  export type BillingInvoiceUpdateManyWithWhereWithoutSubscriptionInput = {
    where: BillingInvoiceScalarWhereInput
    data: XOR<BillingInvoiceUpdateManyMutationInput, BillingInvoiceUncheckedUpdateManyWithoutSubscriptionInput>
  }

  export type TenantCreateWithoutGlobalUsersInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    userInvitations?: UserInvitationCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutGlobalUsersInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    userInvitations?: UserInvitationUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutGlobalUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutGlobalUsersInput, TenantUncheckedCreateWithoutGlobalUsersInput>
  }

  export type TenantUpsertWithoutGlobalUsersInput = {
    update: XOR<TenantUpdateWithoutGlobalUsersInput, TenantUncheckedUpdateWithoutGlobalUsersInput>
    create: XOR<TenantCreateWithoutGlobalUsersInput, TenantUncheckedCreateWithoutGlobalUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutGlobalUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutGlobalUsersInput, TenantUncheckedUpdateWithoutGlobalUsersInput>
  }

  export type TenantUpdateWithoutGlobalUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    userInvitations?: UserInvitationUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutGlobalUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    userInvitations?: UserInvitationUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutUserInvitationsInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    globalUsers?: GlobalUserCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUserInvitationsInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    globalUsers?: GlobalUserUncheckedCreateNestedManyWithoutTenantInput
    billingInvoices?: BillingInvoiceUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUserInvitationsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUserInvitationsInput, TenantUncheckedCreateWithoutUserInvitationsInput>
  }

  export type TenantUpsertWithoutUserInvitationsInput = {
    update: XOR<TenantUpdateWithoutUserInvitationsInput, TenantUncheckedUpdateWithoutUserInvitationsInput>
    create: XOR<TenantCreateWithoutUserInvitationsInput, TenantUncheckedCreateWithoutUserInvitationsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUserInvitationsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUserInvitationsInput, TenantUncheckedUpdateWithoutUserInvitationsInput>
  }

  export type TenantUpdateWithoutUserInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    globalUsers?: GlobalUserUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUserInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    globalUsers?: GlobalUserUncheckedUpdateManyWithoutTenantNestedInput
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutBillingInvoicesInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    subscriptions?: SubscriptionCreateNestedManyWithoutTenantInput
    globalUsers?: GlobalUserCreateNestedManyWithoutTenantInput
    userInvitations?: UserInvitationCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutBillingInvoicesInput = {
    id?: string
    companyName: string
    dbHost: string
    dbName: string
    dbUser: string
    dbPasswordEncrypted: string
    status?: string
    createdAt?: Date | string
    subscriptions?: SubscriptionUncheckedCreateNestedManyWithoutTenantInput
    globalUsers?: GlobalUserUncheckedCreateNestedManyWithoutTenantInput
    userInvitations?: UserInvitationUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutBillingInvoicesInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutBillingInvoicesInput, TenantUncheckedCreateWithoutBillingInvoicesInput>
  }

  export type SubscriptionCreateWithoutBillingInvoicesInput = {
    id?: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
    tenant: TenantCreateNestedOneWithoutSubscriptionsInput
    plan: PlanCreateNestedOneWithoutSubscriptionsInput
  }

  export type SubscriptionUncheckedCreateWithoutBillingInvoicesInput = {
    id?: string
    tenantId: string
    planId: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
  }

  export type SubscriptionCreateOrConnectWithoutBillingInvoicesInput = {
    where: SubscriptionWhereUniqueInput
    create: XOR<SubscriptionCreateWithoutBillingInvoicesInput, SubscriptionUncheckedCreateWithoutBillingInvoicesInput>
  }

  export type TenantUpsertWithoutBillingInvoicesInput = {
    update: XOR<TenantUpdateWithoutBillingInvoicesInput, TenantUncheckedUpdateWithoutBillingInvoicesInput>
    create: XOR<TenantCreateWithoutBillingInvoicesInput, TenantUncheckedCreateWithoutBillingInvoicesInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutBillingInvoicesInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutBillingInvoicesInput, TenantUncheckedUpdateWithoutBillingInvoicesInput>
  }

  export type TenantUpdateWithoutBillingInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUpdateManyWithoutTenantNestedInput
    globalUsers?: GlobalUserUpdateManyWithoutTenantNestedInput
    userInvitations?: UserInvitationUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutBillingInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    companyName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbName?: StringFieldUpdateOperationsInput | string
    dbUser?: StringFieldUpdateOperationsInput | string
    dbPasswordEncrypted?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subscriptions?: SubscriptionUncheckedUpdateManyWithoutTenantNestedInput
    globalUsers?: GlobalUserUncheckedUpdateManyWithoutTenantNestedInput
    userInvitations?: UserInvitationUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type SubscriptionUpsertWithoutBillingInvoicesInput = {
    update: XOR<SubscriptionUpdateWithoutBillingInvoicesInput, SubscriptionUncheckedUpdateWithoutBillingInvoicesInput>
    create: XOR<SubscriptionCreateWithoutBillingInvoicesInput, SubscriptionUncheckedCreateWithoutBillingInvoicesInput>
    where?: SubscriptionWhereInput
  }

  export type SubscriptionUpdateToOneWithWhereWithoutBillingInvoicesInput = {
    where?: SubscriptionWhereInput
    data: XOR<SubscriptionUpdateWithoutBillingInvoicesInput, SubscriptionUncheckedUpdateWithoutBillingInvoicesInput>
  }

  export type SubscriptionUpdateWithoutBillingInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsNestedInput
    plan?: PlanUpdateOneRequiredWithoutSubscriptionsNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutBillingInvoicesInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type SubscriptionCreateManyTenantInput = {
    id?: string
    planId: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
  }

  export type GlobalUserCreateManyTenantInput = {
    id?: string
    fullName: string
    email: string
    passwordHash: string
    role: string
    isActive?: boolean
    lastLoginAt?: Date | string | null
    createdAt?: Date | string
  }

  export type UserInvitationCreateManyTenantInput = {
    id?: string
    email: string
    role: string
    inviteToken: string
    expiresAt: Date | string
    accepted?: boolean
  }

  export type BillingInvoiceCreateManyTenantInput = {
    id?: string
    subscriptionId?: string | null
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
  }

  export type SubscriptionUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    plan?: PlanUpdateOneRequiredWithoutSubscriptionsNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type GlobalUserUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalUserUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GlobalUserUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserInvitationUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    inviteToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserInvitationUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    inviteToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserInvitationUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    inviteToken?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BillingInvoiceUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    subscription?: SubscriptionUpdateOneWithoutBillingInvoicesNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    subscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SubscriptionCreateManyPlanInput = {
    id?: string
    tenantId: string
    billingCycle: string
    currentPeriodStart?: Date | string | null
    currentPeriodEnd?: Date | string | null
    paymentProvider?: string | null
    providerSubscriptionId?: string | null
    status?: string
  }

  export type SubscriptionUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    tenant?: TenantUpdateOneRequiredWithoutSubscriptionsNestedInput
    billingInvoices?: BillingInvoiceUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    billingInvoices?: BillingInvoiceUncheckedUpdateManyWithoutSubscriptionNestedInput
  }

  export type SubscriptionUncheckedUpdateManyWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    billingCycle?: StringFieldUpdateOperationsInput | string
    currentPeriodStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentPeriodEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentProvider?: NullableStringFieldUpdateOperationsInput | string | null
    providerSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
  }

  export type BillingInvoiceCreateManySubscriptionInput = {
    id?: string
    tenantId: string
    amount: Decimal | DecimalJsLike | number | string
    currency?: string
    status?: string | null
    invoiceDate: Date | string
    providerInvoiceId?: string | null
  }

  export type BillingInvoiceUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
    tenant?: TenantUpdateOneRequiredWithoutBillingInvoicesNestedInput
  }

  export type BillingInvoiceUncheckedUpdateWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingInvoiceUncheckedUpdateManyWithoutSubscriptionInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currency?: StringFieldUpdateOperationsInput | string
    status?: NullableStringFieldUpdateOperationsInput | string | null
    invoiceDate?: DateTimeFieldUpdateOperationsInput | Date | string
    providerInvoiceId?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}