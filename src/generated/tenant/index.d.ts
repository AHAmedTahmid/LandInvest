
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
 * Model Partner
 * 
 */
export type Partner = $Result.DefaultSelection<Prisma.$PartnerPayload>
/**
 * Model BankAccount
 * 
 */
export type BankAccount = $Result.DefaultSelection<Prisma.$BankAccountPayload>
/**
 * Model LandProject
 * 
 */
export type LandProject = $Result.DefaultSelection<Prisma.$LandProjectPayload>
/**
 * Model ProjectPartner
 * 
 */
export type ProjectPartner = $Result.DefaultSelection<Prisma.$ProjectPartnerPayload>
/**
 * Model TreasuryLedger
 * 
 */
export type TreasuryLedger = $Result.DefaultSelection<Prisma.$TreasuryLedgerPayload>
/**
 * Model PartnerTransaction
 * 
 */
export type PartnerTransaction = $Result.DefaultSelection<Prisma.$PartnerTransactionPayload>
/**
 * Model ProjectExpense
 * 
 */
export type ProjectExpense = $Result.DefaultSelection<Prisma.$ProjectExpensePayload>
/**
 * Model ProjectPlot
 * 
 */
export type ProjectPlot = $Result.DefaultSelection<Prisma.$ProjectPlotPayload>
/**
 * Model LandSale
 * 
 */
export type LandSale = $Result.DefaultSelection<Prisma.$LandSalePayload>
/**
 * Model InstallmentSchedule
 * 
 */
export type InstallmentSchedule = $Result.DefaultSelection<Prisma.$InstallmentSchedulePayload>
/**
 * Model CustomerPayment
 * 
 */
export type CustomerPayment = $Result.DefaultSelection<Prisma.$CustomerPaymentPayload>
/**
 * Model ProfitDistribution
 * 
 */
export type ProfitDistribution = $Result.DefaultSelection<Prisma.$ProfitDistributionPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Partners
 * const partners = await prisma.partner.findMany()
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
   * // Fetch zero or more Partners
   * const partners = await prisma.partner.findMany()
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
   * `prisma.partner`: Exposes CRUD operations for the **Partner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Partners
    * const partners = await prisma.partner.findMany()
    * ```
    */
  get partner(): Prisma.PartnerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bankAccount`: Exposes CRUD operations for the **BankAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BankAccounts
    * const bankAccounts = await prisma.bankAccount.findMany()
    * ```
    */
  get bankAccount(): Prisma.BankAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.landProject`: Exposes CRUD operations for the **LandProject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LandProjects
    * const landProjects = await prisma.landProject.findMany()
    * ```
    */
  get landProject(): Prisma.LandProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectPartner`: Exposes CRUD operations for the **ProjectPartner** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectPartners
    * const projectPartners = await prisma.projectPartner.findMany()
    * ```
    */
  get projectPartner(): Prisma.ProjectPartnerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.treasuryLedger`: Exposes CRUD operations for the **TreasuryLedger** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TreasuryLedgers
    * const treasuryLedgers = await prisma.treasuryLedger.findMany()
    * ```
    */
  get treasuryLedger(): Prisma.TreasuryLedgerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.partnerTransaction`: Exposes CRUD operations for the **PartnerTransaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PartnerTransactions
    * const partnerTransactions = await prisma.partnerTransaction.findMany()
    * ```
    */
  get partnerTransaction(): Prisma.PartnerTransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectExpense`: Exposes CRUD operations for the **ProjectExpense** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectExpenses
    * const projectExpenses = await prisma.projectExpense.findMany()
    * ```
    */
  get projectExpense(): Prisma.ProjectExpenseDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.projectPlot`: Exposes CRUD operations for the **ProjectPlot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProjectPlots
    * const projectPlots = await prisma.projectPlot.findMany()
    * ```
    */
  get projectPlot(): Prisma.ProjectPlotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.landSale`: Exposes CRUD operations for the **LandSale** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LandSales
    * const landSales = await prisma.landSale.findMany()
    * ```
    */
  get landSale(): Prisma.LandSaleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.installmentSchedule`: Exposes CRUD operations for the **InstallmentSchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InstallmentSchedules
    * const installmentSchedules = await prisma.installmentSchedule.findMany()
    * ```
    */
  get installmentSchedule(): Prisma.InstallmentScheduleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customerPayment`: Exposes CRUD operations for the **CustomerPayment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomerPayments
    * const customerPayments = await prisma.customerPayment.findMany()
    * ```
    */
  get customerPayment(): Prisma.CustomerPaymentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profitDistribution`: Exposes CRUD operations for the **ProfitDistribution** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProfitDistributions
    * const profitDistributions = await prisma.profitDistribution.findMany()
    * ```
    */
  get profitDistribution(): Prisma.ProfitDistributionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
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
    Partner: 'Partner',
    BankAccount: 'BankAccount',
    LandProject: 'LandProject',
    ProjectPartner: 'ProjectPartner',
    TreasuryLedger: 'TreasuryLedger',
    PartnerTransaction: 'PartnerTransaction',
    ProjectExpense: 'ProjectExpense',
    ProjectPlot: 'ProjectPlot',
    LandSale: 'LandSale',
    InstallmentSchedule: 'InstallmentSchedule',
    CustomerPayment: 'CustomerPayment',
    ProfitDistribution: 'ProfitDistribution',
    AuditLog: 'AuditLog'
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
      modelProps: "partner" | "bankAccount" | "landProject" | "projectPartner" | "treasuryLedger" | "partnerTransaction" | "projectExpense" | "projectPlot" | "landSale" | "installmentSchedule" | "customerPayment" | "profitDistribution" | "auditLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Partner: {
        payload: Prisma.$PartnerPayload<ExtArgs>
        fields: Prisma.PartnerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PartnerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PartnerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          findFirst: {
            args: Prisma.PartnerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PartnerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          findMany: {
            args: Prisma.PartnerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>[]
          }
          create: {
            args: Prisma.PartnerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          createMany: {
            args: Prisma.PartnerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PartnerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          update: {
            args: Prisma.PartnerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          deleteMany: {
            args: Prisma.PartnerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PartnerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PartnerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerPayload>
          }
          aggregate: {
            args: Prisma.PartnerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePartner>
          }
          groupBy: {
            args: Prisma.PartnerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PartnerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PartnerCountArgs<ExtArgs>
            result: $Utils.Optional<PartnerCountAggregateOutputType> | number
          }
        }
      }
      BankAccount: {
        payload: Prisma.$BankAccountPayload<ExtArgs>
        fields: Prisma.BankAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BankAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BankAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload>
          }
          findFirst: {
            args: Prisma.BankAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BankAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload>
          }
          findMany: {
            args: Prisma.BankAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload>[]
          }
          create: {
            args: Prisma.BankAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload>
          }
          createMany: {
            args: Prisma.BankAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BankAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload>
          }
          update: {
            args: Prisma.BankAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload>
          }
          deleteMany: {
            args: Prisma.BankAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BankAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BankAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BankAccountPayload>
          }
          aggregate: {
            args: Prisma.BankAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBankAccount>
          }
          groupBy: {
            args: Prisma.BankAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<BankAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.BankAccountCountArgs<ExtArgs>
            result: $Utils.Optional<BankAccountCountAggregateOutputType> | number
          }
        }
      }
      LandProject: {
        payload: Prisma.$LandProjectPayload<ExtArgs>
        fields: Prisma.LandProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LandProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LandProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload>
          }
          findFirst: {
            args: Prisma.LandProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LandProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload>
          }
          findMany: {
            args: Prisma.LandProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload>[]
          }
          create: {
            args: Prisma.LandProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload>
          }
          createMany: {
            args: Prisma.LandProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LandProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload>
          }
          update: {
            args: Prisma.LandProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload>
          }
          deleteMany: {
            args: Prisma.LandProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LandProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LandProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandProjectPayload>
          }
          aggregate: {
            args: Prisma.LandProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLandProject>
          }
          groupBy: {
            args: Prisma.LandProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<LandProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.LandProjectCountArgs<ExtArgs>
            result: $Utils.Optional<LandProjectCountAggregateOutputType> | number
          }
        }
      }
      ProjectPartner: {
        payload: Prisma.$ProjectPartnerPayload<ExtArgs>
        fields: Prisma.ProjectPartnerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectPartnerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectPartnerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload>
          }
          findFirst: {
            args: Prisma.ProjectPartnerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectPartnerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload>
          }
          findMany: {
            args: Prisma.ProjectPartnerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload>[]
          }
          create: {
            args: Prisma.ProjectPartnerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload>
          }
          createMany: {
            args: Prisma.ProjectPartnerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProjectPartnerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload>
          }
          update: {
            args: Prisma.ProjectPartnerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload>
          }
          deleteMany: {
            args: Prisma.ProjectPartnerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectPartnerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectPartnerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPartnerPayload>
          }
          aggregate: {
            args: Prisma.ProjectPartnerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectPartner>
          }
          groupBy: {
            args: Prisma.ProjectPartnerGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectPartnerGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectPartnerCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectPartnerCountAggregateOutputType> | number
          }
        }
      }
      TreasuryLedger: {
        payload: Prisma.$TreasuryLedgerPayload<ExtArgs>
        fields: Prisma.TreasuryLedgerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TreasuryLedgerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TreasuryLedgerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload>
          }
          findFirst: {
            args: Prisma.TreasuryLedgerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TreasuryLedgerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload>
          }
          findMany: {
            args: Prisma.TreasuryLedgerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload>[]
          }
          create: {
            args: Prisma.TreasuryLedgerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload>
          }
          createMany: {
            args: Prisma.TreasuryLedgerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TreasuryLedgerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload>
          }
          update: {
            args: Prisma.TreasuryLedgerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload>
          }
          deleteMany: {
            args: Prisma.TreasuryLedgerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TreasuryLedgerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TreasuryLedgerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TreasuryLedgerPayload>
          }
          aggregate: {
            args: Prisma.TreasuryLedgerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTreasuryLedger>
          }
          groupBy: {
            args: Prisma.TreasuryLedgerGroupByArgs<ExtArgs>
            result: $Utils.Optional<TreasuryLedgerGroupByOutputType>[]
          }
          count: {
            args: Prisma.TreasuryLedgerCountArgs<ExtArgs>
            result: $Utils.Optional<TreasuryLedgerCountAggregateOutputType> | number
          }
        }
      }
      PartnerTransaction: {
        payload: Prisma.$PartnerTransactionPayload<ExtArgs>
        fields: Prisma.PartnerTransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PartnerTransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PartnerTransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload>
          }
          findFirst: {
            args: Prisma.PartnerTransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PartnerTransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload>
          }
          findMany: {
            args: Prisma.PartnerTransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload>[]
          }
          create: {
            args: Prisma.PartnerTransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload>
          }
          createMany: {
            args: Prisma.PartnerTransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PartnerTransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload>
          }
          update: {
            args: Prisma.PartnerTransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload>
          }
          deleteMany: {
            args: Prisma.PartnerTransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PartnerTransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PartnerTransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartnerTransactionPayload>
          }
          aggregate: {
            args: Prisma.PartnerTransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePartnerTransaction>
          }
          groupBy: {
            args: Prisma.PartnerTransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PartnerTransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PartnerTransactionCountArgs<ExtArgs>
            result: $Utils.Optional<PartnerTransactionCountAggregateOutputType> | number
          }
        }
      }
      ProjectExpense: {
        payload: Prisma.$ProjectExpensePayload<ExtArgs>
        fields: Prisma.ProjectExpenseFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectExpenseFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectExpenseFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload>
          }
          findFirst: {
            args: Prisma.ProjectExpenseFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectExpenseFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload>
          }
          findMany: {
            args: Prisma.ProjectExpenseFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload>[]
          }
          create: {
            args: Prisma.ProjectExpenseCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload>
          }
          createMany: {
            args: Prisma.ProjectExpenseCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProjectExpenseDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload>
          }
          update: {
            args: Prisma.ProjectExpenseUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload>
          }
          deleteMany: {
            args: Prisma.ProjectExpenseDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectExpenseUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectExpenseUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectExpensePayload>
          }
          aggregate: {
            args: Prisma.ProjectExpenseAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectExpense>
          }
          groupBy: {
            args: Prisma.ProjectExpenseGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectExpenseGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectExpenseCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectExpenseCountAggregateOutputType> | number
          }
        }
      }
      ProjectPlot: {
        payload: Prisma.$ProjectPlotPayload<ExtArgs>
        fields: Prisma.ProjectPlotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectPlotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectPlotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload>
          }
          findFirst: {
            args: Prisma.ProjectPlotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectPlotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload>
          }
          findMany: {
            args: Prisma.ProjectPlotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload>[]
          }
          create: {
            args: Prisma.ProjectPlotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload>
          }
          createMany: {
            args: Prisma.ProjectPlotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProjectPlotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload>
          }
          update: {
            args: Prisma.ProjectPlotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload>
          }
          deleteMany: {
            args: Prisma.ProjectPlotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectPlotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProjectPlotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPlotPayload>
          }
          aggregate: {
            args: Prisma.ProjectPlotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProjectPlot>
          }
          groupBy: {
            args: Prisma.ProjectPlotGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectPlotGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectPlotCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectPlotCountAggregateOutputType> | number
          }
        }
      }
      LandSale: {
        payload: Prisma.$LandSalePayload<ExtArgs>
        fields: Prisma.LandSaleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LandSaleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LandSaleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload>
          }
          findFirst: {
            args: Prisma.LandSaleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LandSaleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload>
          }
          findMany: {
            args: Prisma.LandSaleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload>[]
          }
          create: {
            args: Prisma.LandSaleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload>
          }
          createMany: {
            args: Prisma.LandSaleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LandSaleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload>
          }
          update: {
            args: Prisma.LandSaleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload>
          }
          deleteMany: {
            args: Prisma.LandSaleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LandSaleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LandSaleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LandSalePayload>
          }
          aggregate: {
            args: Prisma.LandSaleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLandSale>
          }
          groupBy: {
            args: Prisma.LandSaleGroupByArgs<ExtArgs>
            result: $Utils.Optional<LandSaleGroupByOutputType>[]
          }
          count: {
            args: Prisma.LandSaleCountArgs<ExtArgs>
            result: $Utils.Optional<LandSaleCountAggregateOutputType> | number
          }
        }
      }
      InstallmentSchedule: {
        payload: Prisma.$InstallmentSchedulePayload<ExtArgs>
        fields: Prisma.InstallmentScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InstallmentScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InstallmentScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload>
          }
          findFirst: {
            args: Prisma.InstallmentScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InstallmentScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload>
          }
          findMany: {
            args: Prisma.InstallmentScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload>[]
          }
          create: {
            args: Prisma.InstallmentScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload>
          }
          createMany: {
            args: Prisma.InstallmentScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.InstallmentScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload>
          }
          update: {
            args: Prisma.InstallmentScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload>
          }
          deleteMany: {
            args: Prisma.InstallmentScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InstallmentScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InstallmentScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InstallmentSchedulePayload>
          }
          aggregate: {
            args: Prisma.InstallmentScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInstallmentSchedule>
          }
          groupBy: {
            args: Prisma.InstallmentScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<InstallmentScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.InstallmentScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<InstallmentScheduleCountAggregateOutputType> | number
          }
        }
      }
      CustomerPayment: {
        payload: Prisma.$CustomerPaymentPayload<ExtArgs>
        fields: Prisma.CustomerPaymentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerPaymentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerPaymentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload>
          }
          findFirst: {
            args: Prisma.CustomerPaymentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerPaymentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload>
          }
          findMany: {
            args: Prisma.CustomerPaymentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload>[]
          }
          create: {
            args: Prisma.CustomerPaymentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload>
          }
          createMany: {
            args: Prisma.CustomerPaymentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CustomerPaymentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload>
          }
          update: {
            args: Prisma.CustomerPaymentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload>
          }
          deleteMany: {
            args: Prisma.CustomerPaymentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerPaymentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerPaymentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPaymentPayload>
          }
          aggregate: {
            args: Prisma.CustomerPaymentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomerPayment>
          }
          groupBy: {
            args: Prisma.CustomerPaymentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerPaymentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerPaymentCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerPaymentCountAggregateOutputType> | number
          }
        }
      }
      ProfitDistribution: {
        payload: Prisma.$ProfitDistributionPayload<ExtArgs>
        fields: Prisma.ProfitDistributionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProfitDistributionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProfitDistributionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload>
          }
          findFirst: {
            args: Prisma.ProfitDistributionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProfitDistributionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload>
          }
          findMany: {
            args: Prisma.ProfitDistributionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload>[]
          }
          create: {
            args: Prisma.ProfitDistributionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload>
          }
          createMany: {
            args: Prisma.ProfitDistributionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ProfitDistributionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload>
          }
          update: {
            args: Prisma.ProfitDistributionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload>
          }
          deleteMany: {
            args: Prisma.ProfitDistributionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProfitDistributionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ProfitDistributionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProfitDistributionPayload>
          }
          aggregate: {
            args: Prisma.ProfitDistributionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProfitDistribution>
          }
          groupBy: {
            args: Prisma.ProfitDistributionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProfitDistributionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProfitDistributionCountArgs<ExtArgs>
            result: $Utils.Optional<ProfitDistributionCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
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
    partner?: PartnerOmit
    bankAccount?: BankAccountOmit
    landProject?: LandProjectOmit
    projectPartner?: ProjectPartnerOmit
    treasuryLedger?: TreasuryLedgerOmit
    partnerTransaction?: PartnerTransactionOmit
    projectExpense?: ProjectExpenseOmit
    projectPlot?: ProjectPlotOmit
    landSale?: LandSaleOmit
    installmentSchedule?: InstallmentScheduleOmit
    customerPayment?: CustomerPaymentOmit
    profitDistribution?: ProfitDistributionOmit
    auditLog?: AuditLogOmit
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
   * Count Type PartnerCountOutputType
   */

  export type PartnerCountOutputType = {
    projectPartners: number
    partnerTransactions: number
    paidExpenses: number
    profitDistributions: number
  }

  export type PartnerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projectPartners?: boolean | PartnerCountOutputTypeCountProjectPartnersArgs
    partnerTransactions?: boolean | PartnerCountOutputTypeCountPartnerTransactionsArgs
    paidExpenses?: boolean | PartnerCountOutputTypeCountPaidExpensesArgs
    profitDistributions?: boolean | PartnerCountOutputTypeCountProfitDistributionsArgs
  }

  // Custom InputTypes
  /**
   * PartnerCountOutputType without action
   */
  export type PartnerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerCountOutputType
     */
    select?: PartnerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PartnerCountOutputType without action
   */
  export type PartnerCountOutputTypeCountProjectPartnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectPartnerWhereInput
  }

  /**
   * PartnerCountOutputType without action
   */
  export type PartnerCountOutputTypeCountPartnerTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PartnerTransactionWhereInput
  }

  /**
   * PartnerCountOutputType without action
   */
  export type PartnerCountOutputTypeCountPaidExpensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectExpenseWhereInput
  }

  /**
   * PartnerCountOutputType without action
   */
  export type PartnerCountOutputTypeCountProfitDistributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfitDistributionWhereInput
  }


  /**
   * Count Type BankAccountCountOutputType
   */

  export type BankAccountCountOutputType = {
    treasuryLedgers: number
    expenses: number
    customerPayments: number
  }

  export type BankAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    treasuryLedgers?: boolean | BankAccountCountOutputTypeCountTreasuryLedgersArgs
    expenses?: boolean | BankAccountCountOutputTypeCountExpensesArgs
    customerPayments?: boolean | BankAccountCountOutputTypeCountCustomerPaymentsArgs
  }

  // Custom InputTypes
  /**
   * BankAccountCountOutputType without action
   */
  export type BankAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccountCountOutputType
     */
    select?: BankAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BankAccountCountOutputType without action
   */
  export type BankAccountCountOutputTypeCountTreasuryLedgersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TreasuryLedgerWhereInput
  }

  /**
   * BankAccountCountOutputType without action
   */
  export type BankAccountCountOutputTypeCountExpensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectExpenseWhereInput
  }

  /**
   * BankAccountCountOutputType without action
   */
  export type BankAccountCountOutputTypeCountCustomerPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerPaymentWhereInput
  }


  /**
   * Count Type LandProjectCountOutputType
   */

  export type LandProjectCountOutputType = {
    projectPartners: number
    projectExpenses: number
    projectPlots: number
    landSales: number
    profitDistributions: number
  }

  export type LandProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projectPartners?: boolean | LandProjectCountOutputTypeCountProjectPartnersArgs
    projectExpenses?: boolean | LandProjectCountOutputTypeCountProjectExpensesArgs
    projectPlots?: boolean | LandProjectCountOutputTypeCountProjectPlotsArgs
    landSales?: boolean | LandProjectCountOutputTypeCountLandSalesArgs
    profitDistributions?: boolean | LandProjectCountOutputTypeCountProfitDistributionsArgs
  }

  // Custom InputTypes
  /**
   * LandProjectCountOutputType without action
   */
  export type LandProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProjectCountOutputType
     */
    select?: LandProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LandProjectCountOutputType without action
   */
  export type LandProjectCountOutputTypeCountProjectPartnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectPartnerWhereInput
  }

  /**
   * LandProjectCountOutputType without action
   */
  export type LandProjectCountOutputTypeCountProjectExpensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectExpenseWhereInput
  }

  /**
   * LandProjectCountOutputType without action
   */
  export type LandProjectCountOutputTypeCountProjectPlotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectPlotWhereInput
  }

  /**
   * LandProjectCountOutputType without action
   */
  export type LandProjectCountOutputTypeCountLandSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LandSaleWhereInput
  }

  /**
   * LandProjectCountOutputType without action
   */
  export type LandProjectCountOutputTypeCountProfitDistributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfitDistributionWhereInput
  }


  /**
   * Count Type ProjectPlotCountOutputType
   */

  export type ProjectPlotCountOutputType = {
    landSales: number
  }

  export type ProjectPlotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    landSales?: boolean | ProjectPlotCountOutputTypeCountLandSalesArgs
  }

  // Custom InputTypes
  /**
   * ProjectPlotCountOutputType without action
   */
  export type ProjectPlotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlotCountOutputType
     */
    select?: ProjectPlotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectPlotCountOutputType without action
   */
  export type ProjectPlotCountOutputTypeCountLandSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LandSaleWhereInput
  }


  /**
   * Count Type LandSaleCountOutputType
   */

  export type LandSaleCountOutputType = {
    installmentSchedules: number
    customerPayments: number
  }

  export type LandSaleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    installmentSchedules?: boolean | LandSaleCountOutputTypeCountInstallmentSchedulesArgs
    customerPayments?: boolean | LandSaleCountOutputTypeCountCustomerPaymentsArgs
  }

  // Custom InputTypes
  /**
   * LandSaleCountOutputType without action
   */
  export type LandSaleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSaleCountOutputType
     */
    select?: LandSaleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LandSaleCountOutputType without action
   */
  export type LandSaleCountOutputTypeCountInstallmentSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstallmentScheduleWhereInput
  }

  /**
   * LandSaleCountOutputType without action
   */
  export type LandSaleCountOutputTypeCountCustomerPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerPaymentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Partner
   */

  export type AggregatePartner = {
    _count: PartnerCountAggregateOutputType | null
    _avg: PartnerAvgAggregateOutputType | null
    _sum: PartnerSumAggregateOutputType | null
    _min: PartnerMinAggregateOutputType | null
    _max: PartnerMaxAggregateOutputType | null
  }

  export type PartnerAvgAggregateOutputType = {
    openingBalance: Decimal | null
  }

  export type PartnerSumAggregateOutputType = {
    openingBalance: Decimal | null
  }

  export type PartnerMinAggregateOutputType = {
    id: string | null
    globalUserId: string | null
    name: string | null
    phone: string | null
    nidNumber: string | null
    openingBalance: Decimal | null
    createdAt: Date | null
  }

  export type PartnerMaxAggregateOutputType = {
    id: string | null
    globalUserId: string | null
    name: string | null
    phone: string | null
    nidNumber: string | null
    openingBalance: Decimal | null
    createdAt: Date | null
  }

  export type PartnerCountAggregateOutputType = {
    id: number
    globalUserId: number
    name: number
    phone: number
    nidNumber: number
    openingBalance: number
    createdAt: number
    _all: number
  }


  export type PartnerAvgAggregateInputType = {
    openingBalance?: true
  }

  export type PartnerSumAggregateInputType = {
    openingBalance?: true
  }

  export type PartnerMinAggregateInputType = {
    id?: true
    globalUserId?: true
    name?: true
    phone?: true
    nidNumber?: true
    openingBalance?: true
    createdAt?: true
  }

  export type PartnerMaxAggregateInputType = {
    id?: true
    globalUserId?: true
    name?: true
    phone?: true
    nidNumber?: true
    openingBalance?: true
    createdAt?: true
  }

  export type PartnerCountAggregateInputType = {
    id?: true
    globalUserId?: true
    name?: true
    phone?: true
    nidNumber?: true
    openingBalance?: true
    createdAt?: true
    _all?: true
  }

  export type PartnerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Partner to aggregate.
     */
    where?: PartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Partners to fetch.
     */
    orderBy?: PartnerOrderByWithRelationInput | PartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Partners
    **/
    _count?: true | PartnerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PartnerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PartnerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PartnerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PartnerMaxAggregateInputType
  }

  export type GetPartnerAggregateType<T extends PartnerAggregateArgs> = {
        [P in keyof T & keyof AggregatePartner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePartner[P]>
      : GetScalarType<T[P], AggregatePartner[P]>
  }




  export type PartnerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PartnerWhereInput
    orderBy?: PartnerOrderByWithAggregationInput | PartnerOrderByWithAggregationInput[]
    by: PartnerScalarFieldEnum[] | PartnerScalarFieldEnum
    having?: PartnerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PartnerCountAggregateInputType | true
    _avg?: PartnerAvgAggregateInputType
    _sum?: PartnerSumAggregateInputType
    _min?: PartnerMinAggregateInputType
    _max?: PartnerMaxAggregateInputType
  }

  export type PartnerGroupByOutputType = {
    id: string
    globalUserId: string | null
    name: string
    phone: string
    nidNumber: string | null
    openingBalance: Decimal
    createdAt: Date
    _count: PartnerCountAggregateOutputType | null
    _avg: PartnerAvgAggregateOutputType | null
    _sum: PartnerSumAggregateOutputType | null
    _min: PartnerMinAggregateOutputType | null
    _max: PartnerMaxAggregateOutputType | null
  }

  type GetPartnerGroupByPayload<T extends PartnerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PartnerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PartnerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PartnerGroupByOutputType[P]>
            : GetScalarType<T[P], PartnerGroupByOutputType[P]>
        }
      >
    >


  export type PartnerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    globalUserId?: boolean
    name?: boolean
    phone?: boolean
    nidNumber?: boolean
    openingBalance?: boolean
    createdAt?: boolean
    projectPartners?: boolean | Partner$projectPartnersArgs<ExtArgs>
    partnerTransactions?: boolean | Partner$partnerTransactionsArgs<ExtArgs>
    paidExpenses?: boolean | Partner$paidExpensesArgs<ExtArgs>
    profitDistributions?: boolean | Partner$profitDistributionsArgs<ExtArgs>
    _count?: boolean | PartnerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["partner"]>



  export type PartnerSelectScalar = {
    id?: boolean
    globalUserId?: boolean
    name?: boolean
    phone?: boolean
    nidNumber?: boolean
    openingBalance?: boolean
    createdAt?: boolean
  }

  export type PartnerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "globalUserId" | "name" | "phone" | "nidNumber" | "openingBalance" | "createdAt", ExtArgs["result"]["partner"]>
  export type PartnerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projectPartners?: boolean | Partner$projectPartnersArgs<ExtArgs>
    partnerTransactions?: boolean | Partner$partnerTransactionsArgs<ExtArgs>
    paidExpenses?: boolean | Partner$paidExpensesArgs<ExtArgs>
    profitDistributions?: boolean | Partner$profitDistributionsArgs<ExtArgs>
    _count?: boolean | PartnerCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $PartnerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Partner"
    objects: {
      projectPartners: Prisma.$ProjectPartnerPayload<ExtArgs>[]
      partnerTransactions: Prisma.$PartnerTransactionPayload<ExtArgs>[]
      paidExpenses: Prisma.$ProjectExpensePayload<ExtArgs>[]
      profitDistributions: Prisma.$ProfitDistributionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      globalUserId: string | null
      name: string
      phone: string
      nidNumber: string | null
      openingBalance: Prisma.Decimal
      createdAt: Date
    }, ExtArgs["result"]["partner"]>
    composites: {}
  }

  type PartnerGetPayload<S extends boolean | null | undefined | PartnerDefaultArgs> = $Result.GetResult<Prisma.$PartnerPayload, S>

  type PartnerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PartnerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PartnerCountAggregateInputType | true
    }

  export interface PartnerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Partner'], meta: { name: 'Partner' } }
    /**
     * Find zero or one Partner that matches the filter.
     * @param {PartnerFindUniqueArgs} args - Arguments to find a Partner
     * @example
     * // Get one Partner
     * const partner = await prisma.partner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PartnerFindUniqueArgs>(args: SelectSubset<T, PartnerFindUniqueArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Partner that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PartnerFindUniqueOrThrowArgs} args - Arguments to find a Partner
     * @example
     * // Get one Partner
     * const partner = await prisma.partner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PartnerFindUniqueOrThrowArgs>(args: SelectSubset<T, PartnerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Partner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerFindFirstArgs} args - Arguments to find a Partner
     * @example
     * // Get one Partner
     * const partner = await prisma.partner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PartnerFindFirstArgs>(args?: SelectSubset<T, PartnerFindFirstArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Partner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerFindFirstOrThrowArgs} args - Arguments to find a Partner
     * @example
     * // Get one Partner
     * const partner = await prisma.partner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PartnerFindFirstOrThrowArgs>(args?: SelectSubset<T, PartnerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Partners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Partners
     * const partners = await prisma.partner.findMany()
     * 
     * // Get first 10 Partners
     * const partners = await prisma.partner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const partnerWithIdOnly = await prisma.partner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PartnerFindManyArgs>(args?: SelectSubset<T, PartnerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Partner.
     * @param {PartnerCreateArgs} args - Arguments to create a Partner.
     * @example
     * // Create one Partner
     * const Partner = await prisma.partner.create({
     *   data: {
     *     // ... data to create a Partner
     *   }
     * })
     * 
     */
    create<T extends PartnerCreateArgs>(args: SelectSubset<T, PartnerCreateArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Partners.
     * @param {PartnerCreateManyArgs} args - Arguments to create many Partners.
     * @example
     * // Create many Partners
     * const partner = await prisma.partner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PartnerCreateManyArgs>(args?: SelectSubset<T, PartnerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Partner.
     * @param {PartnerDeleteArgs} args - Arguments to delete one Partner.
     * @example
     * // Delete one Partner
     * const Partner = await prisma.partner.delete({
     *   where: {
     *     // ... filter to delete one Partner
     *   }
     * })
     * 
     */
    delete<T extends PartnerDeleteArgs>(args: SelectSubset<T, PartnerDeleteArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Partner.
     * @param {PartnerUpdateArgs} args - Arguments to update one Partner.
     * @example
     * // Update one Partner
     * const partner = await prisma.partner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PartnerUpdateArgs>(args: SelectSubset<T, PartnerUpdateArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Partners.
     * @param {PartnerDeleteManyArgs} args - Arguments to filter Partners to delete.
     * @example
     * // Delete a few Partners
     * const { count } = await prisma.partner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PartnerDeleteManyArgs>(args?: SelectSubset<T, PartnerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Partners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Partners
     * const partner = await prisma.partner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PartnerUpdateManyArgs>(args: SelectSubset<T, PartnerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Partner.
     * @param {PartnerUpsertArgs} args - Arguments to update or create a Partner.
     * @example
     * // Update or create a Partner
     * const partner = await prisma.partner.upsert({
     *   create: {
     *     // ... data to create a Partner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Partner we want to update
     *   }
     * })
     */
    upsert<T extends PartnerUpsertArgs>(args: SelectSubset<T, PartnerUpsertArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Partners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerCountArgs} args - Arguments to filter Partners to count.
     * @example
     * // Count the number of Partners
     * const count = await prisma.partner.count({
     *   where: {
     *     // ... the filter for the Partners we want to count
     *   }
     * })
    **/
    count<T extends PartnerCountArgs>(
      args?: Subset<T, PartnerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PartnerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Partner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PartnerAggregateArgs>(args: Subset<T, PartnerAggregateArgs>): Prisma.PrismaPromise<GetPartnerAggregateType<T>>

    /**
     * Group by Partner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerGroupByArgs} args - Group by arguments.
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
      T extends PartnerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PartnerGroupByArgs['orderBy'] }
        : { orderBy?: PartnerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PartnerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartnerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Partner model
   */
  readonly fields: PartnerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Partner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PartnerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projectPartners<T extends Partner$projectPartnersArgs<ExtArgs> = {}>(args?: Subset<T, Partner$projectPartnersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    partnerTransactions<T extends Partner$partnerTransactionsArgs<ExtArgs> = {}>(args?: Subset<T, Partner$partnerTransactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    paidExpenses<T extends Partner$paidExpensesArgs<ExtArgs> = {}>(args?: Subset<T, Partner$paidExpensesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    profitDistributions<T extends Partner$profitDistributionsArgs<ExtArgs> = {}>(args?: Subset<T, Partner$profitDistributionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Partner model
   */
  interface PartnerFieldRefs {
    readonly id: FieldRef<"Partner", 'String'>
    readonly globalUserId: FieldRef<"Partner", 'String'>
    readonly name: FieldRef<"Partner", 'String'>
    readonly phone: FieldRef<"Partner", 'String'>
    readonly nidNumber: FieldRef<"Partner", 'String'>
    readonly openingBalance: FieldRef<"Partner", 'Decimal'>
    readonly createdAt: FieldRef<"Partner", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Partner findUnique
   */
  export type PartnerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partner to fetch.
     */
    where: PartnerWhereUniqueInput
  }

  /**
   * Partner findUniqueOrThrow
   */
  export type PartnerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partner to fetch.
     */
    where: PartnerWhereUniqueInput
  }

  /**
   * Partner findFirst
   */
  export type PartnerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partner to fetch.
     */
    where?: PartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Partners to fetch.
     */
    orderBy?: PartnerOrderByWithRelationInput | PartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Partners.
     */
    cursor?: PartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Partners.
     */
    distinct?: PartnerScalarFieldEnum | PartnerScalarFieldEnum[]
  }

  /**
   * Partner findFirstOrThrow
   */
  export type PartnerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partner to fetch.
     */
    where?: PartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Partners to fetch.
     */
    orderBy?: PartnerOrderByWithRelationInput | PartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Partners.
     */
    cursor?: PartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Partners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Partners.
     */
    distinct?: PartnerScalarFieldEnum | PartnerScalarFieldEnum[]
  }

  /**
   * Partner findMany
   */
  export type PartnerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter, which Partners to fetch.
     */
    where?: PartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Partners to fetch.
     */
    orderBy?: PartnerOrderByWithRelationInput | PartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Partners.
     */
    cursor?: PartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Partners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Partners.
     */
    skip?: number
    distinct?: PartnerScalarFieldEnum | PartnerScalarFieldEnum[]
  }

  /**
   * Partner create
   */
  export type PartnerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * The data needed to create a Partner.
     */
    data: XOR<PartnerCreateInput, PartnerUncheckedCreateInput>
  }

  /**
   * Partner createMany
   */
  export type PartnerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Partners.
     */
    data: PartnerCreateManyInput | PartnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Partner update
   */
  export type PartnerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * The data needed to update a Partner.
     */
    data: XOR<PartnerUpdateInput, PartnerUncheckedUpdateInput>
    /**
     * Choose, which Partner to update.
     */
    where: PartnerWhereUniqueInput
  }

  /**
   * Partner updateMany
   */
  export type PartnerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Partners.
     */
    data: XOR<PartnerUpdateManyMutationInput, PartnerUncheckedUpdateManyInput>
    /**
     * Filter which Partners to update
     */
    where?: PartnerWhereInput
    /**
     * Limit how many Partners to update.
     */
    limit?: number
  }

  /**
   * Partner upsert
   */
  export type PartnerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * The filter to search for the Partner to update in case it exists.
     */
    where: PartnerWhereUniqueInput
    /**
     * In case the Partner found by the `where` argument doesn't exist, create a new Partner with this data.
     */
    create: XOR<PartnerCreateInput, PartnerUncheckedCreateInput>
    /**
     * In case the Partner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PartnerUpdateInput, PartnerUncheckedUpdateInput>
  }

  /**
   * Partner delete
   */
  export type PartnerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    /**
     * Filter which Partner to delete.
     */
    where: PartnerWhereUniqueInput
  }

  /**
   * Partner deleteMany
   */
  export type PartnerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Partners to delete
     */
    where?: PartnerWhereInput
    /**
     * Limit how many Partners to delete.
     */
    limit?: number
  }

  /**
   * Partner.projectPartners
   */
  export type Partner$projectPartnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    where?: ProjectPartnerWhereInput
    orderBy?: ProjectPartnerOrderByWithRelationInput | ProjectPartnerOrderByWithRelationInput[]
    cursor?: ProjectPartnerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectPartnerScalarFieldEnum | ProjectPartnerScalarFieldEnum[]
  }

  /**
   * Partner.partnerTransactions
   */
  export type Partner$partnerTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    where?: PartnerTransactionWhereInput
    orderBy?: PartnerTransactionOrderByWithRelationInput | PartnerTransactionOrderByWithRelationInput[]
    cursor?: PartnerTransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PartnerTransactionScalarFieldEnum | PartnerTransactionScalarFieldEnum[]
  }

  /**
   * Partner.paidExpenses
   */
  export type Partner$paidExpensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    where?: ProjectExpenseWhereInput
    orderBy?: ProjectExpenseOrderByWithRelationInput | ProjectExpenseOrderByWithRelationInput[]
    cursor?: ProjectExpenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectExpenseScalarFieldEnum | ProjectExpenseScalarFieldEnum[]
  }

  /**
   * Partner.profitDistributions
   */
  export type Partner$profitDistributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    where?: ProfitDistributionWhereInput
    orderBy?: ProfitDistributionOrderByWithRelationInput | ProfitDistributionOrderByWithRelationInput[]
    cursor?: ProfitDistributionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfitDistributionScalarFieldEnum | ProfitDistributionScalarFieldEnum[]
  }

  /**
   * Partner without action
   */
  export type PartnerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
  }


  /**
   * Model BankAccount
   */

  export type AggregateBankAccount = {
    _count: BankAccountCountAggregateOutputType | null
    _avg: BankAccountAvgAggregateOutputType | null
    _sum: BankAccountSumAggregateOutputType | null
    _min: BankAccountMinAggregateOutputType | null
    _max: BankAccountMaxAggregateOutputType | null
  }

  export type BankAccountAvgAggregateOutputType = {
    currentBalance: Decimal | null
  }

  export type BankAccountSumAggregateOutputType = {
    currentBalance: Decimal | null
  }

  export type BankAccountMinAggregateOutputType = {
    id: string | null
    bankName: string | null
    accountNumber: string | null
    branchName: string | null
    currentBalance: Decimal | null
    isActive: boolean | null
  }

  export type BankAccountMaxAggregateOutputType = {
    id: string | null
    bankName: string | null
    accountNumber: string | null
    branchName: string | null
    currentBalance: Decimal | null
    isActive: boolean | null
  }

  export type BankAccountCountAggregateOutputType = {
    id: number
    bankName: number
    accountNumber: number
    branchName: number
    currentBalance: number
    isActive: number
    _all: number
  }


  export type BankAccountAvgAggregateInputType = {
    currentBalance?: true
  }

  export type BankAccountSumAggregateInputType = {
    currentBalance?: true
  }

  export type BankAccountMinAggregateInputType = {
    id?: true
    bankName?: true
    accountNumber?: true
    branchName?: true
    currentBalance?: true
    isActive?: true
  }

  export type BankAccountMaxAggregateInputType = {
    id?: true
    bankName?: true
    accountNumber?: true
    branchName?: true
    currentBalance?: true
    isActive?: true
  }

  export type BankAccountCountAggregateInputType = {
    id?: true
    bankName?: true
    accountNumber?: true
    branchName?: true
    currentBalance?: true
    isActive?: true
    _all?: true
  }

  export type BankAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BankAccount to aggregate.
     */
    where?: BankAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BankAccounts to fetch.
     */
    orderBy?: BankAccountOrderByWithRelationInput | BankAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BankAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BankAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BankAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BankAccounts
    **/
    _count?: true | BankAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BankAccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BankAccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BankAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BankAccountMaxAggregateInputType
  }

  export type GetBankAccountAggregateType<T extends BankAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateBankAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBankAccount[P]>
      : GetScalarType<T[P], AggregateBankAccount[P]>
  }




  export type BankAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BankAccountWhereInput
    orderBy?: BankAccountOrderByWithAggregationInput | BankAccountOrderByWithAggregationInput[]
    by: BankAccountScalarFieldEnum[] | BankAccountScalarFieldEnum
    having?: BankAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BankAccountCountAggregateInputType | true
    _avg?: BankAccountAvgAggregateInputType
    _sum?: BankAccountSumAggregateInputType
    _min?: BankAccountMinAggregateInputType
    _max?: BankAccountMaxAggregateInputType
  }

  export type BankAccountGroupByOutputType = {
    id: string
    bankName: string
    accountNumber: string
    branchName: string | null
    currentBalance: Decimal
    isActive: boolean
    _count: BankAccountCountAggregateOutputType | null
    _avg: BankAccountAvgAggregateOutputType | null
    _sum: BankAccountSumAggregateOutputType | null
    _min: BankAccountMinAggregateOutputType | null
    _max: BankAccountMaxAggregateOutputType | null
  }

  type GetBankAccountGroupByPayload<T extends BankAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BankAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BankAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BankAccountGroupByOutputType[P]>
            : GetScalarType<T[P], BankAccountGroupByOutputType[P]>
        }
      >
    >


  export type BankAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bankName?: boolean
    accountNumber?: boolean
    branchName?: boolean
    currentBalance?: boolean
    isActive?: boolean
    treasuryLedgers?: boolean | BankAccount$treasuryLedgersArgs<ExtArgs>
    expenses?: boolean | BankAccount$expensesArgs<ExtArgs>
    customerPayments?: boolean | BankAccount$customerPaymentsArgs<ExtArgs>
    _count?: boolean | BankAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bankAccount"]>



  export type BankAccountSelectScalar = {
    id?: boolean
    bankName?: boolean
    accountNumber?: boolean
    branchName?: boolean
    currentBalance?: boolean
    isActive?: boolean
  }

  export type BankAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bankName" | "accountNumber" | "branchName" | "currentBalance" | "isActive", ExtArgs["result"]["bankAccount"]>
  export type BankAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    treasuryLedgers?: boolean | BankAccount$treasuryLedgersArgs<ExtArgs>
    expenses?: boolean | BankAccount$expensesArgs<ExtArgs>
    customerPayments?: boolean | BankAccount$customerPaymentsArgs<ExtArgs>
    _count?: boolean | BankAccountCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $BankAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BankAccount"
    objects: {
      treasuryLedgers: Prisma.$TreasuryLedgerPayload<ExtArgs>[]
      expenses: Prisma.$ProjectExpensePayload<ExtArgs>[]
      customerPayments: Prisma.$CustomerPaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bankName: string
      accountNumber: string
      branchName: string | null
      currentBalance: Prisma.Decimal
      isActive: boolean
    }, ExtArgs["result"]["bankAccount"]>
    composites: {}
  }

  type BankAccountGetPayload<S extends boolean | null | undefined | BankAccountDefaultArgs> = $Result.GetResult<Prisma.$BankAccountPayload, S>

  type BankAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BankAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BankAccountCountAggregateInputType | true
    }

  export interface BankAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BankAccount'], meta: { name: 'BankAccount' } }
    /**
     * Find zero or one BankAccount that matches the filter.
     * @param {BankAccountFindUniqueArgs} args - Arguments to find a BankAccount
     * @example
     * // Get one BankAccount
     * const bankAccount = await prisma.bankAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BankAccountFindUniqueArgs>(args: SelectSubset<T, BankAccountFindUniqueArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BankAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BankAccountFindUniqueOrThrowArgs} args - Arguments to find a BankAccount
     * @example
     * // Get one BankAccount
     * const bankAccount = await prisma.bankAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BankAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, BankAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BankAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankAccountFindFirstArgs} args - Arguments to find a BankAccount
     * @example
     * // Get one BankAccount
     * const bankAccount = await prisma.bankAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BankAccountFindFirstArgs>(args?: SelectSubset<T, BankAccountFindFirstArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BankAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankAccountFindFirstOrThrowArgs} args - Arguments to find a BankAccount
     * @example
     * // Get one BankAccount
     * const bankAccount = await prisma.bankAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BankAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, BankAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BankAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BankAccounts
     * const bankAccounts = await prisma.bankAccount.findMany()
     * 
     * // Get first 10 BankAccounts
     * const bankAccounts = await prisma.bankAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bankAccountWithIdOnly = await prisma.bankAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BankAccountFindManyArgs>(args?: SelectSubset<T, BankAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BankAccount.
     * @param {BankAccountCreateArgs} args - Arguments to create a BankAccount.
     * @example
     * // Create one BankAccount
     * const BankAccount = await prisma.bankAccount.create({
     *   data: {
     *     // ... data to create a BankAccount
     *   }
     * })
     * 
     */
    create<T extends BankAccountCreateArgs>(args: SelectSubset<T, BankAccountCreateArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BankAccounts.
     * @param {BankAccountCreateManyArgs} args - Arguments to create many BankAccounts.
     * @example
     * // Create many BankAccounts
     * const bankAccount = await prisma.bankAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BankAccountCreateManyArgs>(args?: SelectSubset<T, BankAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a BankAccount.
     * @param {BankAccountDeleteArgs} args - Arguments to delete one BankAccount.
     * @example
     * // Delete one BankAccount
     * const BankAccount = await prisma.bankAccount.delete({
     *   where: {
     *     // ... filter to delete one BankAccount
     *   }
     * })
     * 
     */
    delete<T extends BankAccountDeleteArgs>(args: SelectSubset<T, BankAccountDeleteArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BankAccount.
     * @param {BankAccountUpdateArgs} args - Arguments to update one BankAccount.
     * @example
     * // Update one BankAccount
     * const bankAccount = await prisma.bankAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BankAccountUpdateArgs>(args: SelectSubset<T, BankAccountUpdateArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BankAccounts.
     * @param {BankAccountDeleteManyArgs} args - Arguments to filter BankAccounts to delete.
     * @example
     * // Delete a few BankAccounts
     * const { count } = await prisma.bankAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BankAccountDeleteManyArgs>(args?: SelectSubset<T, BankAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BankAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BankAccounts
     * const bankAccount = await prisma.bankAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BankAccountUpdateManyArgs>(args: SelectSubset<T, BankAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one BankAccount.
     * @param {BankAccountUpsertArgs} args - Arguments to update or create a BankAccount.
     * @example
     * // Update or create a BankAccount
     * const bankAccount = await prisma.bankAccount.upsert({
     *   create: {
     *     // ... data to create a BankAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BankAccount we want to update
     *   }
     * })
     */
    upsert<T extends BankAccountUpsertArgs>(args: SelectSubset<T, BankAccountUpsertArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BankAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankAccountCountArgs} args - Arguments to filter BankAccounts to count.
     * @example
     * // Count the number of BankAccounts
     * const count = await prisma.bankAccount.count({
     *   where: {
     *     // ... the filter for the BankAccounts we want to count
     *   }
     * })
    **/
    count<T extends BankAccountCountArgs>(
      args?: Subset<T, BankAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BankAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BankAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BankAccountAggregateArgs>(args: Subset<T, BankAccountAggregateArgs>): Prisma.PrismaPromise<GetBankAccountAggregateType<T>>

    /**
     * Group by BankAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BankAccountGroupByArgs} args - Group by arguments.
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
      T extends BankAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BankAccountGroupByArgs['orderBy'] }
        : { orderBy?: BankAccountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BankAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBankAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BankAccount model
   */
  readonly fields: BankAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BankAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BankAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    treasuryLedgers<T extends BankAccount$treasuryLedgersArgs<ExtArgs> = {}>(args?: Subset<T, BankAccount$treasuryLedgersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    expenses<T extends BankAccount$expensesArgs<ExtArgs> = {}>(args?: Subset<T, BankAccount$expensesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    customerPayments<T extends BankAccount$customerPaymentsArgs<ExtArgs> = {}>(args?: Subset<T, BankAccount$customerPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the BankAccount model
   */
  interface BankAccountFieldRefs {
    readonly id: FieldRef<"BankAccount", 'String'>
    readonly bankName: FieldRef<"BankAccount", 'String'>
    readonly accountNumber: FieldRef<"BankAccount", 'String'>
    readonly branchName: FieldRef<"BankAccount", 'String'>
    readonly currentBalance: FieldRef<"BankAccount", 'Decimal'>
    readonly isActive: FieldRef<"BankAccount", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * BankAccount findUnique
   */
  export type BankAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * Filter, which BankAccount to fetch.
     */
    where: BankAccountWhereUniqueInput
  }

  /**
   * BankAccount findUniqueOrThrow
   */
  export type BankAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * Filter, which BankAccount to fetch.
     */
    where: BankAccountWhereUniqueInput
  }

  /**
   * BankAccount findFirst
   */
  export type BankAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * Filter, which BankAccount to fetch.
     */
    where?: BankAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BankAccounts to fetch.
     */
    orderBy?: BankAccountOrderByWithRelationInput | BankAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BankAccounts.
     */
    cursor?: BankAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BankAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BankAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BankAccounts.
     */
    distinct?: BankAccountScalarFieldEnum | BankAccountScalarFieldEnum[]
  }

  /**
   * BankAccount findFirstOrThrow
   */
  export type BankAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * Filter, which BankAccount to fetch.
     */
    where?: BankAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BankAccounts to fetch.
     */
    orderBy?: BankAccountOrderByWithRelationInput | BankAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BankAccounts.
     */
    cursor?: BankAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BankAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BankAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BankAccounts.
     */
    distinct?: BankAccountScalarFieldEnum | BankAccountScalarFieldEnum[]
  }

  /**
   * BankAccount findMany
   */
  export type BankAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * Filter, which BankAccounts to fetch.
     */
    where?: BankAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BankAccounts to fetch.
     */
    orderBy?: BankAccountOrderByWithRelationInput | BankAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BankAccounts.
     */
    cursor?: BankAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BankAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BankAccounts.
     */
    skip?: number
    distinct?: BankAccountScalarFieldEnum | BankAccountScalarFieldEnum[]
  }

  /**
   * BankAccount create
   */
  export type BankAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a BankAccount.
     */
    data: XOR<BankAccountCreateInput, BankAccountUncheckedCreateInput>
  }

  /**
   * BankAccount createMany
   */
  export type BankAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BankAccounts.
     */
    data: BankAccountCreateManyInput | BankAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BankAccount update
   */
  export type BankAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a BankAccount.
     */
    data: XOR<BankAccountUpdateInput, BankAccountUncheckedUpdateInput>
    /**
     * Choose, which BankAccount to update.
     */
    where: BankAccountWhereUniqueInput
  }

  /**
   * BankAccount updateMany
   */
  export type BankAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BankAccounts.
     */
    data: XOR<BankAccountUpdateManyMutationInput, BankAccountUncheckedUpdateManyInput>
    /**
     * Filter which BankAccounts to update
     */
    where?: BankAccountWhereInput
    /**
     * Limit how many BankAccounts to update.
     */
    limit?: number
  }

  /**
   * BankAccount upsert
   */
  export type BankAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the BankAccount to update in case it exists.
     */
    where: BankAccountWhereUniqueInput
    /**
     * In case the BankAccount found by the `where` argument doesn't exist, create a new BankAccount with this data.
     */
    create: XOR<BankAccountCreateInput, BankAccountUncheckedCreateInput>
    /**
     * In case the BankAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BankAccountUpdateInput, BankAccountUncheckedUpdateInput>
  }

  /**
   * BankAccount delete
   */
  export type BankAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    /**
     * Filter which BankAccount to delete.
     */
    where: BankAccountWhereUniqueInput
  }

  /**
   * BankAccount deleteMany
   */
  export type BankAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BankAccounts to delete
     */
    where?: BankAccountWhereInput
    /**
     * Limit how many BankAccounts to delete.
     */
    limit?: number
  }

  /**
   * BankAccount.treasuryLedgers
   */
  export type BankAccount$treasuryLedgersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    where?: TreasuryLedgerWhereInput
    orderBy?: TreasuryLedgerOrderByWithRelationInput | TreasuryLedgerOrderByWithRelationInput[]
    cursor?: TreasuryLedgerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TreasuryLedgerScalarFieldEnum | TreasuryLedgerScalarFieldEnum[]
  }

  /**
   * BankAccount.expenses
   */
  export type BankAccount$expensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    where?: ProjectExpenseWhereInput
    orderBy?: ProjectExpenseOrderByWithRelationInput | ProjectExpenseOrderByWithRelationInput[]
    cursor?: ProjectExpenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectExpenseScalarFieldEnum | ProjectExpenseScalarFieldEnum[]
  }

  /**
   * BankAccount.customerPayments
   */
  export type BankAccount$customerPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    where?: CustomerPaymentWhereInput
    orderBy?: CustomerPaymentOrderByWithRelationInput | CustomerPaymentOrderByWithRelationInput[]
    cursor?: CustomerPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerPaymentScalarFieldEnum | CustomerPaymentScalarFieldEnum[]
  }

  /**
   * BankAccount without action
   */
  export type BankAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
  }


  /**
   * Model LandProject
   */

  export type AggregateLandProject = {
    _count: LandProjectCountAggregateOutputType | null
    _avg: LandProjectAvgAggregateOutputType | null
    _sum: LandProjectSumAggregateOutputType | null
    _min: LandProjectMinAggregateOutputType | null
    _max: LandProjectMaxAggregateOutputType | null
  }

  export type LandProjectAvgAggregateOutputType = {
    totalAreaShotok: Decimal | null
    purchasePrice: Decimal | null
    baynaAmount: Decimal | null
    registrationCost: Decimal | null
    mutationTaxCost: Decimal | null
  }

  export type LandProjectSumAggregateOutputType = {
    totalAreaShotok: Decimal | null
    purchasePrice: Decimal | null
    baynaAmount: Decimal | null
    registrationCost: Decimal | null
    mutationTaxCost: Decimal | null
  }

  export type LandProjectMinAggregateOutputType = {
    id: string | null
    projectName: string | null
    mouza: string | null
    jlNumber: string | null
    dagNumbers: string | null
    khatianNumbers: string | null
    totalAreaShotok: Decimal | null
    purchasePrice: Decimal | null
    baynaAmount: Decimal | null
    registrationCost: Decimal | null
    mutationTaxCost: Decimal | null
    status: string | null
    createdAt: Date | null
  }

  export type LandProjectMaxAggregateOutputType = {
    id: string | null
    projectName: string | null
    mouza: string | null
    jlNumber: string | null
    dagNumbers: string | null
    khatianNumbers: string | null
    totalAreaShotok: Decimal | null
    purchasePrice: Decimal | null
    baynaAmount: Decimal | null
    registrationCost: Decimal | null
    mutationTaxCost: Decimal | null
    status: string | null
    createdAt: Date | null
  }

  export type LandProjectCountAggregateOutputType = {
    id: number
    projectName: number
    mouza: number
    jlNumber: number
    dagNumbers: number
    khatianNumbers: number
    totalAreaShotok: number
    purchasePrice: number
    baynaAmount: number
    registrationCost: number
    mutationTaxCost: number
    status: number
    createdAt: number
    _all: number
  }


  export type LandProjectAvgAggregateInputType = {
    totalAreaShotok?: true
    purchasePrice?: true
    baynaAmount?: true
    registrationCost?: true
    mutationTaxCost?: true
  }

  export type LandProjectSumAggregateInputType = {
    totalAreaShotok?: true
    purchasePrice?: true
    baynaAmount?: true
    registrationCost?: true
    mutationTaxCost?: true
  }

  export type LandProjectMinAggregateInputType = {
    id?: true
    projectName?: true
    mouza?: true
    jlNumber?: true
    dagNumbers?: true
    khatianNumbers?: true
    totalAreaShotok?: true
    purchasePrice?: true
    baynaAmount?: true
    registrationCost?: true
    mutationTaxCost?: true
    status?: true
    createdAt?: true
  }

  export type LandProjectMaxAggregateInputType = {
    id?: true
    projectName?: true
    mouza?: true
    jlNumber?: true
    dagNumbers?: true
    khatianNumbers?: true
    totalAreaShotok?: true
    purchasePrice?: true
    baynaAmount?: true
    registrationCost?: true
    mutationTaxCost?: true
    status?: true
    createdAt?: true
  }

  export type LandProjectCountAggregateInputType = {
    id?: true
    projectName?: true
    mouza?: true
    jlNumber?: true
    dagNumbers?: true
    khatianNumbers?: true
    totalAreaShotok?: true
    purchasePrice?: true
    baynaAmount?: true
    registrationCost?: true
    mutationTaxCost?: true
    status?: true
    createdAt?: true
    _all?: true
  }

  export type LandProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandProject to aggregate.
     */
    where?: LandProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandProjects to fetch.
     */
    orderBy?: LandProjectOrderByWithRelationInput | LandProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LandProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LandProjects
    **/
    _count?: true | LandProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LandProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LandProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LandProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LandProjectMaxAggregateInputType
  }

  export type GetLandProjectAggregateType<T extends LandProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateLandProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLandProject[P]>
      : GetScalarType<T[P], AggregateLandProject[P]>
  }




  export type LandProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LandProjectWhereInput
    orderBy?: LandProjectOrderByWithAggregationInput | LandProjectOrderByWithAggregationInput[]
    by: LandProjectScalarFieldEnum[] | LandProjectScalarFieldEnum
    having?: LandProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LandProjectCountAggregateInputType | true
    _avg?: LandProjectAvgAggregateInputType
    _sum?: LandProjectSumAggregateInputType
    _min?: LandProjectMinAggregateInputType
    _max?: LandProjectMaxAggregateInputType
  }

  export type LandProjectGroupByOutputType = {
    id: string
    projectName: string
    mouza: string
    jlNumber: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal
    purchasePrice: Decimal
    baynaAmount: Decimal
    registrationCost: Decimal
    mutationTaxCost: Decimal
    status: string
    createdAt: Date
    _count: LandProjectCountAggregateOutputType | null
    _avg: LandProjectAvgAggregateOutputType | null
    _sum: LandProjectSumAggregateOutputType | null
    _min: LandProjectMinAggregateOutputType | null
    _max: LandProjectMaxAggregateOutputType | null
  }

  type GetLandProjectGroupByPayload<T extends LandProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LandProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LandProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LandProjectGroupByOutputType[P]>
            : GetScalarType<T[P], LandProjectGroupByOutputType[P]>
        }
      >
    >


  export type LandProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectName?: boolean
    mouza?: boolean
    jlNumber?: boolean
    dagNumbers?: boolean
    khatianNumbers?: boolean
    totalAreaShotok?: boolean
    purchasePrice?: boolean
    baynaAmount?: boolean
    registrationCost?: boolean
    mutationTaxCost?: boolean
    status?: boolean
    createdAt?: boolean
    projectPartners?: boolean | LandProject$projectPartnersArgs<ExtArgs>
    projectExpenses?: boolean | LandProject$projectExpensesArgs<ExtArgs>
    projectPlots?: boolean | LandProject$projectPlotsArgs<ExtArgs>
    landSales?: boolean | LandProject$landSalesArgs<ExtArgs>
    profitDistributions?: boolean | LandProject$profitDistributionsArgs<ExtArgs>
    _count?: boolean | LandProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["landProject"]>



  export type LandProjectSelectScalar = {
    id?: boolean
    projectName?: boolean
    mouza?: boolean
    jlNumber?: boolean
    dagNumbers?: boolean
    khatianNumbers?: boolean
    totalAreaShotok?: boolean
    purchasePrice?: boolean
    baynaAmount?: boolean
    registrationCost?: boolean
    mutationTaxCost?: boolean
    status?: boolean
    createdAt?: boolean
  }

  export type LandProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectName" | "mouza" | "jlNumber" | "dagNumbers" | "khatianNumbers" | "totalAreaShotok" | "purchasePrice" | "baynaAmount" | "registrationCost" | "mutationTaxCost" | "status" | "createdAt", ExtArgs["result"]["landProject"]>
  export type LandProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projectPartners?: boolean | LandProject$projectPartnersArgs<ExtArgs>
    projectExpenses?: boolean | LandProject$projectExpensesArgs<ExtArgs>
    projectPlots?: boolean | LandProject$projectPlotsArgs<ExtArgs>
    landSales?: boolean | LandProject$landSalesArgs<ExtArgs>
    profitDistributions?: boolean | LandProject$profitDistributionsArgs<ExtArgs>
    _count?: boolean | LandProjectCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $LandProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LandProject"
    objects: {
      projectPartners: Prisma.$ProjectPartnerPayload<ExtArgs>[]
      projectExpenses: Prisma.$ProjectExpensePayload<ExtArgs>[]
      projectPlots: Prisma.$ProjectPlotPayload<ExtArgs>[]
      landSales: Prisma.$LandSalePayload<ExtArgs>[]
      profitDistributions: Prisma.$ProfitDistributionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectName: string
      mouza: string
      jlNumber: string | null
      dagNumbers: string
      khatianNumbers: string
      totalAreaShotok: Prisma.Decimal
      purchasePrice: Prisma.Decimal
      baynaAmount: Prisma.Decimal
      registrationCost: Prisma.Decimal
      mutationTaxCost: Prisma.Decimal
      status: string
      createdAt: Date
    }, ExtArgs["result"]["landProject"]>
    composites: {}
  }

  type LandProjectGetPayload<S extends boolean | null | undefined | LandProjectDefaultArgs> = $Result.GetResult<Prisma.$LandProjectPayload, S>

  type LandProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LandProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LandProjectCountAggregateInputType | true
    }

  export interface LandProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LandProject'], meta: { name: 'LandProject' } }
    /**
     * Find zero or one LandProject that matches the filter.
     * @param {LandProjectFindUniqueArgs} args - Arguments to find a LandProject
     * @example
     * // Get one LandProject
     * const landProject = await prisma.landProject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LandProjectFindUniqueArgs>(args: SelectSubset<T, LandProjectFindUniqueArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LandProject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LandProjectFindUniqueOrThrowArgs} args - Arguments to find a LandProject
     * @example
     * // Get one LandProject
     * const landProject = await prisma.landProject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LandProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, LandProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandProject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandProjectFindFirstArgs} args - Arguments to find a LandProject
     * @example
     * // Get one LandProject
     * const landProject = await prisma.landProject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LandProjectFindFirstArgs>(args?: SelectSubset<T, LandProjectFindFirstArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandProject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandProjectFindFirstOrThrowArgs} args - Arguments to find a LandProject
     * @example
     * // Get one LandProject
     * const landProject = await prisma.landProject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LandProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, LandProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LandProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LandProjects
     * const landProjects = await prisma.landProject.findMany()
     * 
     * // Get first 10 LandProjects
     * const landProjects = await prisma.landProject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const landProjectWithIdOnly = await prisma.landProject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LandProjectFindManyArgs>(args?: SelectSubset<T, LandProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LandProject.
     * @param {LandProjectCreateArgs} args - Arguments to create a LandProject.
     * @example
     * // Create one LandProject
     * const LandProject = await prisma.landProject.create({
     *   data: {
     *     // ... data to create a LandProject
     *   }
     * })
     * 
     */
    create<T extends LandProjectCreateArgs>(args: SelectSubset<T, LandProjectCreateArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LandProjects.
     * @param {LandProjectCreateManyArgs} args - Arguments to create many LandProjects.
     * @example
     * // Create many LandProjects
     * const landProject = await prisma.landProject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LandProjectCreateManyArgs>(args?: SelectSubset<T, LandProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LandProject.
     * @param {LandProjectDeleteArgs} args - Arguments to delete one LandProject.
     * @example
     * // Delete one LandProject
     * const LandProject = await prisma.landProject.delete({
     *   where: {
     *     // ... filter to delete one LandProject
     *   }
     * })
     * 
     */
    delete<T extends LandProjectDeleteArgs>(args: SelectSubset<T, LandProjectDeleteArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LandProject.
     * @param {LandProjectUpdateArgs} args - Arguments to update one LandProject.
     * @example
     * // Update one LandProject
     * const landProject = await prisma.landProject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LandProjectUpdateArgs>(args: SelectSubset<T, LandProjectUpdateArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LandProjects.
     * @param {LandProjectDeleteManyArgs} args - Arguments to filter LandProjects to delete.
     * @example
     * // Delete a few LandProjects
     * const { count } = await prisma.landProject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LandProjectDeleteManyArgs>(args?: SelectSubset<T, LandProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LandProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LandProjects
     * const landProject = await prisma.landProject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LandProjectUpdateManyArgs>(args: SelectSubset<T, LandProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LandProject.
     * @param {LandProjectUpsertArgs} args - Arguments to update or create a LandProject.
     * @example
     * // Update or create a LandProject
     * const landProject = await prisma.landProject.upsert({
     *   create: {
     *     // ... data to create a LandProject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LandProject we want to update
     *   }
     * })
     */
    upsert<T extends LandProjectUpsertArgs>(args: SelectSubset<T, LandProjectUpsertArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LandProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandProjectCountArgs} args - Arguments to filter LandProjects to count.
     * @example
     * // Count the number of LandProjects
     * const count = await prisma.landProject.count({
     *   where: {
     *     // ... the filter for the LandProjects we want to count
     *   }
     * })
    **/
    count<T extends LandProjectCountArgs>(
      args?: Subset<T, LandProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LandProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LandProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LandProjectAggregateArgs>(args: Subset<T, LandProjectAggregateArgs>): Prisma.PrismaPromise<GetLandProjectAggregateType<T>>

    /**
     * Group by LandProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandProjectGroupByArgs} args - Group by arguments.
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
      T extends LandProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LandProjectGroupByArgs['orderBy'] }
        : { orderBy?: LandProjectGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LandProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLandProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LandProject model
   */
  readonly fields: LandProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LandProject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LandProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projectPartners<T extends LandProject$projectPartnersArgs<ExtArgs> = {}>(args?: Subset<T, LandProject$projectPartnersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projectExpenses<T extends LandProject$projectExpensesArgs<ExtArgs> = {}>(args?: Subset<T, LandProject$projectExpensesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    projectPlots<T extends LandProject$projectPlotsArgs<ExtArgs> = {}>(args?: Subset<T, LandProject$projectPlotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    landSales<T extends LandProject$landSalesArgs<ExtArgs> = {}>(args?: Subset<T, LandProject$landSalesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    profitDistributions<T extends LandProject$profitDistributionsArgs<ExtArgs> = {}>(args?: Subset<T, LandProject$profitDistributionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the LandProject model
   */
  interface LandProjectFieldRefs {
    readonly id: FieldRef<"LandProject", 'String'>
    readonly projectName: FieldRef<"LandProject", 'String'>
    readonly mouza: FieldRef<"LandProject", 'String'>
    readonly jlNumber: FieldRef<"LandProject", 'String'>
    readonly dagNumbers: FieldRef<"LandProject", 'String'>
    readonly khatianNumbers: FieldRef<"LandProject", 'String'>
    readonly totalAreaShotok: FieldRef<"LandProject", 'Decimal'>
    readonly purchasePrice: FieldRef<"LandProject", 'Decimal'>
    readonly baynaAmount: FieldRef<"LandProject", 'Decimal'>
    readonly registrationCost: FieldRef<"LandProject", 'Decimal'>
    readonly mutationTaxCost: FieldRef<"LandProject", 'Decimal'>
    readonly status: FieldRef<"LandProject", 'String'>
    readonly createdAt: FieldRef<"LandProject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LandProject findUnique
   */
  export type LandProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * Filter, which LandProject to fetch.
     */
    where: LandProjectWhereUniqueInput
  }

  /**
   * LandProject findUniqueOrThrow
   */
  export type LandProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * Filter, which LandProject to fetch.
     */
    where: LandProjectWhereUniqueInput
  }

  /**
   * LandProject findFirst
   */
  export type LandProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * Filter, which LandProject to fetch.
     */
    where?: LandProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandProjects to fetch.
     */
    orderBy?: LandProjectOrderByWithRelationInput | LandProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandProjects.
     */
    cursor?: LandProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandProjects.
     */
    distinct?: LandProjectScalarFieldEnum | LandProjectScalarFieldEnum[]
  }

  /**
   * LandProject findFirstOrThrow
   */
  export type LandProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * Filter, which LandProject to fetch.
     */
    where?: LandProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandProjects to fetch.
     */
    orderBy?: LandProjectOrderByWithRelationInput | LandProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandProjects.
     */
    cursor?: LandProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandProjects.
     */
    distinct?: LandProjectScalarFieldEnum | LandProjectScalarFieldEnum[]
  }

  /**
   * LandProject findMany
   */
  export type LandProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * Filter, which LandProjects to fetch.
     */
    where?: LandProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandProjects to fetch.
     */
    orderBy?: LandProjectOrderByWithRelationInput | LandProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LandProjects.
     */
    cursor?: LandProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandProjects.
     */
    skip?: number
    distinct?: LandProjectScalarFieldEnum | LandProjectScalarFieldEnum[]
  }

  /**
   * LandProject create
   */
  export type LandProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a LandProject.
     */
    data: XOR<LandProjectCreateInput, LandProjectUncheckedCreateInput>
  }

  /**
   * LandProject createMany
   */
  export type LandProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LandProjects.
     */
    data: LandProjectCreateManyInput | LandProjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LandProject update
   */
  export type LandProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a LandProject.
     */
    data: XOR<LandProjectUpdateInput, LandProjectUncheckedUpdateInput>
    /**
     * Choose, which LandProject to update.
     */
    where: LandProjectWhereUniqueInput
  }

  /**
   * LandProject updateMany
   */
  export type LandProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LandProjects.
     */
    data: XOR<LandProjectUpdateManyMutationInput, LandProjectUncheckedUpdateManyInput>
    /**
     * Filter which LandProjects to update
     */
    where?: LandProjectWhereInput
    /**
     * Limit how many LandProjects to update.
     */
    limit?: number
  }

  /**
   * LandProject upsert
   */
  export type LandProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the LandProject to update in case it exists.
     */
    where: LandProjectWhereUniqueInput
    /**
     * In case the LandProject found by the `where` argument doesn't exist, create a new LandProject with this data.
     */
    create: XOR<LandProjectCreateInput, LandProjectUncheckedCreateInput>
    /**
     * In case the LandProject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LandProjectUpdateInput, LandProjectUncheckedUpdateInput>
  }

  /**
   * LandProject delete
   */
  export type LandProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    /**
     * Filter which LandProject to delete.
     */
    where: LandProjectWhereUniqueInput
  }

  /**
   * LandProject deleteMany
   */
  export type LandProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandProjects to delete
     */
    where?: LandProjectWhereInput
    /**
     * Limit how many LandProjects to delete.
     */
    limit?: number
  }

  /**
   * LandProject.projectPartners
   */
  export type LandProject$projectPartnersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    where?: ProjectPartnerWhereInput
    orderBy?: ProjectPartnerOrderByWithRelationInput | ProjectPartnerOrderByWithRelationInput[]
    cursor?: ProjectPartnerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectPartnerScalarFieldEnum | ProjectPartnerScalarFieldEnum[]
  }

  /**
   * LandProject.projectExpenses
   */
  export type LandProject$projectExpensesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    where?: ProjectExpenseWhereInput
    orderBy?: ProjectExpenseOrderByWithRelationInput | ProjectExpenseOrderByWithRelationInput[]
    cursor?: ProjectExpenseWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectExpenseScalarFieldEnum | ProjectExpenseScalarFieldEnum[]
  }

  /**
   * LandProject.projectPlots
   */
  export type LandProject$projectPlotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    where?: ProjectPlotWhereInput
    orderBy?: ProjectPlotOrderByWithRelationInput | ProjectPlotOrderByWithRelationInput[]
    cursor?: ProjectPlotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectPlotScalarFieldEnum | ProjectPlotScalarFieldEnum[]
  }

  /**
   * LandProject.landSales
   */
  export type LandProject$landSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    where?: LandSaleWhereInput
    orderBy?: LandSaleOrderByWithRelationInput | LandSaleOrderByWithRelationInput[]
    cursor?: LandSaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LandSaleScalarFieldEnum | LandSaleScalarFieldEnum[]
  }

  /**
   * LandProject.profitDistributions
   */
  export type LandProject$profitDistributionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    where?: ProfitDistributionWhereInput
    orderBy?: ProfitDistributionOrderByWithRelationInput | ProfitDistributionOrderByWithRelationInput[]
    cursor?: ProfitDistributionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProfitDistributionScalarFieldEnum | ProfitDistributionScalarFieldEnum[]
  }

  /**
   * LandProject without action
   */
  export type LandProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
  }


  /**
   * Model ProjectPartner
   */

  export type AggregateProjectPartner = {
    _count: ProjectPartnerCountAggregateOutputType | null
    _avg: ProjectPartnerAvgAggregateOutputType | null
    _sum: ProjectPartnerSumAggregateOutputType | null
    _min: ProjectPartnerMinAggregateOutputType | null
    _max: ProjectPartnerMaxAggregateOutputType | null
  }

  export type ProjectPartnerAvgAggregateOutputType = {
    sharePercentage: Decimal | null
  }

  export type ProjectPartnerSumAggregateOutputType = {
    sharePercentage: Decimal | null
  }

  export type ProjectPartnerMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    partnerId: string | null
    sharePercentage: Decimal | null
  }

  export type ProjectPartnerMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    partnerId: string | null
    sharePercentage: Decimal | null
  }

  export type ProjectPartnerCountAggregateOutputType = {
    id: number
    projectId: number
    partnerId: number
    sharePercentage: number
    _all: number
  }


  export type ProjectPartnerAvgAggregateInputType = {
    sharePercentage?: true
  }

  export type ProjectPartnerSumAggregateInputType = {
    sharePercentage?: true
  }

  export type ProjectPartnerMinAggregateInputType = {
    id?: true
    projectId?: true
    partnerId?: true
    sharePercentage?: true
  }

  export type ProjectPartnerMaxAggregateInputType = {
    id?: true
    projectId?: true
    partnerId?: true
    sharePercentage?: true
  }

  export type ProjectPartnerCountAggregateInputType = {
    id?: true
    projectId?: true
    partnerId?: true
    sharePercentage?: true
    _all?: true
  }

  export type ProjectPartnerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectPartner to aggregate.
     */
    where?: ProjectPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectPartners to fetch.
     */
    orderBy?: ProjectPartnerOrderByWithRelationInput | ProjectPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectPartners
    **/
    _count?: true | ProjectPartnerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectPartnerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectPartnerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectPartnerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectPartnerMaxAggregateInputType
  }

  export type GetProjectPartnerAggregateType<T extends ProjectPartnerAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectPartner]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectPartner[P]>
      : GetScalarType<T[P], AggregateProjectPartner[P]>
  }




  export type ProjectPartnerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectPartnerWhereInput
    orderBy?: ProjectPartnerOrderByWithAggregationInput | ProjectPartnerOrderByWithAggregationInput[]
    by: ProjectPartnerScalarFieldEnum[] | ProjectPartnerScalarFieldEnum
    having?: ProjectPartnerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectPartnerCountAggregateInputType | true
    _avg?: ProjectPartnerAvgAggregateInputType
    _sum?: ProjectPartnerSumAggregateInputType
    _min?: ProjectPartnerMinAggregateInputType
    _max?: ProjectPartnerMaxAggregateInputType
  }

  export type ProjectPartnerGroupByOutputType = {
    id: string
    projectId: string
    partnerId: string
    sharePercentage: Decimal
    _count: ProjectPartnerCountAggregateOutputType | null
    _avg: ProjectPartnerAvgAggregateOutputType | null
    _sum: ProjectPartnerSumAggregateOutputType | null
    _min: ProjectPartnerMinAggregateOutputType | null
    _max: ProjectPartnerMaxAggregateOutputType | null
  }

  type GetProjectPartnerGroupByPayload<T extends ProjectPartnerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectPartnerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectPartnerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectPartnerGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectPartnerGroupByOutputType[P]>
        }
      >
    >


  export type ProjectPartnerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    partnerId?: boolean
    sharePercentage?: boolean
    project?: boolean | LandProjectDefaultArgs<ExtArgs>
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectPartner"]>



  export type ProjectPartnerSelectScalar = {
    id?: boolean
    projectId?: boolean
    partnerId?: boolean
    sharePercentage?: boolean
  }

  export type ProjectPartnerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "partnerId" | "sharePercentage", ExtArgs["result"]["projectPartner"]>
  export type ProjectPartnerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | LandProjectDefaultArgs<ExtArgs>
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }

  export type $ProjectPartnerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectPartner"
    objects: {
      project: Prisma.$LandProjectPayload<ExtArgs>
      partner: Prisma.$PartnerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      partnerId: string
      sharePercentage: Prisma.Decimal
    }, ExtArgs["result"]["projectPartner"]>
    composites: {}
  }

  type ProjectPartnerGetPayload<S extends boolean | null | undefined | ProjectPartnerDefaultArgs> = $Result.GetResult<Prisma.$ProjectPartnerPayload, S>

  type ProjectPartnerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectPartnerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectPartnerCountAggregateInputType | true
    }

  export interface ProjectPartnerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectPartner'], meta: { name: 'ProjectPartner' } }
    /**
     * Find zero or one ProjectPartner that matches the filter.
     * @param {ProjectPartnerFindUniqueArgs} args - Arguments to find a ProjectPartner
     * @example
     * // Get one ProjectPartner
     * const projectPartner = await prisma.projectPartner.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectPartnerFindUniqueArgs>(args: SelectSubset<T, ProjectPartnerFindUniqueArgs<ExtArgs>>): Prisma__ProjectPartnerClient<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectPartner that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectPartnerFindUniqueOrThrowArgs} args - Arguments to find a ProjectPartner
     * @example
     * // Get one ProjectPartner
     * const projectPartner = await prisma.projectPartner.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectPartnerFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectPartnerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectPartnerClient<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectPartner that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPartnerFindFirstArgs} args - Arguments to find a ProjectPartner
     * @example
     * // Get one ProjectPartner
     * const projectPartner = await prisma.projectPartner.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectPartnerFindFirstArgs>(args?: SelectSubset<T, ProjectPartnerFindFirstArgs<ExtArgs>>): Prisma__ProjectPartnerClient<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectPartner that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPartnerFindFirstOrThrowArgs} args - Arguments to find a ProjectPartner
     * @example
     * // Get one ProjectPartner
     * const projectPartner = await prisma.projectPartner.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectPartnerFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectPartnerFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectPartnerClient<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectPartners that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPartnerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectPartners
     * const projectPartners = await prisma.projectPartner.findMany()
     * 
     * // Get first 10 ProjectPartners
     * const projectPartners = await prisma.projectPartner.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectPartnerWithIdOnly = await prisma.projectPartner.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectPartnerFindManyArgs>(args?: SelectSubset<T, ProjectPartnerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectPartner.
     * @param {ProjectPartnerCreateArgs} args - Arguments to create a ProjectPartner.
     * @example
     * // Create one ProjectPartner
     * const ProjectPartner = await prisma.projectPartner.create({
     *   data: {
     *     // ... data to create a ProjectPartner
     *   }
     * })
     * 
     */
    create<T extends ProjectPartnerCreateArgs>(args: SelectSubset<T, ProjectPartnerCreateArgs<ExtArgs>>): Prisma__ProjectPartnerClient<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectPartners.
     * @param {ProjectPartnerCreateManyArgs} args - Arguments to create many ProjectPartners.
     * @example
     * // Create many ProjectPartners
     * const projectPartner = await prisma.projectPartner.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectPartnerCreateManyArgs>(args?: SelectSubset<T, ProjectPartnerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProjectPartner.
     * @param {ProjectPartnerDeleteArgs} args - Arguments to delete one ProjectPartner.
     * @example
     * // Delete one ProjectPartner
     * const ProjectPartner = await prisma.projectPartner.delete({
     *   where: {
     *     // ... filter to delete one ProjectPartner
     *   }
     * })
     * 
     */
    delete<T extends ProjectPartnerDeleteArgs>(args: SelectSubset<T, ProjectPartnerDeleteArgs<ExtArgs>>): Prisma__ProjectPartnerClient<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectPartner.
     * @param {ProjectPartnerUpdateArgs} args - Arguments to update one ProjectPartner.
     * @example
     * // Update one ProjectPartner
     * const projectPartner = await prisma.projectPartner.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectPartnerUpdateArgs>(args: SelectSubset<T, ProjectPartnerUpdateArgs<ExtArgs>>): Prisma__ProjectPartnerClient<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectPartners.
     * @param {ProjectPartnerDeleteManyArgs} args - Arguments to filter ProjectPartners to delete.
     * @example
     * // Delete a few ProjectPartners
     * const { count } = await prisma.projectPartner.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectPartnerDeleteManyArgs>(args?: SelectSubset<T, ProjectPartnerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectPartners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPartnerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectPartners
     * const projectPartner = await prisma.projectPartner.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectPartnerUpdateManyArgs>(args: SelectSubset<T, ProjectPartnerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProjectPartner.
     * @param {ProjectPartnerUpsertArgs} args - Arguments to update or create a ProjectPartner.
     * @example
     * // Update or create a ProjectPartner
     * const projectPartner = await prisma.projectPartner.upsert({
     *   create: {
     *     // ... data to create a ProjectPartner
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectPartner we want to update
     *   }
     * })
     */
    upsert<T extends ProjectPartnerUpsertArgs>(args: SelectSubset<T, ProjectPartnerUpsertArgs<ExtArgs>>): Prisma__ProjectPartnerClient<$Result.GetResult<Prisma.$ProjectPartnerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectPartners.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPartnerCountArgs} args - Arguments to filter ProjectPartners to count.
     * @example
     * // Count the number of ProjectPartners
     * const count = await prisma.projectPartner.count({
     *   where: {
     *     // ... the filter for the ProjectPartners we want to count
     *   }
     * })
    **/
    count<T extends ProjectPartnerCountArgs>(
      args?: Subset<T, ProjectPartnerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectPartnerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectPartner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPartnerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectPartnerAggregateArgs>(args: Subset<T, ProjectPartnerAggregateArgs>): Prisma.PrismaPromise<GetProjectPartnerAggregateType<T>>

    /**
     * Group by ProjectPartner.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPartnerGroupByArgs} args - Group by arguments.
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
      T extends ProjectPartnerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectPartnerGroupByArgs['orderBy'] }
        : { orderBy?: ProjectPartnerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectPartnerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectPartnerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectPartner model
   */
  readonly fields: ProjectPartnerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectPartner.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectPartnerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends LandProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LandProjectDefaultArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    partner<T extends PartnerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PartnerDefaultArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProjectPartner model
   */
  interface ProjectPartnerFieldRefs {
    readonly id: FieldRef<"ProjectPartner", 'String'>
    readonly projectId: FieldRef<"ProjectPartner", 'String'>
    readonly partnerId: FieldRef<"ProjectPartner", 'String'>
    readonly sharePercentage: FieldRef<"ProjectPartner", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * ProjectPartner findUnique
   */
  export type ProjectPartnerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPartner to fetch.
     */
    where: ProjectPartnerWhereUniqueInput
  }

  /**
   * ProjectPartner findUniqueOrThrow
   */
  export type ProjectPartnerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPartner to fetch.
     */
    where: ProjectPartnerWhereUniqueInput
  }

  /**
   * ProjectPartner findFirst
   */
  export type ProjectPartnerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPartner to fetch.
     */
    where?: ProjectPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectPartners to fetch.
     */
    orderBy?: ProjectPartnerOrderByWithRelationInput | ProjectPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectPartners.
     */
    cursor?: ProjectPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectPartners.
     */
    distinct?: ProjectPartnerScalarFieldEnum | ProjectPartnerScalarFieldEnum[]
  }

  /**
   * ProjectPartner findFirstOrThrow
   */
  export type ProjectPartnerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPartner to fetch.
     */
    where?: ProjectPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectPartners to fetch.
     */
    orderBy?: ProjectPartnerOrderByWithRelationInput | ProjectPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectPartners.
     */
    cursor?: ProjectPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectPartners.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectPartners.
     */
    distinct?: ProjectPartnerScalarFieldEnum | ProjectPartnerScalarFieldEnum[]
  }

  /**
   * ProjectPartner findMany
   */
  export type ProjectPartnerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPartners to fetch.
     */
    where?: ProjectPartnerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectPartners to fetch.
     */
    orderBy?: ProjectPartnerOrderByWithRelationInput | ProjectPartnerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectPartners.
     */
    cursor?: ProjectPartnerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectPartners from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectPartners.
     */
    skip?: number
    distinct?: ProjectPartnerScalarFieldEnum | ProjectPartnerScalarFieldEnum[]
  }

  /**
   * ProjectPartner create
   */
  export type ProjectPartnerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectPartner.
     */
    data: XOR<ProjectPartnerCreateInput, ProjectPartnerUncheckedCreateInput>
  }

  /**
   * ProjectPartner createMany
   */
  export type ProjectPartnerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectPartners.
     */
    data: ProjectPartnerCreateManyInput | ProjectPartnerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectPartner update
   */
  export type ProjectPartnerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectPartner.
     */
    data: XOR<ProjectPartnerUpdateInput, ProjectPartnerUncheckedUpdateInput>
    /**
     * Choose, which ProjectPartner to update.
     */
    where: ProjectPartnerWhereUniqueInput
  }

  /**
   * ProjectPartner updateMany
   */
  export type ProjectPartnerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectPartners.
     */
    data: XOR<ProjectPartnerUpdateManyMutationInput, ProjectPartnerUncheckedUpdateManyInput>
    /**
     * Filter which ProjectPartners to update
     */
    where?: ProjectPartnerWhereInput
    /**
     * Limit how many ProjectPartners to update.
     */
    limit?: number
  }

  /**
   * ProjectPartner upsert
   */
  export type ProjectPartnerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectPartner to update in case it exists.
     */
    where: ProjectPartnerWhereUniqueInput
    /**
     * In case the ProjectPartner found by the `where` argument doesn't exist, create a new ProjectPartner with this data.
     */
    create: XOR<ProjectPartnerCreateInput, ProjectPartnerUncheckedCreateInput>
    /**
     * In case the ProjectPartner was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectPartnerUpdateInput, ProjectPartnerUncheckedUpdateInput>
  }

  /**
   * ProjectPartner delete
   */
  export type ProjectPartnerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
    /**
     * Filter which ProjectPartner to delete.
     */
    where: ProjectPartnerWhereUniqueInput
  }

  /**
   * ProjectPartner deleteMany
   */
  export type ProjectPartnerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectPartners to delete
     */
    where?: ProjectPartnerWhereInput
    /**
     * Limit how many ProjectPartners to delete.
     */
    limit?: number
  }

  /**
   * ProjectPartner without action
   */
  export type ProjectPartnerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPartner
     */
    select?: ProjectPartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPartner
     */
    omit?: ProjectPartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPartnerInclude<ExtArgs> | null
  }


  /**
   * Model TreasuryLedger
   */

  export type AggregateTreasuryLedger = {
    _count: TreasuryLedgerCountAggregateOutputType | null
    _avg: TreasuryLedgerAvgAggregateOutputType | null
    _sum: TreasuryLedgerSumAggregateOutputType | null
    _min: TreasuryLedgerMinAggregateOutputType | null
    _max: TreasuryLedgerMaxAggregateOutputType | null
  }

  export type TreasuryLedgerAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type TreasuryLedgerSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type TreasuryLedgerMinAggregateOutputType = {
    id: string | null
    txnDate: Date | null
    accountType: string | null
    bankAccountId: string | null
    flowType: string | null
    amount: Decimal | null
    purpose: string | null
    referenceType: string | null
    referenceId: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type TreasuryLedgerMaxAggregateOutputType = {
    id: string | null
    txnDate: Date | null
    accountType: string | null
    bankAccountId: string | null
    flowType: string | null
    amount: Decimal | null
    purpose: string | null
    referenceType: string | null
    referenceId: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type TreasuryLedgerCountAggregateOutputType = {
    id: number
    txnDate: number
    accountType: number
    bankAccountId: number
    flowType: number
    amount: number
    purpose: number
    referenceType: number
    referenceId: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type TreasuryLedgerAvgAggregateInputType = {
    amount?: true
  }

  export type TreasuryLedgerSumAggregateInputType = {
    amount?: true
  }

  export type TreasuryLedgerMinAggregateInputType = {
    id?: true
    txnDate?: true
    accountType?: true
    bankAccountId?: true
    flowType?: true
    amount?: true
    purpose?: true
    referenceType?: true
    referenceId?: true
    createdBy?: true
    createdAt?: true
  }

  export type TreasuryLedgerMaxAggregateInputType = {
    id?: true
    txnDate?: true
    accountType?: true
    bankAccountId?: true
    flowType?: true
    amount?: true
    purpose?: true
    referenceType?: true
    referenceId?: true
    createdBy?: true
    createdAt?: true
  }

  export type TreasuryLedgerCountAggregateInputType = {
    id?: true
    txnDate?: true
    accountType?: true
    bankAccountId?: true
    flowType?: true
    amount?: true
    purpose?: true
    referenceType?: true
    referenceId?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type TreasuryLedgerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TreasuryLedger to aggregate.
     */
    where?: TreasuryLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreasuryLedgers to fetch.
     */
    orderBy?: TreasuryLedgerOrderByWithRelationInput | TreasuryLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TreasuryLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreasuryLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreasuryLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TreasuryLedgers
    **/
    _count?: true | TreasuryLedgerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TreasuryLedgerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TreasuryLedgerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TreasuryLedgerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TreasuryLedgerMaxAggregateInputType
  }

  export type GetTreasuryLedgerAggregateType<T extends TreasuryLedgerAggregateArgs> = {
        [P in keyof T & keyof AggregateTreasuryLedger]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTreasuryLedger[P]>
      : GetScalarType<T[P], AggregateTreasuryLedger[P]>
  }




  export type TreasuryLedgerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TreasuryLedgerWhereInput
    orderBy?: TreasuryLedgerOrderByWithAggregationInput | TreasuryLedgerOrderByWithAggregationInput[]
    by: TreasuryLedgerScalarFieldEnum[] | TreasuryLedgerScalarFieldEnum
    having?: TreasuryLedgerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TreasuryLedgerCountAggregateInputType | true
    _avg?: TreasuryLedgerAvgAggregateInputType
    _sum?: TreasuryLedgerSumAggregateInputType
    _min?: TreasuryLedgerMinAggregateInputType
    _max?: TreasuryLedgerMaxAggregateInputType
  }

  export type TreasuryLedgerGroupByOutputType = {
    id: string
    txnDate: Date
    accountType: string
    bankAccountId: string | null
    flowType: string
    amount: Decimal
    purpose: string
    referenceType: string
    referenceId: string | null
    createdBy: string
    createdAt: Date
    _count: TreasuryLedgerCountAggregateOutputType | null
    _avg: TreasuryLedgerAvgAggregateOutputType | null
    _sum: TreasuryLedgerSumAggregateOutputType | null
    _min: TreasuryLedgerMinAggregateOutputType | null
    _max: TreasuryLedgerMaxAggregateOutputType | null
  }

  type GetTreasuryLedgerGroupByPayload<T extends TreasuryLedgerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TreasuryLedgerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TreasuryLedgerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TreasuryLedgerGroupByOutputType[P]>
            : GetScalarType<T[P], TreasuryLedgerGroupByOutputType[P]>
        }
      >
    >


  export type TreasuryLedgerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    txnDate?: boolean
    accountType?: boolean
    bankAccountId?: boolean
    flowType?: boolean
    amount?: boolean
    purpose?: boolean
    referenceType?: boolean
    referenceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
    bankAccount?: boolean | TreasuryLedger$bankAccountArgs<ExtArgs>
  }, ExtArgs["result"]["treasuryLedger"]>



  export type TreasuryLedgerSelectScalar = {
    id?: boolean
    txnDate?: boolean
    accountType?: boolean
    bankAccountId?: boolean
    flowType?: boolean
    amount?: boolean
    purpose?: boolean
    referenceType?: boolean
    referenceId?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type TreasuryLedgerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "txnDate" | "accountType" | "bankAccountId" | "flowType" | "amount" | "purpose" | "referenceType" | "referenceId" | "createdBy" | "createdAt", ExtArgs["result"]["treasuryLedger"]>
  export type TreasuryLedgerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bankAccount?: boolean | TreasuryLedger$bankAccountArgs<ExtArgs>
  }

  export type $TreasuryLedgerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TreasuryLedger"
    objects: {
      bankAccount: Prisma.$BankAccountPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      txnDate: Date
      accountType: string
      bankAccountId: string | null
      flowType: string
      amount: Prisma.Decimal
      purpose: string
      referenceType: string
      referenceId: string | null
      createdBy: string
      createdAt: Date
    }, ExtArgs["result"]["treasuryLedger"]>
    composites: {}
  }

  type TreasuryLedgerGetPayload<S extends boolean | null | undefined | TreasuryLedgerDefaultArgs> = $Result.GetResult<Prisma.$TreasuryLedgerPayload, S>

  type TreasuryLedgerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TreasuryLedgerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TreasuryLedgerCountAggregateInputType | true
    }

  export interface TreasuryLedgerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TreasuryLedger'], meta: { name: 'TreasuryLedger' } }
    /**
     * Find zero or one TreasuryLedger that matches the filter.
     * @param {TreasuryLedgerFindUniqueArgs} args - Arguments to find a TreasuryLedger
     * @example
     * // Get one TreasuryLedger
     * const treasuryLedger = await prisma.treasuryLedger.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TreasuryLedgerFindUniqueArgs>(args: SelectSubset<T, TreasuryLedgerFindUniqueArgs<ExtArgs>>): Prisma__TreasuryLedgerClient<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TreasuryLedger that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TreasuryLedgerFindUniqueOrThrowArgs} args - Arguments to find a TreasuryLedger
     * @example
     * // Get one TreasuryLedger
     * const treasuryLedger = await prisma.treasuryLedger.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TreasuryLedgerFindUniqueOrThrowArgs>(args: SelectSubset<T, TreasuryLedgerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TreasuryLedgerClient<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TreasuryLedger that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreasuryLedgerFindFirstArgs} args - Arguments to find a TreasuryLedger
     * @example
     * // Get one TreasuryLedger
     * const treasuryLedger = await prisma.treasuryLedger.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TreasuryLedgerFindFirstArgs>(args?: SelectSubset<T, TreasuryLedgerFindFirstArgs<ExtArgs>>): Prisma__TreasuryLedgerClient<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TreasuryLedger that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreasuryLedgerFindFirstOrThrowArgs} args - Arguments to find a TreasuryLedger
     * @example
     * // Get one TreasuryLedger
     * const treasuryLedger = await prisma.treasuryLedger.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TreasuryLedgerFindFirstOrThrowArgs>(args?: SelectSubset<T, TreasuryLedgerFindFirstOrThrowArgs<ExtArgs>>): Prisma__TreasuryLedgerClient<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TreasuryLedgers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreasuryLedgerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TreasuryLedgers
     * const treasuryLedgers = await prisma.treasuryLedger.findMany()
     * 
     * // Get first 10 TreasuryLedgers
     * const treasuryLedgers = await prisma.treasuryLedger.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const treasuryLedgerWithIdOnly = await prisma.treasuryLedger.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TreasuryLedgerFindManyArgs>(args?: SelectSubset<T, TreasuryLedgerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TreasuryLedger.
     * @param {TreasuryLedgerCreateArgs} args - Arguments to create a TreasuryLedger.
     * @example
     * // Create one TreasuryLedger
     * const TreasuryLedger = await prisma.treasuryLedger.create({
     *   data: {
     *     // ... data to create a TreasuryLedger
     *   }
     * })
     * 
     */
    create<T extends TreasuryLedgerCreateArgs>(args: SelectSubset<T, TreasuryLedgerCreateArgs<ExtArgs>>): Prisma__TreasuryLedgerClient<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TreasuryLedgers.
     * @param {TreasuryLedgerCreateManyArgs} args - Arguments to create many TreasuryLedgers.
     * @example
     * // Create many TreasuryLedgers
     * const treasuryLedger = await prisma.treasuryLedger.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TreasuryLedgerCreateManyArgs>(args?: SelectSubset<T, TreasuryLedgerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TreasuryLedger.
     * @param {TreasuryLedgerDeleteArgs} args - Arguments to delete one TreasuryLedger.
     * @example
     * // Delete one TreasuryLedger
     * const TreasuryLedger = await prisma.treasuryLedger.delete({
     *   where: {
     *     // ... filter to delete one TreasuryLedger
     *   }
     * })
     * 
     */
    delete<T extends TreasuryLedgerDeleteArgs>(args: SelectSubset<T, TreasuryLedgerDeleteArgs<ExtArgs>>): Prisma__TreasuryLedgerClient<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TreasuryLedger.
     * @param {TreasuryLedgerUpdateArgs} args - Arguments to update one TreasuryLedger.
     * @example
     * // Update one TreasuryLedger
     * const treasuryLedger = await prisma.treasuryLedger.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TreasuryLedgerUpdateArgs>(args: SelectSubset<T, TreasuryLedgerUpdateArgs<ExtArgs>>): Prisma__TreasuryLedgerClient<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TreasuryLedgers.
     * @param {TreasuryLedgerDeleteManyArgs} args - Arguments to filter TreasuryLedgers to delete.
     * @example
     * // Delete a few TreasuryLedgers
     * const { count } = await prisma.treasuryLedger.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TreasuryLedgerDeleteManyArgs>(args?: SelectSubset<T, TreasuryLedgerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TreasuryLedgers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreasuryLedgerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TreasuryLedgers
     * const treasuryLedger = await prisma.treasuryLedger.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TreasuryLedgerUpdateManyArgs>(args: SelectSubset<T, TreasuryLedgerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TreasuryLedger.
     * @param {TreasuryLedgerUpsertArgs} args - Arguments to update or create a TreasuryLedger.
     * @example
     * // Update or create a TreasuryLedger
     * const treasuryLedger = await prisma.treasuryLedger.upsert({
     *   create: {
     *     // ... data to create a TreasuryLedger
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TreasuryLedger we want to update
     *   }
     * })
     */
    upsert<T extends TreasuryLedgerUpsertArgs>(args: SelectSubset<T, TreasuryLedgerUpsertArgs<ExtArgs>>): Prisma__TreasuryLedgerClient<$Result.GetResult<Prisma.$TreasuryLedgerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TreasuryLedgers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreasuryLedgerCountArgs} args - Arguments to filter TreasuryLedgers to count.
     * @example
     * // Count the number of TreasuryLedgers
     * const count = await prisma.treasuryLedger.count({
     *   where: {
     *     // ... the filter for the TreasuryLedgers we want to count
     *   }
     * })
    **/
    count<T extends TreasuryLedgerCountArgs>(
      args?: Subset<T, TreasuryLedgerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TreasuryLedgerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TreasuryLedger.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreasuryLedgerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TreasuryLedgerAggregateArgs>(args: Subset<T, TreasuryLedgerAggregateArgs>): Prisma.PrismaPromise<GetTreasuryLedgerAggregateType<T>>

    /**
     * Group by TreasuryLedger.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TreasuryLedgerGroupByArgs} args - Group by arguments.
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
      T extends TreasuryLedgerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TreasuryLedgerGroupByArgs['orderBy'] }
        : { orderBy?: TreasuryLedgerGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TreasuryLedgerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTreasuryLedgerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TreasuryLedger model
   */
  readonly fields: TreasuryLedgerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TreasuryLedger.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TreasuryLedgerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    bankAccount<T extends TreasuryLedger$bankAccountArgs<ExtArgs> = {}>(args?: Subset<T, TreasuryLedger$bankAccountArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TreasuryLedger model
   */
  interface TreasuryLedgerFieldRefs {
    readonly id: FieldRef<"TreasuryLedger", 'String'>
    readonly txnDate: FieldRef<"TreasuryLedger", 'DateTime'>
    readonly accountType: FieldRef<"TreasuryLedger", 'String'>
    readonly bankAccountId: FieldRef<"TreasuryLedger", 'String'>
    readonly flowType: FieldRef<"TreasuryLedger", 'String'>
    readonly amount: FieldRef<"TreasuryLedger", 'Decimal'>
    readonly purpose: FieldRef<"TreasuryLedger", 'String'>
    readonly referenceType: FieldRef<"TreasuryLedger", 'String'>
    readonly referenceId: FieldRef<"TreasuryLedger", 'String'>
    readonly createdBy: FieldRef<"TreasuryLedger", 'String'>
    readonly createdAt: FieldRef<"TreasuryLedger", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TreasuryLedger findUnique
   */
  export type TreasuryLedgerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * Filter, which TreasuryLedger to fetch.
     */
    where: TreasuryLedgerWhereUniqueInput
  }

  /**
   * TreasuryLedger findUniqueOrThrow
   */
  export type TreasuryLedgerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * Filter, which TreasuryLedger to fetch.
     */
    where: TreasuryLedgerWhereUniqueInput
  }

  /**
   * TreasuryLedger findFirst
   */
  export type TreasuryLedgerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * Filter, which TreasuryLedger to fetch.
     */
    where?: TreasuryLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreasuryLedgers to fetch.
     */
    orderBy?: TreasuryLedgerOrderByWithRelationInput | TreasuryLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TreasuryLedgers.
     */
    cursor?: TreasuryLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreasuryLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreasuryLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TreasuryLedgers.
     */
    distinct?: TreasuryLedgerScalarFieldEnum | TreasuryLedgerScalarFieldEnum[]
  }

  /**
   * TreasuryLedger findFirstOrThrow
   */
  export type TreasuryLedgerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * Filter, which TreasuryLedger to fetch.
     */
    where?: TreasuryLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreasuryLedgers to fetch.
     */
    orderBy?: TreasuryLedgerOrderByWithRelationInput | TreasuryLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TreasuryLedgers.
     */
    cursor?: TreasuryLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreasuryLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreasuryLedgers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TreasuryLedgers.
     */
    distinct?: TreasuryLedgerScalarFieldEnum | TreasuryLedgerScalarFieldEnum[]
  }

  /**
   * TreasuryLedger findMany
   */
  export type TreasuryLedgerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * Filter, which TreasuryLedgers to fetch.
     */
    where?: TreasuryLedgerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TreasuryLedgers to fetch.
     */
    orderBy?: TreasuryLedgerOrderByWithRelationInput | TreasuryLedgerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TreasuryLedgers.
     */
    cursor?: TreasuryLedgerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TreasuryLedgers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TreasuryLedgers.
     */
    skip?: number
    distinct?: TreasuryLedgerScalarFieldEnum | TreasuryLedgerScalarFieldEnum[]
  }

  /**
   * TreasuryLedger create
   */
  export type TreasuryLedgerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * The data needed to create a TreasuryLedger.
     */
    data: XOR<TreasuryLedgerCreateInput, TreasuryLedgerUncheckedCreateInput>
  }

  /**
   * TreasuryLedger createMany
   */
  export type TreasuryLedgerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TreasuryLedgers.
     */
    data: TreasuryLedgerCreateManyInput | TreasuryLedgerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TreasuryLedger update
   */
  export type TreasuryLedgerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * The data needed to update a TreasuryLedger.
     */
    data: XOR<TreasuryLedgerUpdateInput, TreasuryLedgerUncheckedUpdateInput>
    /**
     * Choose, which TreasuryLedger to update.
     */
    where: TreasuryLedgerWhereUniqueInput
  }

  /**
   * TreasuryLedger updateMany
   */
  export type TreasuryLedgerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TreasuryLedgers.
     */
    data: XOR<TreasuryLedgerUpdateManyMutationInput, TreasuryLedgerUncheckedUpdateManyInput>
    /**
     * Filter which TreasuryLedgers to update
     */
    where?: TreasuryLedgerWhereInput
    /**
     * Limit how many TreasuryLedgers to update.
     */
    limit?: number
  }

  /**
   * TreasuryLedger upsert
   */
  export type TreasuryLedgerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * The filter to search for the TreasuryLedger to update in case it exists.
     */
    where: TreasuryLedgerWhereUniqueInput
    /**
     * In case the TreasuryLedger found by the `where` argument doesn't exist, create a new TreasuryLedger with this data.
     */
    create: XOR<TreasuryLedgerCreateInput, TreasuryLedgerUncheckedCreateInput>
    /**
     * In case the TreasuryLedger was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TreasuryLedgerUpdateInput, TreasuryLedgerUncheckedUpdateInput>
  }

  /**
   * TreasuryLedger delete
   */
  export type TreasuryLedgerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
    /**
     * Filter which TreasuryLedger to delete.
     */
    where: TreasuryLedgerWhereUniqueInput
  }

  /**
   * TreasuryLedger deleteMany
   */
  export type TreasuryLedgerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TreasuryLedgers to delete
     */
    where?: TreasuryLedgerWhereInput
    /**
     * Limit how many TreasuryLedgers to delete.
     */
    limit?: number
  }

  /**
   * TreasuryLedger.bankAccount
   */
  export type TreasuryLedger$bankAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    where?: BankAccountWhereInput
  }

  /**
   * TreasuryLedger without action
   */
  export type TreasuryLedgerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TreasuryLedger
     */
    select?: TreasuryLedgerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TreasuryLedger
     */
    omit?: TreasuryLedgerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TreasuryLedgerInclude<ExtArgs> | null
  }


  /**
   * Model PartnerTransaction
   */

  export type AggregatePartnerTransaction = {
    _count: PartnerTransactionCountAggregateOutputType | null
    _avg: PartnerTransactionAvgAggregateOutputType | null
    _sum: PartnerTransactionSumAggregateOutputType | null
    _min: PartnerTransactionMinAggregateOutputType | null
    _max: PartnerTransactionMaxAggregateOutputType | null
  }

  export type PartnerTransactionAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type PartnerTransactionSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type PartnerTransactionMinAggregateOutputType = {
    id: string | null
    partnerId: string | null
    txnType: string | null
    amount: Decimal | null
    txnDate: Date | null
    referenceId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type PartnerTransactionMaxAggregateOutputType = {
    id: string | null
    partnerId: string | null
    txnType: string | null
    amount: Decimal | null
    txnDate: Date | null
    referenceId: string | null
    notes: string | null
    createdAt: Date | null
  }

  export type PartnerTransactionCountAggregateOutputType = {
    id: number
    partnerId: number
    txnType: number
    amount: number
    txnDate: number
    referenceId: number
    notes: number
    createdAt: number
    _all: number
  }


  export type PartnerTransactionAvgAggregateInputType = {
    amount?: true
  }

  export type PartnerTransactionSumAggregateInputType = {
    amount?: true
  }

  export type PartnerTransactionMinAggregateInputType = {
    id?: true
    partnerId?: true
    txnType?: true
    amount?: true
    txnDate?: true
    referenceId?: true
    notes?: true
    createdAt?: true
  }

  export type PartnerTransactionMaxAggregateInputType = {
    id?: true
    partnerId?: true
    txnType?: true
    amount?: true
    txnDate?: true
    referenceId?: true
    notes?: true
    createdAt?: true
  }

  export type PartnerTransactionCountAggregateInputType = {
    id?: true
    partnerId?: true
    txnType?: true
    amount?: true
    txnDate?: true
    referenceId?: true
    notes?: true
    createdAt?: true
    _all?: true
  }

  export type PartnerTransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PartnerTransaction to aggregate.
     */
    where?: PartnerTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PartnerTransactions to fetch.
     */
    orderBy?: PartnerTransactionOrderByWithRelationInput | PartnerTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PartnerTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PartnerTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PartnerTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PartnerTransactions
    **/
    _count?: true | PartnerTransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PartnerTransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PartnerTransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PartnerTransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PartnerTransactionMaxAggregateInputType
  }

  export type GetPartnerTransactionAggregateType<T extends PartnerTransactionAggregateArgs> = {
        [P in keyof T & keyof AggregatePartnerTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePartnerTransaction[P]>
      : GetScalarType<T[P], AggregatePartnerTransaction[P]>
  }




  export type PartnerTransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PartnerTransactionWhereInput
    orderBy?: PartnerTransactionOrderByWithAggregationInput | PartnerTransactionOrderByWithAggregationInput[]
    by: PartnerTransactionScalarFieldEnum[] | PartnerTransactionScalarFieldEnum
    having?: PartnerTransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PartnerTransactionCountAggregateInputType | true
    _avg?: PartnerTransactionAvgAggregateInputType
    _sum?: PartnerTransactionSumAggregateInputType
    _min?: PartnerTransactionMinAggregateInputType
    _max?: PartnerTransactionMaxAggregateInputType
  }

  export type PartnerTransactionGroupByOutputType = {
    id: string
    partnerId: string
    txnType: string
    amount: Decimal
    txnDate: Date
    referenceId: string | null
    notes: string | null
    createdAt: Date
    _count: PartnerTransactionCountAggregateOutputType | null
    _avg: PartnerTransactionAvgAggregateOutputType | null
    _sum: PartnerTransactionSumAggregateOutputType | null
    _min: PartnerTransactionMinAggregateOutputType | null
    _max: PartnerTransactionMaxAggregateOutputType | null
  }

  type GetPartnerTransactionGroupByPayload<T extends PartnerTransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PartnerTransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PartnerTransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PartnerTransactionGroupByOutputType[P]>
            : GetScalarType<T[P], PartnerTransactionGroupByOutputType[P]>
        }
      >
    >


  export type PartnerTransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    partnerId?: boolean
    txnType?: boolean
    amount?: boolean
    txnDate?: boolean
    referenceId?: boolean
    notes?: boolean
    createdAt?: boolean
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["partnerTransaction"]>



  export type PartnerTransactionSelectScalar = {
    id?: boolean
    partnerId?: boolean
    txnType?: boolean
    amount?: boolean
    txnDate?: boolean
    referenceId?: boolean
    notes?: boolean
    createdAt?: boolean
  }

  export type PartnerTransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "partnerId" | "txnType" | "amount" | "txnDate" | "referenceId" | "notes" | "createdAt", ExtArgs["result"]["partnerTransaction"]>
  export type PartnerTransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }

  export type $PartnerTransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PartnerTransaction"
    objects: {
      partner: Prisma.$PartnerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      partnerId: string
      txnType: string
      amount: Prisma.Decimal
      txnDate: Date
      referenceId: string | null
      notes: string | null
      createdAt: Date
    }, ExtArgs["result"]["partnerTransaction"]>
    composites: {}
  }

  type PartnerTransactionGetPayload<S extends boolean | null | undefined | PartnerTransactionDefaultArgs> = $Result.GetResult<Prisma.$PartnerTransactionPayload, S>

  type PartnerTransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PartnerTransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PartnerTransactionCountAggregateInputType | true
    }

  export interface PartnerTransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PartnerTransaction'], meta: { name: 'PartnerTransaction' } }
    /**
     * Find zero or one PartnerTransaction that matches the filter.
     * @param {PartnerTransactionFindUniqueArgs} args - Arguments to find a PartnerTransaction
     * @example
     * // Get one PartnerTransaction
     * const partnerTransaction = await prisma.partnerTransaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PartnerTransactionFindUniqueArgs>(args: SelectSubset<T, PartnerTransactionFindUniqueArgs<ExtArgs>>): Prisma__PartnerTransactionClient<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PartnerTransaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PartnerTransactionFindUniqueOrThrowArgs} args - Arguments to find a PartnerTransaction
     * @example
     * // Get one PartnerTransaction
     * const partnerTransaction = await prisma.partnerTransaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PartnerTransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, PartnerTransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PartnerTransactionClient<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PartnerTransaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerTransactionFindFirstArgs} args - Arguments to find a PartnerTransaction
     * @example
     * // Get one PartnerTransaction
     * const partnerTransaction = await prisma.partnerTransaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PartnerTransactionFindFirstArgs>(args?: SelectSubset<T, PartnerTransactionFindFirstArgs<ExtArgs>>): Prisma__PartnerTransactionClient<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PartnerTransaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerTransactionFindFirstOrThrowArgs} args - Arguments to find a PartnerTransaction
     * @example
     * // Get one PartnerTransaction
     * const partnerTransaction = await prisma.partnerTransaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PartnerTransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, PartnerTransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PartnerTransactionClient<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PartnerTransactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerTransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PartnerTransactions
     * const partnerTransactions = await prisma.partnerTransaction.findMany()
     * 
     * // Get first 10 PartnerTransactions
     * const partnerTransactions = await prisma.partnerTransaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const partnerTransactionWithIdOnly = await prisma.partnerTransaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PartnerTransactionFindManyArgs>(args?: SelectSubset<T, PartnerTransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PartnerTransaction.
     * @param {PartnerTransactionCreateArgs} args - Arguments to create a PartnerTransaction.
     * @example
     * // Create one PartnerTransaction
     * const PartnerTransaction = await prisma.partnerTransaction.create({
     *   data: {
     *     // ... data to create a PartnerTransaction
     *   }
     * })
     * 
     */
    create<T extends PartnerTransactionCreateArgs>(args: SelectSubset<T, PartnerTransactionCreateArgs<ExtArgs>>): Prisma__PartnerTransactionClient<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PartnerTransactions.
     * @param {PartnerTransactionCreateManyArgs} args - Arguments to create many PartnerTransactions.
     * @example
     * // Create many PartnerTransactions
     * const partnerTransaction = await prisma.partnerTransaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PartnerTransactionCreateManyArgs>(args?: SelectSubset<T, PartnerTransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PartnerTransaction.
     * @param {PartnerTransactionDeleteArgs} args - Arguments to delete one PartnerTransaction.
     * @example
     * // Delete one PartnerTransaction
     * const PartnerTransaction = await prisma.partnerTransaction.delete({
     *   where: {
     *     // ... filter to delete one PartnerTransaction
     *   }
     * })
     * 
     */
    delete<T extends PartnerTransactionDeleteArgs>(args: SelectSubset<T, PartnerTransactionDeleteArgs<ExtArgs>>): Prisma__PartnerTransactionClient<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PartnerTransaction.
     * @param {PartnerTransactionUpdateArgs} args - Arguments to update one PartnerTransaction.
     * @example
     * // Update one PartnerTransaction
     * const partnerTransaction = await prisma.partnerTransaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PartnerTransactionUpdateArgs>(args: SelectSubset<T, PartnerTransactionUpdateArgs<ExtArgs>>): Prisma__PartnerTransactionClient<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PartnerTransactions.
     * @param {PartnerTransactionDeleteManyArgs} args - Arguments to filter PartnerTransactions to delete.
     * @example
     * // Delete a few PartnerTransactions
     * const { count } = await prisma.partnerTransaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PartnerTransactionDeleteManyArgs>(args?: SelectSubset<T, PartnerTransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PartnerTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerTransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PartnerTransactions
     * const partnerTransaction = await prisma.partnerTransaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PartnerTransactionUpdateManyArgs>(args: SelectSubset<T, PartnerTransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PartnerTransaction.
     * @param {PartnerTransactionUpsertArgs} args - Arguments to update or create a PartnerTransaction.
     * @example
     * // Update or create a PartnerTransaction
     * const partnerTransaction = await prisma.partnerTransaction.upsert({
     *   create: {
     *     // ... data to create a PartnerTransaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PartnerTransaction we want to update
     *   }
     * })
     */
    upsert<T extends PartnerTransactionUpsertArgs>(args: SelectSubset<T, PartnerTransactionUpsertArgs<ExtArgs>>): Prisma__PartnerTransactionClient<$Result.GetResult<Prisma.$PartnerTransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PartnerTransactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerTransactionCountArgs} args - Arguments to filter PartnerTransactions to count.
     * @example
     * // Count the number of PartnerTransactions
     * const count = await prisma.partnerTransaction.count({
     *   where: {
     *     // ... the filter for the PartnerTransactions we want to count
     *   }
     * })
    **/
    count<T extends PartnerTransactionCountArgs>(
      args?: Subset<T, PartnerTransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PartnerTransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PartnerTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerTransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PartnerTransactionAggregateArgs>(args: Subset<T, PartnerTransactionAggregateArgs>): Prisma.PrismaPromise<GetPartnerTransactionAggregateType<T>>

    /**
     * Group by PartnerTransaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartnerTransactionGroupByArgs} args - Group by arguments.
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
      T extends PartnerTransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PartnerTransactionGroupByArgs['orderBy'] }
        : { orderBy?: PartnerTransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PartnerTransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartnerTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PartnerTransaction model
   */
  readonly fields: PartnerTransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PartnerTransaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PartnerTransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    partner<T extends PartnerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PartnerDefaultArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PartnerTransaction model
   */
  interface PartnerTransactionFieldRefs {
    readonly id: FieldRef<"PartnerTransaction", 'String'>
    readonly partnerId: FieldRef<"PartnerTransaction", 'String'>
    readonly txnType: FieldRef<"PartnerTransaction", 'String'>
    readonly amount: FieldRef<"PartnerTransaction", 'Decimal'>
    readonly txnDate: FieldRef<"PartnerTransaction", 'DateTime'>
    readonly referenceId: FieldRef<"PartnerTransaction", 'String'>
    readonly notes: FieldRef<"PartnerTransaction", 'String'>
    readonly createdAt: FieldRef<"PartnerTransaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PartnerTransaction findUnique
   */
  export type PartnerTransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PartnerTransaction to fetch.
     */
    where: PartnerTransactionWhereUniqueInput
  }

  /**
   * PartnerTransaction findUniqueOrThrow
   */
  export type PartnerTransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PartnerTransaction to fetch.
     */
    where: PartnerTransactionWhereUniqueInput
  }

  /**
   * PartnerTransaction findFirst
   */
  export type PartnerTransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PartnerTransaction to fetch.
     */
    where?: PartnerTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PartnerTransactions to fetch.
     */
    orderBy?: PartnerTransactionOrderByWithRelationInput | PartnerTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PartnerTransactions.
     */
    cursor?: PartnerTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PartnerTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PartnerTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PartnerTransactions.
     */
    distinct?: PartnerTransactionScalarFieldEnum | PartnerTransactionScalarFieldEnum[]
  }

  /**
   * PartnerTransaction findFirstOrThrow
   */
  export type PartnerTransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PartnerTransaction to fetch.
     */
    where?: PartnerTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PartnerTransactions to fetch.
     */
    orderBy?: PartnerTransactionOrderByWithRelationInput | PartnerTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PartnerTransactions.
     */
    cursor?: PartnerTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PartnerTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PartnerTransactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PartnerTransactions.
     */
    distinct?: PartnerTransactionScalarFieldEnum | PartnerTransactionScalarFieldEnum[]
  }

  /**
   * PartnerTransaction findMany
   */
  export type PartnerTransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * Filter, which PartnerTransactions to fetch.
     */
    where?: PartnerTransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PartnerTransactions to fetch.
     */
    orderBy?: PartnerTransactionOrderByWithRelationInput | PartnerTransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PartnerTransactions.
     */
    cursor?: PartnerTransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PartnerTransactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PartnerTransactions.
     */
    skip?: number
    distinct?: PartnerTransactionScalarFieldEnum | PartnerTransactionScalarFieldEnum[]
  }

  /**
   * PartnerTransaction create
   */
  export type PartnerTransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a PartnerTransaction.
     */
    data: XOR<PartnerTransactionCreateInput, PartnerTransactionUncheckedCreateInput>
  }

  /**
   * PartnerTransaction createMany
   */
  export type PartnerTransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PartnerTransactions.
     */
    data: PartnerTransactionCreateManyInput | PartnerTransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PartnerTransaction update
   */
  export type PartnerTransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a PartnerTransaction.
     */
    data: XOR<PartnerTransactionUpdateInput, PartnerTransactionUncheckedUpdateInput>
    /**
     * Choose, which PartnerTransaction to update.
     */
    where: PartnerTransactionWhereUniqueInput
  }

  /**
   * PartnerTransaction updateMany
   */
  export type PartnerTransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PartnerTransactions.
     */
    data: XOR<PartnerTransactionUpdateManyMutationInput, PartnerTransactionUncheckedUpdateManyInput>
    /**
     * Filter which PartnerTransactions to update
     */
    where?: PartnerTransactionWhereInput
    /**
     * Limit how many PartnerTransactions to update.
     */
    limit?: number
  }

  /**
   * PartnerTransaction upsert
   */
  export type PartnerTransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the PartnerTransaction to update in case it exists.
     */
    where: PartnerTransactionWhereUniqueInput
    /**
     * In case the PartnerTransaction found by the `where` argument doesn't exist, create a new PartnerTransaction with this data.
     */
    create: XOR<PartnerTransactionCreateInput, PartnerTransactionUncheckedCreateInput>
    /**
     * In case the PartnerTransaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PartnerTransactionUpdateInput, PartnerTransactionUncheckedUpdateInput>
  }

  /**
   * PartnerTransaction delete
   */
  export type PartnerTransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
    /**
     * Filter which PartnerTransaction to delete.
     */
    where: PartnerTransactionWhereUniqueInput
  }

  /**
   * PartnerTransaction deleteMany
   */
  export type PartnerTransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PartnerTransactions to delete
     */
    where?: PartnerTransactionWhereInput
    /**
     * Limit how many PartnerTransactions to delete.
     */
    limit?: number
  }

  /**
   * PartnerTransaction without action
   */
  export type PartnerTransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartnerTransaction
     */
    select?: PartnerTransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartnerTransaction
     */
    omit?: PartnerTransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerTransactionInclude<ExtArgs> | null
  }


  /**
   * Model ProjectExpense
   */

  export type AggregateProjectExpense = {
    _count: ProjectExpenseCountAggregateOutputType | null
    _avg: ProjectExpenseAvgAggregateOutputType | null
    _sum: ProjectExpenseSumAggregateOutputType | null
    _min: ProjectExpenseMinAggregateOutputType | null
    _max: ProjectExpenseMaxAggregateOutputType | null
  }

  export type ProjectExpenseAvgAggregateOutputType = {
    amount: Decimal | null
  }

  export type ProjectExpenseSumAggregateOutputType = {
    amount: Decimal | null
  }

  export type ProjectExpenseMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    expenseCategory: string | null
    amount: Decimal | null
    expenseDate: Date | null
    description: string | null
    paymentChannel: string | null
    bankAccountId: string | null
    paidByPartnerId: string | null
    voucherImageUrl: string | null
    status: string | null
    approvedBy: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type ProjectExpenseMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    expenseCategory: string | null
    amount: Decimal | null
    expenseDate: Date | null
    description: string | null
    paymentChannel: string | null
    bankAccountId: string | null
    paidByPartnerId: string | null
    voucherImageUrl: string | null
    status: string | null
    approvedBy: string | null
    createdBy: string | null
    createdAt: Date | null
  }

  export type ProjectExpenseCountAggregateOutputType = {
    id: number
    projectId: number
    expenseCategory: number
    amount: number
    expenseDate: number
    description: number
    paymentChannel: number
    bankAccountId: number
    paidByPartnerId: number
    voucherImageUrl: number
    status: number
    approvedBy: number
    createdBy: number
    createdAt: number
    _all: number
  }


  export type ProjectExpenseAvgAggregateInputType = {
    amount?: true
  }

  export type ProjectExpenseSumAggregateInputType = {
    amount?: true
  }

  export type ProjectExpenseMinAggregateInputType = {
    id?: true
    projectId?: true
    expenseCategory?: true
    amount?: true
    expenseDate?: true
    description?: true
    paymentChannel?: true
    bankAccountId?: true
    paidByPartnerId?: true
    voucherImageUrl?: true
    status?: true
    approvedBy?: true
    createdBy?: true
    createdAt?: true
  }

  export type ProjectExpenseMaxAggregateInputType = {
    id?: true
    projectId?: true
    expenseCategory?: true
    amount?: true
    expenseDate?: true
    description?: true
    paymentChannel?: true
    bankAccountId?: true
    paidByPartnerId?: true
    voucherImageUrl?: true
    status?: true
    approvedBy?: true
    createdBy?: true
    createdAt?: true
  }

  export type ProjectExpenseCountAggregateInputType = {
    id?: true
    projectId?: true
    expenseCategory?: true
    amount?: true
    expenseDate?: true
    description?: true
    paymentChannel?: true
    bankAccountId?: true
    paidByPartnerId?: true
    voucherImageUrl?: true
    status?: true
    approvedBy?: true
    createdBy?: true
    createdAt?: true
    _all?: true
  }

  export type ProjectExpenseAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectExpense to aggregate.
     */
    where?: ProjectExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectExpenses to fetch.
     */
    orderBy?: ProjectExpenseOrderByWithRelationInput | ProjectExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectExpenses
    **/
    _count?: true | ProjectExpenseCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectExpenseAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectExpenseSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectExpenseMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectExpenseMaxAggregateInputType
  }

  export type GetProjectExpenseAggregateType<T extends ProjectExpenseAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectExpense]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectExpense[P]>
      : GetScalarType<T[P], AggregateProjectExpense[P]>
  }




  export type ProjectExpenseGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectExpenseWhereInput
    orderBy?: ProjectExpenseOrderByWithAggregationInput | ProjectExpenseOrderByWithAggregationInput[]
    by: ProjectExpenseScalarFieldEnum[] | ProjectExpenseScalarFieldEnum
    having?: ProjectExpenseScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectExpenseCountAggregateInputType | true
    _avg?: ProjectExpenseAvgAggregateInputType
    _sum?: ProjectExpenseSumAggregateInputType
    _min?: ProjectExpenseMinAggregateInputType
    _max?: ProjectExpenseMaxAggregateInputType
  }

  export type ProjectExpenseGroupByOutputType = {
    id: string
    projectId: string | null
    expenseCategory: string
    amount: Decimal
    expenseDate: Date
    description: string | null
    paymentChannel: string
    bankAccountId: string | null
    paidByPartnerId: string | null
    voucherImageUrl: string | null
    status: string
    approvedBy: string | null
    createdBy: string
    createdAt: Date
    _count: ProjectExpenseCountAggregateOutputType | null
    _avg: ProjectExpenseAvgAggregateOutputType | null
    _sum: ProjectExpenseSumAggregateOutputType | null
    _min: ProjectExpenseMinAggregateOutputType | null
    _max: ProjectExpenseMaxAggregateOutputType | null
  }

  type GetProjectExpenseGroupByPayload<T extends ProjectExpenseGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectExpenseGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectExpenseGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectExpenseGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectExpenseGroupByOutputType[P]>
        }
      >
    >


  export type ProjectExpenseSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    expenseCategory?: boolean
    amount?: boolean
    expenseDate?: boolean
    description?: boolean
    paymentChannel?: boolean
    bankAccountId?: boolean
    paidByPartnerId?: boolean
    voucherImageUrl?: boolean
    status?: boolean
    approvedBy?: boolean
    createdBy?: boolean
    createdAt?: boolean
    project?: boolean | ProjectExpense$projectArgs<ExtArgs>
    bankAccount?: boolean | ProjectExpense$bankAccountArgs<ExtArgs>
    paidByPartner?: boolean | ProjectExpense$paidByPartnerArgs<ExtArgs>
  }, ExtArgs["result"]["projectExpense"]>



  export type ProjectExpenseSelectScalar = {
    id?: boolean
    projectId?: boolean
    expenseCategory?: boolean
    amount?: boolean
    expenseDate?: boolean
    description?: boolean
    paymentChannel?: boolean
    bankAccountId?: boolean
    paidByPartnerId?: boolean
    voucherImageUrl?: boolean
    status?: boolean
    approvedBy?: boolean
    createdBy?: boolean
    createdAt?: boolean
  }

  export type ProjectExpenseOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "expenseCategory" | "amount" | "expenseDate" | "description" | "paymentChannel" | "bankAccountId" | "paidByPartnerId" | "voucherImageUrl" | "status" | "approvedBy" | "createdBy" | "createdAt", ExtArgs["result"]["projectExpense"]>
  export type ProjectExpenseInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectExpense$projectArgs<ExtArgs>
    bankAccount?: boolean | ProjectExpense$bankAccountArgs<ExtArgs>
    paidByPartner?: boolean | ProjectExpense$paidByPartnerArgs<ExtArgs>
  }

  export type $ProjectExpensePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectExpense"
    objects: {
      project: Prisma.$LandProjectPayload<ExtArgs> | null
      bankAccount: Prisma.$BankAccountPayload<ExtArgs> | null
      paidByPartner: Prisma.$PartnerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string | null
      expenseCategory: string
      amount: Prisma.Decimal
      expenseDate: Date
      description: string | null
      paymentChannel: string
      bankAccountId: string | null
      paidByPartnerId: string | null
      voucherImageUrl: string | null
      status: string
      approvedBy: string | null
      createdBy: string
      createdAt: Date
    }, ExtArgs["result"]["projectExpense"]>
    composites: {}
  }

  type ProjectExpenseGetPayload<S extends boolean | null | undefined | ProjectExpenseDefaultArgs> = $Result.GetResult<Prisma.$ProjectExpensePayload, S>

  type ProjectExpenseCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectExpenseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectExpenseCountAggregateInputType | true
    }

  export interface ProjectExpenseDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectExpense'], meta: { name: 'ProjectExpense' } }
    /**
     * Find zero or one ProjectExpense that matches the filter.
     * @param {ProjectExpenseFindUniqueArgs} args - Arguments to find a ProjectExpense
     * @example
     * // Get one ProjectExpense
     * const projectExpense = await prisma.projectExpense.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectExpenseFindUniqueArgs>(args: SelectSubset<T, ProjectExpenseFindUniqueArgs<ExtArgs>>): Prisma__ProjectExpenseClient<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectExpense that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectExpenseFindUniqueOrThrowArgs} args - Arguments to find a ProjectExpense
     * @example
     * // Get one ProjectExpense
     * const projectExpense = await prisma.projectExpense.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectExpenseFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectExpenseFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectExpenseClient<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectExpense that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectExpenseFindFirstArgs} args - Arguments to find a ProjectExpense
     * @example
     * // Get one ProjectExpense
     * const projectExpense = await prisma.projectExpense.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectExpenseFindFirstArgs>(args?: SelectSubset<T, ProjectExpenseFindFirstArgs<ExtArgs>>): Prisma__ProjectExpenseClient<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectExpense that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectExpenseFindFirstOrThrowArgs} args - Arguments to find a ProjectExpense
     * @example
     * // Get one ProjectExpense
     * const projectExpense = await prisma.projectExpense.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectExpenseFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectExpenseFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectExpenseClient<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectExpenses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectExpenseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectExpenses
     * const projectExpenses = await prisma.projectExpense.findMany()
     * 
     * // Get first 10 ProjectExpenses
     * const projectExpenses = await prisma.projectExpense.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectExpenseWithIdOnly = await prisma.projectExpense.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectExpenseFindManyArgs>(args?: SelectSubset<T, ProjectExpenseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectExpense.
     * @param {ProjectExpenseCreateArgs} args - Arguments to create a ProjectExpense.
     * @example
     * // Create one ProjectExpense
     * const ProjectExpense = await prisma.projectExpense.create({
     *   data: {
     *     // ... data to create a ProjectExpense
     *   }
     * })
     * 
     */
    create<T extends ProjectExpenseCreateArgs>(args: SelectSubset<T, ProjectExpenseCreateArgs<ExtArgs>>): Prisma__ProjectExpenseClient<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectExpenses.
     * @param {ProjectExpenseCreateManyArgs} args - Arguments to create many ProjectExpenses.
     * @example
     * // Create many ProjectExpenses
     * const projectExpense = await prisma.projectExpense.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectExpenseCreateManyArgs>(args?: SelectSubset<T, ProjectExpenseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProjectExpense.
     * @param {ProjectExpenseDeleteArgs} args - Arguments to delete one ProjectExpense.
     * @example
     * // Delete one ProjectExpense
     * const ProjectExpense = await prisma.projectExpense.delete({
     *   where: {
     *     // ... filter to delete one ProjectExpense
     *   }
     * })
     * 
     */
    delete<T extends ProjectExpenseDeleteArgs>(args: SelectSubset<T, ProjectExpenseDeleteArgs<ExtArgs>>): Prisma__ProjectExpenseClient<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectExpense.
     * @param {ProjectExpenseUpdateArgs} args - Arguments to update one ProjectExpense.
     * @example
     * // Update one ProjectExpense
     * const projectExpense = await prisma.projectExpense.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectExpenseUpdateArgs>(args: SelectSubset<T, ProjectExpenseUpdateArgs<ExtArgs>>): Prisma__ProjectExpenseClient<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectExpenses.
     * @param {ProjectExpenseDeleteManyArgs} args - Arguments to filter ProjectExpenses to delete.
     * @example
     * // Delete a few ProjectExpenses
     * const { count } = await prisma.projectExpense.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectExpenseDeleteManyArgs>(args?: SelectSubset<T, ProjectExpenseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectExpenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectExpenseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectExpenses
     * const projectExpense = await prisma.projectExpense.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectExpenseUpdateManyArgs>(args: SelectSubset<T, ProjectExpenseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProjectExpense.
     * @param {ProjectExpenseUpsertArgs} args - Arguments to update or create a ProjectExpense.
     * @example
     * // Update or create a ProjectExpense
     * const projectExpense = await prisma.projectExpense.upsert({
     *   create: {
     *     // ... data to create a ProjectExpense
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectExpense we want to update
     *   }
     * })
     */
    upsert<T extends ProjectExpenseUpsertArgs>(args: SelectSubset<T, ProjectExpenseUpsertArgs<ExtArgs>>): Prisma__ProjectExpenseClient<$Result.GetResult<Prisma.$ProjectExpensePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectExpenses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectExpenseCountArgs} args - Arguments to filter ProjectExpenses to count.
     * @example
     * // Count the number of ProjectExpenses
     * const count = await prisma.projectExpense.count({
     *   where: {
     *     // ... the filter for the ProjectExpenses we want to count
     *   }
     * })
    **/
    count<T extends ProjectExpenseCountArgs>(
      args?: Subset<T, ProjectExpenseCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectExpenseCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectExpense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectExpenseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectExpenseAggregateArgs>(args: Subset<T, ProjectExpenseAggregateArgs>): Prisma.PrismaPromise<GetProjectExpenseAggregateType<T>>

    /**
     * Group by ProjectExpense.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectExpenseGroupByArgs} args - Group by arguments.
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
      T extends ProjectExpenseGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectExpenseGroupByArgs['orderBy'] }
        : { orderBy?: ProjectExpenseGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectExpenseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectExpenseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectExpense model
   */
  readonly fields: ProjectExpenseFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectExpense.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectExpenseClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectExpense$projectArgs<ExtArgs> = {}>(args?: Subset<T, ProjectExpense$projectArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    bankAccount<T extends ProjectExpense$bankAccountArgs<ExtArgs> = {}>(args?: Subset<T, ProjectExpense$bankAccountArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    paidByPartner<T extends ProjectExpense$paidByPartnerArgs<ExtArgs> = {}>(args?: Subset<T, ProjectExpense$paidByPartnerArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProjectExpense model
   */
  interface ProjectExpenseFieldRefs {
    readonly id: FieldRef<"ProjectExpense", 'String'>
    readonly projectId: FieldRef<"ProjectExpense", 'String'>
    readonly expenseCategory: FieldRef<"ProjectExpense", 'String'>
    readonly amount: FieldRef<"ProjectExpense", 'Decimal'>
    readonly expenseDate: FieldRef<"ProjectExpense", 'DateTime'>
    readonly description: FieldRef<"ProjectExpense", 'String'>
    readonly paymentChannel: FieldRef<"ProjectExpense", 'String'>
    readonly bankAccountId: FieldRef<"ProjectExpense", 'String'>
    readonly paidByPartnerId: FieldRef<"ProjectExpense", 'String'>
    readonly voucherImageUrl: FieldRef<"ProjectExpense", 'String'>
    readonly status: FieldRef<"ProjectExpense", 'String'>
    readonly approvedBy: FieldRef<"ProjectExpense", 'String'>
    readonly createdBy: FieldRef<"ProjectExpense", 'String'>
    readonly createdAt: FieldRef<"ProjectExpense", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProjectExpense findUnique
   */
  export type ProjectExpenseFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectExpense to fetch.
     */
    where: ProjectExpenseWhereUniqueInput
  }

  /**
   * ProjectExpense findUniqueOrThrow
   */
  export type ProjectExpenseFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectExpense to fetch.
     */
    where: ProjectExpenseWhereUniqueInput
  }

  /**
   * ProjectExpense findFirst
   */
  export type ProjectExpenseFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectExpense to fetch.
     */
    where?: ProjectExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectExpenses to fetch.
     */
    orderBy?: ProjectExpenseOrderByWithRelationInput | ProjectExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectExpenses.
     */
    cursor?: ProjectExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectExpenses.
     */
    distinct?: ProjectExpenseScalarFieldEnum | ProjectExpenseScalarFieldEnum[]
  }

  /**
   * ProjectExpense findFirstOrThrow
   */
  export type ProjectExpenseFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectExpense to fetch.
     */
    where?: ProjectExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectExpenses to fetch.
     */
    orderBy?: ProjectExpenseOrderByWithRelationInput | ProjectExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectExpenses.
     */
    cursor?: ProjectExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectExpenses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectExpenses.
     */
    distinct?: ProjectExpenseScalarFieldEnum | ProjectExpenseScalarFieldEnum[]
  }

  /**
   * ProjectExpense findMany
   */
  export type ProjectExpenseFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * Filter, which ProjectExpenses to fetch.
     */
    where?: ProjectExpenseWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectExpenses to fetch.
     */
    orderBy?: ProjectExpenseOrderByWithRelationInput | ProjectExpenseOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectExpenses.
     */
    cursor?: ProjectExpenseWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectExpenses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectExpenses.
     */
    skip?: number
    distinct?: ProjectExpenseScalarFieldEnum | ProjectExpenseScalarFieldEnum[]
  }

  /**
   * ProjectExpense create
   */
  export type ProjectExpenseCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectExpense.
     */
    data: XOR<ProjectExpenseCreateInput, ProjectExpenseUncheckedCreateInput>
  }

  /**
   * ProjectExpense createMany
   */
  export type ProjectExpenseCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectExpenses.
     */
    data: ProjectExpenseCreateManyInput | ProjectExpenseCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectExpense update
   */
  export type ProjectExpenseUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectExpense.
     */
    data: XOR<ProjectExpenseUpdateInput, ProjectExpenseUncheckedUpdateInput>
    /**
     * Choose, which ProjectExpense to update.
     */
    where: ProjectExpenseWhereUniqueInput
  }

  /**
   * ProjectExpense updateMany
   */
  export type ProjectExpenseUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectExpenses.
     */
    data: XOR<ProjectExpenseUpdateManyMutationInput, ProjectExpenseUncheckedUpdateManyInput>
    /**
     * Filter which ProjectExpenses to update
     */
    where?: ProjectExpenseWhereInput
    /**
     * Limit how many ProjectExpenses to update.
     */
    limit?: number
  }

  /**
   * ProjectExpense upsert
   */
  export type ProjectExpenseUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectExpense to update in case it exists.
     */
    where: ProjectExpenseWhereUniqueInput
    /**
     * In case the ProjectExpense found by the `where` argument doesn't exist, create a new ProjectExpense with this data.
     */
    create: XOR<ProjectExpenseCreateInput, ProjectExpenseUncheckedCreateInput>
    /**
     * In case the ProjectExpense was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectExpenseUpdateInput, ProjectExpenseUncheckedUpdateInput>
  }

  /**
   * ProjectExpense delete
   */
  export type ProjectExpenseDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
    /**
     * Filter which ProjectExpense to delete.
     */
    where: ProjectExpenseWhereUniqueInput
  }

  /**
   * ProjectExpense deleteMany
   */
  export type ProjectExpenseDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectExpenses to delete
     */
    where?: ProjectExpenseWhereInput
    /**
     * Limit how many ProjectExpenses to delete.
     */
    limit?: number
  }

  /**
   * ProjectExpense.project
   */
  export type ProjectExpense$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandProject
     */
    select?: LandProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandProject
     */
    omit?: LandProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandProjectInclude<ExtArgs> | null
    where?: LandProjectWhereInput
  }

  /**
   * ProjectExpense.bankAccount
   */
  export type ProjectExpense$bankAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    where?: BankAccountWhereInput
  }

  /**
   * ProjectExpense.paidByPartner
   */
  export type ProjectExpense$paidByPartnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Partner
     */
    select?: PartnerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Partner
     */
    omit?: PartnerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartnerInclude<ExtArgs> | null
    where?: PartnerWhereInput
  }

  /**
   * ProjectExpense without action
   */
  export type ProjectExpenseDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectExpense
     */
    select?: ProjectExpenseSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectExpense
     */
    omit?: ProjectExpenseOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectExpenseInclude<ExtArgs> | null
  }


  /**
   * Model ProjectPlot
   */

  export type AggregateProjectPlot = {
    _count: ProjectPlotCountAggregateOutputType | null
    _avg: ProjectPlotAvgAggregateOutputType | null
    _sum: ProjectPlotSumAggregateOutputType | null
    _min: ProjectPlotMinAggregateOutputType | null
    _max: ProjectPlotMaxAggregateOutputType | null
  }

  export type ProjectPlotAvgAggregateOutputType = {
    plotSizeShotok: Decimal | null
    askingPrice: Decimal | null
  }

  export type ProjectPlotSumAggregateOutputType = {
    plotSizeShotok: Decimal | null
    askingPrice: Decimal | null
  }

  export type ProjectPlotMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    plotNumber: string | null
    plotSizeShotok: Decimal | null
    askingPrice: Decimal | null
    status: string | null
  }

  export type ProjectPlotMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    plotNumber: string | null
    plotSizeShotok: Decimal | null
    askingPrice: Decimal | null
    status: string | null
  }

  export type ProjectPlotCountAggregateOutputType = {
    id: number
    projectId: number
    plotNumber: number
    plotSizeShotok: number
    askingPrice: number
    status: number
    _all: number
  }


  export type ProjectPlotAvgAggregateInputType = {
    plotSizeShotok?: true
    askingPrice?: true
  }

  export type ProjectPlotSumAggregateInputType = {
    plotSizeShotok?: true
    askingPrice?: true
  }

  export type ProjectPlotMinAggregateInputType = {
    id?: true
    projectId?: true
    plotNumber?: true
    plotSizeShotok?: true
    askingPrice?: true
    status?: true
  }

  export type ProjectPlotMaxAggregateInputType = {
    id?: true
    projectId?: true
    plotNumber?: true
    plotSizeShotok?: true
    askingPrice?: true
    status?: true
  }

  export type ProjectPlotCountAggregateInputType = {
    id?: true
    projectId?: true
    plotNumber?: true
    plotSizeShotok?: true
    askingPrice?: true
    status?: true
    _all?: true
  }

  export type ProjectPlotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectPlot to aggregate.
     */
    where?: ProjectPlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectPlots to fetch.
     */
    orderBy?: ProjectPlotOrderByWithRelationInput | ProjectPlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectPlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectPlots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectPlots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProjectPlots
    **/
    _count?: true | ProjectPlotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectPlotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectPlotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectPlotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectPlotMaxAggregateInputType
  }

  export type GetProjectPlotAggregateType<T extends ProjectPlotAggregateArgs> = {
        [P in keyof T & keyof AggregateProjectPlot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProjectPlot[P]>
      : GetScalarType<T[P], AggregateProjectPlot[P]>
  }




  export type ProjectPlotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectPlotWhereInput
    orderBy?: ProjectPlotOrderByWithAggregationInput | ProjectPlotOrderByWithAggregationInput[]
    by: ProjectPlotScalarFieldEnum[] | ProjectPlotScalarFieldEnum
    having?: ProjectPlotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectPlotCountAggregateInputType | true
    _avg?: ProjectPlotAvgAggregateInputType
    _sum?: ProjectPlotSumAggregateInputType
    _min?: ProjectPlotMinAggregateInputType
    _max?: ProjectPlotMaxAggregateInputType
  }

  export type ProjectPlotGroupByOutputType = {
    id: string
    projectId: string
    plotNumber: string
    plotSizeShotok: Decimal
    askingPrice: Decimal
    status: string
    _count: ProjectPlotCountAggregateOutputType | null
    _avg: ProjectPlotAvgAggregateOutputType | null
    _sum: ProjectPlotSumAggregateOutputType | null
    _min: ProjectPlotMinAggregateOutputType | null
    _max: ProjectPlotMaxAggregateOutputType | null
  }

  type GetProjectPlotGroupByPayload<T extends ProjectPlotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectPlotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectPlotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectPlotGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectPlotGroupByOutputType[P]>
        }
      >
    >


  export type ProjectPlotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    plotNumber?: boolean
    plotSizeShotok?: boolean
    askingPrice?: boolean
    status?: boolean
    project?: boolean | LandProjectDefaultArgs<ExtArgs>
    landSales?: boolean | ProjectPlot$landSalesArgs<ExtArgs>
    _count?: boolean | ProjectPlotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["projectPlot"]>



  export type ProjectPlotSelectScalar = {
    id?: boolean
    projectId?: boolean
    plotNumber?: boolean
    plotSizeShotok?: boolean
    askingPrice?: boolean
    status?: boolean
  }

  export type ProjectPlotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "plotNumber" | "plotSizeShotok" | "askingPrice" | "status", ExtArgs["result"]["projectPlot"]>
  export type ProjectPlotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | LandProjectDefaultArgs<ExtArgs>
    landSales?: boolean | ProjectPlot$landSalesArgs<ExtArgs>
    _count?: boolean | ProjectPlotCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ProjectPlotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProjectPlot"
    objects: {
      project: Prisma.$LandProjectPayload<ExtArgs>
      landSales: Prisma.$LandSalePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      plotNumber: string
      plotSizeShotok: Prisma.Decimal
      askingPrice: Prisma.Decimal
      status: string
    }, ExtArgs["result"]["projectPlot"]>
    composites: {}
  }

  type ProjectPlotGetPayload<S extends boolean | null | undefined | ProjectPlotDefaultArgs> = $Result.GetResult<Prisma.$ProjectPlotPayload, S>

  type ProjectPlotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectPlotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectPlotCountAggregateInputType | true
    }

  export interface ProjectPlotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProjectPlot'], meta: { name: 'ProjectPlot' } }
    /**
     * Find zero or one ProjectPlot that matches the filter.
     * @param {ProjectPlotFindUniqueArgs} args - Arguments to find a ProjectPlot
     * @example
     * // Get one ProjectPlot
     * const projectPlot = await prisma.projectPlot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectPlotFindUniqueArgs>(args: SelectSubset<T, ProjectPlotFindUniqueArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProjectPlot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectPlotFindUniqueOrThrowArgs} args - Arguments to find a ProjectPlot
     * @example
     * // Get one ProjectPlot
     * const projectPlot = await prisma.projectPlot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectPlotFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectPlotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectPlot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPlotFindFirstArgs} args - Arguments to find a ProjectPlot
     * @example
     * // Get one ProjectPlot
     * const projectPlot = await prisma.projectPlot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectPlotFindFirstArgs>(args?: SelectSubset<T, ProjectPlotFindFirstArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProjectPlot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPlotFindFirstOrThrowArgs} args - Arguments to find a ProjectPlot
     * @example
     * // Get one ProjectPlot
     * const projectPlot = await prisma.projectPlot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectPlotFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectPlotFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProjectPlots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPlotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProjectPlots
     * const projectPlots = await prisma.projectPlot.findMany()
     * 
     * // Get first 10 ProjectPlots
     * const projectPlots = await prisma.projectPlot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectPlotWithIdOnly = await prisma.projectPlot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectPlotFindManyArgs>(args?: SelectSubset<T, ProjectPlotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProjectPlot.
     * @param {ProjectPlotCreateArgs} args - Arguments to create a ProjectPlot.
     * @example
     * // Create one ProjectPlot
     * const ProjectPlot = await prisma.projectPlot.create({
     *   data: {
     *     // ... data to create a ProjectPlot
     *   }
     * })
     * 
     */
    create<T extends ProjectPlotCreateArgs>(args: SelectSubset<T, ProjectPlotCreateArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProjectPlots.
     * @param {ProjectPlotCreateManyArgs} args - Arguments to create many ProjectPlots.
     * @example
     * // Create many ProjectPlots
     * const projectPlot = await prisma.projectPlot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectPlotCreateManyArgs>(args?: SelectSubset<T, ProjectPlotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProjectPlot.
     * @param {ProjectPlotDeleteArgs} args - Arguments to delete one ProjectPlot.
     * @example
     * // Delete one ProjectPlot
     * const ProjectPlot = await prisma.projectPlot.delete({
     *   where: {
     *     // ... filter to delete one ProjectPlot
     *   }
     * })
     * 
     */
    delete<T extends ProjectPlotDeleteArgs>(args: SelectSubset<T, ProjectPlotDeleteArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProjectPlot.
     * @param {ProjectPlotUpdateArgs} args - Arguments to update one ProjectPlot.
     * @example
     * // Update one ProjectPlot
     * const projectPlot = await prisma.projectPlot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectPlotUpdateArgs>(args: SelectSubset<T, ProjectPlotUpdateArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProjectPlots.
     * @param {ProjectPlotDeleteManyArgs} args - Arguments to filter ProjectPlots to delete.
     * @example
     * // Delete a few ProjectPlots
     * const { count } = await prisma.projectPlot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectPlotDeleteManyArgs>(args?: SelectSubset<T, ProjectPlotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProjectPlots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPlotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProjectPlots
     * const projectPlot = await prisma.projectPlot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectPlotUpdateManyArgs>(args: SelectSubset<T, ProjectPlotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProjectPlot.
     * @param {ProjectPlotUpsertArgs} args - Arguments to update or create a ProjectPlot.
     * @example
     * // Update or create a ProjectPlot
     * const projectPlot = await prisma.projectPlot.upsert({
     *   create: {
     *     // ... data to create a ProjectPlot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProjectPlot we want to update
     *   }
     * })
     */
    upsert<T extends ProjectPlotUpsertArgs>(args: SelectSubset<T, ProjectPlotUpsertArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProjectPlots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPlotCountArgs} args - Arguments to filter ProjectPlots to count.
     * @example
     * // Count the number of ProjectPlots
     * const count = await prisma.projectPlot.count({
     *   where: {
     *     // ... the filter for the ProjectPlots we want to count
     *   }
     * })
    **/
    count<T extends ProjectPlotCountArgs>(
      args?: Subset<T, ProjectPlotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectPlotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProjectPlot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPlotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProjectPlotAggregateArgs>(args: Subset<T, ProjectPlotAggregateArgs>): Prisma.PrismaPromise<GetProjectPlotAggregateType<T>>

    /**
     * Group by ProjectPlot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectPlotGroupByArgs} args - Group by arguments.
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
      T extends ProjectPlotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectPlotGroupByArgs['orderBy'] }
        : { orderBy?: ProjectPlotGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProjectPlotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectPlotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProjectPlot model
   */
  readonly fields: ProjectPlotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProjectPlot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectPlotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends LandProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LandProjectDefaultArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    landSales<T extends ProjectPlot$landSalesArgs<ExtArgs> = {}>(args?: Subset<T, ProjectPlot$landSalesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ProjectPlot model
   */
  interface ProjectPlotFieldRefs {
    readonly id: FieldRef<"ProjectPlot", 'String'>
    readonly projectId: FieldRef<"ProjectPlot", 'String'>
    readonly plotNumber: FieldRef<"ProjectPlot", 'String'>
    readonly plotSizeShotok: FieldRef<"ProjectPlot", 'Decimal'>
    readonly askingPrice: FieldRef<"ProjectPlot", 'Decimal'>
    readonly status: FieldRef<"ProjectPlot", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ProjectPlot findUnique
   */
  export type ProjectPlotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPlot to fetch.
     */
    where: ProjectPlotWhereUniqueInput
  }

  /**
   * ProjectPlot findUniqueOrThrow
   */
  export type ProjectPlotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPlot to fetch.
     */
    where: ProjectPlotWhereUniqueInput
  }

  /**
   * ProjectPlot findFirst
   */
  export type ProjectPlotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPlot to fetch.
     */
    where?: ProjectPlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectPlots to fetch.
     */
    orderBy?: ProjectPlotOrderByWithRelationInput | ProjectPlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectPlots.
     */
    cursor?: ProjectPlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectPlots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectPlots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectPlots.
     */
    distinct?: ProjectPlotScalarFieldEnum | ProjectPlotScalarFieldEnum[]
  }

  /**
   * ProjectPlot findFirstOrThrow
   */
  export type ProjectPlotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPlot to fetch.
     */
    where?: ProjectPlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectPlots to fetch.
     */
    orderBy?: ProjectPlotOrderByWithRelationInput | ProjectPlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProjectPlots.
     */
    cursor?: ProjectPlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectPlots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectPlots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProjectPlots.
     */
    distinct?: ProjectPlotScalarFieldEnum | ProjectPlotScalarFieldEnum[]
  }

  /**
   * ProjectPlot findMany
   */
  export type ProjectPlotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * Filter, which ProjectPlots to fetch.
     */
    where?: ProjectPlotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProjectPlots to fetch.
     */
    orderBy?: ProjectPlotOrderByWithRelationInput | ProjectPlotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProjectPlots.
     */
    cursor?: ProjectPlotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProjectPlots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProjectPlots.
     */
    skip?: number
    distinct?: ProjectPlotScalarFieldEnum | ProjectPlotScalarFieldEnum[]
  }

  /**
   * ProjectPlot create
   */
  export type ProjectPlotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * The data needed to create a ProjectPlot.
     */
    data: XOR<ProjectPlotCreateInput, ProjectPlotUncheckedCreateInput>
  }

  /**
   * ProjectPlot createMany
   */
  export type ProjectPlotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProjectPlots.
     */
    data: ProjectPlotCreateManyInput | ProjectPlotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProjectPlot update
   */
  export type ProjectPlotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * The data needed to update a ProjectPlot.
     */
    data: XOR<ProjectPlotUpdateInput, ProjectPlotUncheckedUpdateInput>
    /**
     * Choose, which ProjectPlot to update.
     */
    where: ProjectPlotWhereUniqueInput
  }

  /**
   * ProjectPlot updateMany
   */
  export type ProjectPlotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProjectPlots.
     */
    data: XOR<ProjectPlotUpdateManyMutationInput, ProjectPlotUncheckedUpdateManyInput>
    /**
     * Filter which ProjectPlots to update
     */
    where?: ProjectPlotWhereInput
    /**
     * Limit how many ProjectPlots to update.
     */
    limit?: number
  }

  /**
   * ProjectPlot upsert
   */
  export type ProjectPlotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * The filter to search for the ProjectPlot to update in case it exists.
     */
    where: ProjectPlotWhereUniqueInput
    /**
     * In case the ProjectPlot found by the `where` argument doesn't exist, create a new ProjectPlot with this data.
     */
    create: XOR<ProjectPlotCreateInput, ProjectPlotUncheckedCreateInput>
    /**
     * In case the ProjectPlot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectPlotUpdateInput, ProjectPlotUncheckedUpdateInput>
  }

  /**
   * ProjectPlot delete
   */
  export type ProjectPlotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    /**
     * Filter which ProjectPlot to delete.
     */
    where: ProjectPlotWhereUniqueInput
  }

  /**
   * ProjectPlot deleteMany
   */
  export type ProjectPlotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProjectPlots to delete
     */
    where?: ProjectPlotWhereInput
    /**
     * Limit how many ProjectPlots to delete.
     */
    limit?: number
  }

  /**
   * ProjectPlot.landSales
   */
  export type ProjectPlot$landSalesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    where?: LandSaleWhereInput
    orderBy?: LandSaleOrderByWithRelationInput | LandSaleOrderByWithRelationInput[]
    cursor?: LandSaleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LandSaleScalarFieldEnum | LandSaleScalarFieldEnum[]
  }

  /**
   * ProjectPlot without action
   */
  export type ProjectPlotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
  }


  /**
   * Model LandSale
   */

  export type AggregateLandSale = {
    _count: LandSaleCountAggregateOutputType | null
    _avg: LandSaleAvgAggregateOutputType | null
    _sum: LandSaleSumAggregateOutputType | null
    _min: LandSaleMinAggregateOutputType | null
    _max: LandSaleMaxAggregateOutputType | null
  }

  export type LandSaleAvgAggregateOutputType = {
    totalAgreedPrice: Decimal | null
    advanceBookingAmount: Decimal | null
    currentDueAmount: Decimal | null
  }

  export type LandSaleSumAggregateOutputType = {
    totalAgreedPrice: Decimal | null
    advanceBookingAmount: Decimal | null
    currentDueAmount: Decimal | null
  }

  export type LandSaleMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    plotId: string | null
    buyerName: string | null
    buyerPhone: string | null
    buyerNid: string | null
    saleDate: Date | null
    totalAgreedPrice: Decimal | null
    advanceBookingAmount: Decimal | null
    currentDueAmount: Decimal | null
    status: string | null
  }

  export type LandSaleMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    plotId: string | null
    buyerName: string | null
    buyerPhone: string | null
    buyerNid: string | null
    saleDate: Date | null
    totalAgreedPrice: Decimal | null
    advanceBookingAmount: Decimal | null
    currentDueAmount: Decimal | null
    status: string | null
  }

  export type LandSaleCountAggregateOutputType = {
    id: number
    projectId: number
    plotId: number
    buyerName: number
    buyerPhone: number
    buyerNid: number
    saleDate: number
    totalAgreedPrice: number
    advanceBookingAmount: number
    currentDueAmount: number
    status: number
    _all: number
  }


  export type LandSaleAvgAggregateInputType = {
    totalAgreedPrice?: true
    advanceBookingAmount?: true
    currentDueAmount?: true
  }

  export type LandSaleSumAggregateInputType = {
    totalAgreedPrice?: true
    advanceBookingAmount?: true
    currentDueAmount?: true
  }

  export type LandSaleMinAggregateInputType = {
    id?: true
    projectId?: true
    plotId?: true
    buyerName?: true
    buyerPhone?: true
    buyerNid?: true
    saleDate?: true
    totalAgreedPrice?: true
    advanceBookingAmount?: true
    currentDueAmount?: true
    status?: true
  }

  export type LandSaleMaxAggregateInputType = {
    id?: true
    projectId?: true
    plotId?: true
    buyerName?: true
    buyerPhone?: true
    buyerNid?: true
    saleDate?: true
    totalAgreedPrice?: true
    advanceBookingAmount?: true
    currentDueAmount?: true
    status?: true
  }

  export type LandSaleCountAggregateInputType = {
    id?: true
    projectId?: true
    plotId?: true
    buyerName?: true
    buyerPhone?: true
    buyerNid?: true
    saleDate?: true
    totalAgreedPrice?: true
    advanceBookingAmount?: true
    currentDueAmount?: true
    status?: true
    _all?: true
  }

  export type LandSaleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandSale to aggregate.
     */
    where?: LandSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandSales to fetch.
     */
    orderBy?: LandSaleOrderByWithRelationInput | LandSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LandSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LandSales
    **/
    _count?: true | LandSaleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LandSaleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LandSaleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LandSaleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LandSaleMaxAggregateInputType
  }

  export type GetLandSaleAggregateType<T extends LandSaleAggregateArgs> = {
        [P in keyof T & keyof AggregateLandSale]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLandSale[P]>
      : GetScalarType<T[P], AggregateLandSale[P]>
  }




  export type LandSaleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LandSaleWhereInput
    orderBy?: LandSaleOrderByWithAggregationInput | LandSaleOrderByWithAggregationInput[]
    by: LandSaleScalarFieldEnum[] | LandSaleScalarFieldEnum
    having?: LandSaleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LandSaleCountAggregateInputType | true
    _avg?: LandSaleAvgAggregateInputType
    _sum?: LandSaleSumAggregateInputType
    _min?: LandSaleMinAggregateInputType
    _max?: LandSaleMaxAggregateInputType
  }

  export type LandSaleGroupByOutputType = {
    id: string
    projectId: string
    plotId: string | null
    buyerName: string
    buyerPhone: string
    buyerNid: string | null
    saleDate: Date
    totalAgreedPrice: Decimal
    advanceBookingAmount: Decimal
    currentDueAmount: Decimal
    status: string
    _count: LandSaleCountAggregateOutputType | null
    _avg: LandSaleAvgAggregateOutputType | null
    _sum: LandSaleSumAggregateOutputType | null
    _min: LandSaleMinAggregateOutputType | null
    _max: LandSaleMaxAggregateOutputType | null
  }

  type GetLandSaleGroupByPayload<T extends LandSaleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LandSaleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LandSaleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LandSaleGroupByOutputType[P]>
            : GetScalarType<T[P], LandSaleGroupByOutputType[P]>
        }
      >
    >


  export type LandSaleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    plotId?: boolean
    buyerName?: boolean
    buyerPhone?: boolean
    buyerNid?: boolean
    saleDate?: boolean
    totalAgreedPrice?: boolean
    advanceBookingAmount?: boolean
    currentDueAmount?: boolean
    status?: boolean
    project?: boolean | LandProjectDefaultArgs<ExtArgs>
    plot?: boolean | LandSale$plotArgs<ExtArgs>
    installmentSchedules?: boolean | LandSale$installmentSchedulesArgs<ExtArgs>
    customerPayments?: boolean | LandSale$customerPaymentsArgs<ExtArgs>
    _count?: boolean | LandSaleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["landSale"]>



  export type LandSaleSelectScalar = {
    id?: boolean
    projectId?: boolean
    plotId?: boolean
    buyerName?: boolean
    buyerPhone?: boolean
    buyerNid?: boolean
    saleDate?: boolean
    totalAgreedPrice?: boolean
    advanceBookingAmount?: boolean
    currentDueAmount?: boolean
    status?: boolean
  }

  export type LandSaleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "plotId" | "buyerName" | "buyerPhone" | "buyerNid" | "saleDate" | "totalAgreedPrice" | "advanceBookingAmount" | "currentDueAmount" | "status", ExtArgs["result"]["landSale"]>
  export type LandSaleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | LandProjectDefaultArgs<ExtArgs>
    plot?: boolean | LandSale$plotArgs<ExtArgs>
    installmentSchedules?: boolean | LandSale$installmentSchedulesArgs<ExtArgs>
    customerPayments?: boolean | LandSale$customerPaymentsArgs<ExtArgs>
    _count?: boolean | LandSaleCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $LandSalePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LandSale"
    objects: {
      project: Prisma.$LandProjectPayload<ExtArgs>
      plot: Prisma.$ProjectPlotPayload<ExtArgs> | null
      installmentSchedules: Prisma.$InstallmentSchedulePayload<ExtArgs>[]
      customerPayments: Prisma.$CustomerPaymentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      plotId: string | null
      buyerName: string
      buyerPhone: string
      buyerNid: string | null
      saleDate: Date
      totalAgreedPrice: Prisma.Decimal
      advanceBookingAmount: Prisma.Decimal
      currentDueAmount: Prisma.Decimal
      status: string
    }, ExtArgs["result"]["landSale"]>
    composites: {}
  }

  type LandSaleGetPayload<S extends boolean | null | undefined | LandSaleDefaultArgs> = $Result.GetResult<Prisma.$LandSalePayload, S>

  type LandSaleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LandSaleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LandSaleCountAggregateInputType | true
    }

  export interface LandSaleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LandSale'], meta: { name: 'LandSale' } }
    /**
     * Find zero or one LandSale that matches the filter.
     * @param {LandSaleFindUniqueArgs} args - Arguments to find a LandSale
     * @example
     * // Get one LandSale
     * const landSale = await prisma.landSale.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LandSaleFindUniqueArgs>(args: SelectSubset<T, LandSaleFindUniqueArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LandSale that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LandSaleFindUniqueOrThrowArgs} args - Arguments to find a LandSale
     * @example
     * // Get one LandSale
     * const landSale = await prisma.landSale.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LandSaleFindUniqueOrThrowArgs>(args: SelectSubset<T, LandSaleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandSale that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandSaleFindFirstArgs} args - Arguments to find a LandSale
     * @example
     * // Get one LandSale
     * const landSale = await prisma.landSale.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LandSaleFindFirstArgs>(args?: SelectSubset<T, LandSaleFindFirstArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LandSale that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandSaleFindFirstOrThrowArgs} args - Arguments to find a LandSale
     * @example
     * // Get one LandSale
     * const landSale = await prisma.landSale.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LandSaleFindFirstOrThrowArgs>(args?: SelectSubset<T, LandSaleFindFirstOrThrowArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LandSales that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandSaleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LandSales
     * const landSales = await prisma.landSale.findMany()
     * 
     * // Get first 10 LandSales
     * const landSales = await prisma.landSale.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const landSaleWithIdOnly = await prisma.landSale.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LandSaleFindManyArgs>(args?: SelectSubset<T, LandSaleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LandSale.
     * @param {LandSaleCreateArgs} args - Arguments to create a LandSale.
     * @example
     * // Create one LandSale
     * const LandSale = await prisma.landSale.create({
     *   data: {
     *     // ... data to create a LandSale
     *   }
     * })
     * 
     */
    create<T extends LandSaleCreateArgs>(args: SelectSubset<T, LandSaleCreateArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LandSales.
     * @param {LandSaleCreateManyArgs} args - Arguments to create many LandSales.
     * @example
     * // Create many LandSales
     * const landSale = await prisma.landSale.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LandSaleCreateManyArgs>(args?: SelectSubset<T, LandSaleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LandSale.
     * @param {LandSaleDeleteArgs} args - Arguments to delete one LandSale.
     * @example
     * // Delete one LandSale
     * const LandSale = await prisma.landSale.delete({
     *   where: {
     *     // ... filter to delete one LandSale
     *   }
     * })
     * 
     */
    delete<T extends LandSaleDeleteArgs>(args: SelectSubset<T, LandSaleDeleteArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LandSale.
     * @param {LandSaleUpdateArgs} args - Arguments to update one LandSale.
     * @example
     * // Update one LandSale
     * const landSale = await prisma.landSale.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LandSaleUpdateArgs>(args: SelectSubset<T, LandSaleUpdateArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LandSales.
     * @param {LandSaleDeleteManyArgs} args - Arguments to filter LandSales to delete.
     * @example
     * // Delete a few LandSales
     * const { count } = await prisma.landSale.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LandSaleDeleteManyArgs>(args?: SelectSubset<T, LandSaleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LandSales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandSaleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LandSales
     * const landSale = await prisma.landSale.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LandSaleUpdateManyArgs>(args: SelectSubset<T, LandSaleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LandSale.
     * @param {LandSaleUpsertArgs} args - Arguments to update or create a LandSale.
     * @example
     * // Update or create a LandSale
     * const landSale = await prisma.landSale.upsert({
     *   create: {
     *     // ... data to create a LandSale
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LandSale we want to update
     *   }
     * })
     */
    upsert<T extends LandSaleUpsertArgs>(args: SelectSubset<T, LandSaleUpsertArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LandSales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandSaleCountArgs} args - Arguments to filter LandSales to count.
     * @example
     * // Count the number of LandSales
     * const count = await prisma.landSale.count({
     *   where: {
     *     // ... the filter for the LandSales we want to count
     *   }
     * })
    **/
    count<T extends LandSaleCountArgs>(
      args?: Subset<T, LandSaleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LandSaleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LandSale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandSaleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends LandSaleAggregateArgs>(args: Subset<T, LandSaleAggregateArgs>): Prisma.PrismaPromise<GetLandSaleAggregateType<T>>

    /**
     * Group by LandSale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LandSaleGroupByArgs} args - Group by arguments.
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
      T extends LandSaleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LandSaleGroupByArgs['orderBy'] }
        : { orderBy?: LandSaleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, LandSaleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLandSaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LandSale model
   */
  readonly fields: LandSaleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LandSale.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LandSaleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends LandProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LandProjectDefaultArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    plot<T extends LandSale$plotArgs<ExtArgs> = {}>(args?: Subset<T, LandSale$plotArgs<ExtArgs>>): Prisma__ProjectPlotClient<$Result.GetResult<Prisma.$ProjectPlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    installmentSchedules<T extends LandSale$installmentSchedulesArgs<ExtArgs> = {}>(args?: Subset<T, LandSale$installmentSchedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    customerPayments<T extends LandSale$customerPaymentsArgs<ExtArgs> = {}>(args?: Subset<T, LandSale$customerPaymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the LandSale model
   */
  interface LandSaleFieldRefs {
    readonly id: FieldRef<"LandSale", 'String'>
    readonly projectId: FieldRef<"LandSale", 'String'>
    readonly plotId: FieldRef<"LandSale", 'String'>
    readonly buyerName: FieldRef<"LandSale", 'String'>
    readonly buyerPhone: FieldRef<"LandSale", 'String'>
    readonly buyerNid: FieldRef<"LandSale", 'String'>
    readonly saleDate: FieldRef<"LandSale", 'DateTime'>
    readonly totalAgreedPrice: FieldRef<"LandSale", 'Decimal'>
    readonly advanceBookingAmount: FieldRef<"LandSale", 'Decimal'>
    readonly currentDueAmount: FieldRef<"LandSale", 'Decimal'>
    readonly status: FieldRef<"LandSale", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LandSale findUnique
   */
  export type LandSaleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * Filter, which LandSale to fetch.
     */
    where: LandSaleWhereUniqueInput
  }

  /**
   * LandSale findUniqueOrThrow
   */
  export type LandSaleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * Filter, which LandSale to fetch.
     */
    where: LandSaleWhereUniqueInput
  }

  /**
   * LandSale findFirst
   */
  export type LandSaleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * Filter, which LandSale to fetch.
     */
    where?: LandSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandSales to fetch.
     */
    orderBy?: LandSaleOrderByWithRelationInput | LandSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandSales.
     */
    cursor?: LandSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandSales.
     */
    distinct?: LandSaleScalarFieldEnum | LandSaleScalarFieldEnum[]
  }

  /**
   * LandSale findFirstOrThrow
   */
  export type LandSaleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * Filter, which LandSale to fetch.
     */
    where?: LandSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandSales to fetch.
     */
    orderBy?: LandSaleOrderByWithRelationInput | LandSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LandSales.
     */
    cursor?: LandSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandSales.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LandSales.
     */
    distinct?: LandSaleScalarFieldEnum | LandSaleScalarFieldEnum[]
  }

  /**
   * LandSale findMany
   */
  export type LandSaleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * Filter, which LandSales to fetch.
     */
    where?: LandSaleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LandSales to fetch.
     */
    orderBy?: LandSaleOrderByWithRelationInput | LandSaleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LandSales.
     */
    cursor?: LandSaleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LandSales from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LandSales.
     */
    skip?: number
    distinct?: LandSaleScalarFieldEnum | LandSaleScalarFieldEnum[]
  }

  /**
   * LandSale create
   */
  export type LandSaleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * The data needed to create a LandSale.
     */
    data: XOR<LandSaleCreateInput, LandSaleUncheckedCreateInput>
  }

  /**
   * LandSale createMany
   */
  export type LandSaleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LandSales.
     */
    data: LandSaleCreateManyInput | LandSaleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LandSale update
   */
  export type LandSaleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * The data needed to update a LandSale.
     */
    data: XOR<LandSaleUpdateInput, LandSaleUncheckedUpdateInput>
    /**
     * Choose, which LandSale to update.
     */
    where: LandSaleWhereUniqueInput
  }

  /**
   * LandSale updateMany
   */
  export type LandSaleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LandSales.
     */
    data: XOR<LandSaleUpdateManyMutationInput, LandSaleUncheckedUpdateManyInput>
    /**
     * Filter which LandSales to update
     */
    where?: LandSaleWhereInput
    /**
     * Limit how many LandSales to update.
     */
    limit?: number
  }

  /**
   * LandSale upsert
   */
  export type LandSaleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * The filter to search for the LandSale to update in case it exists.
     */
    where: LandSaleWhereUniqueInput
    /**
     * In case the LandSale found by the `where` argument doesn't exist, create a new LandSale with this data.
     */
    create: XOR<LandSaleCreateInput, LandSaleUncheckedCreateInput>
    /**
     * In case the LandSale was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LandSaleUpdateInput, LandSaleUncheckedUpdateInput>
  }

  /**
   * LandSale delete
   */
  export type LandSaleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
    /**
     * Filter which LandSale to delete.
     */
    where: LandSaleWhereUniqueInput
  }

  /**
   * LandSale deleteMany
   */
  export type LandSaleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LandSales to delete
     */
    where?: LandSaleWhereInput
    /**
     * Limit how many LandSales to delete.
     */
    limit?: number
  }

  /**
   * LandSale.plot
   */
  export type LandSale$plotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectPlot
     */
    select?: ProjectPlotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProjectPlot
     */
    omit?: ProjectPlotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectPlotInclude<ExtArgs> | null
    where?: ProjectPlotWhereInput
  }

  /**
   * LandSale.installmentSchedules
   */
  export type LandSale$installmentSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    where?: InstallmentScheduleWhereInput
    orderBy?: InstallmentScheduleOrderByWithRelationInput | InstallmentScheduleOrderByWithRelationInput[]
    cursor?: InstallmentScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InstallmentScheduleScalarFieldEnum | InstallmentScheduleScalarFieldEnum[]
  }

  /**
   * LandSale.customerPayments
   */
  export type LandSale$customerPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    where?: CustomerPaymentWhereInput
    orderBy?: CustomerPaymentOrderByWithRelationInput | CustomerPaymentOrderByWithRelationInput[]
    cursor?: CustomerPaymentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CustomerPaymentScalarFieldEnum | CustomerPaymentScalarFieldEnum[]
  }

  /**
   * LandSale without action
   */
  export type LandSaleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LandSale
     */
    select?: LandSaleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LandSale
     */
    omit?: LandSaleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LandSaleInclude<ExtArgs> | null
  }


  /**
   * Model InstallmentSchedule
   */

  export type AggregateInstallmentSchedule = {
    _count: InstallmentScheduleCountAggregateOutputType | null
    _avg: InstallmentScheduleAvgAggregateOutputType | null
    _sum: InstallmentScheduleSumAggregateOutputType | null
    _min: InstallmentScheduleMinAggregateOutputType | null
    _max: InstallmentScheduleMaxAggregateOutputType | null
  }

  export type InstallmentScheduleAvgAggregateOutputType = {
    dueAmount: Decimal | null
  }

  export type InstallmentScheduleSumAggregateOutputType = {
    dueAmount: Decimal | null
  }

  export type InstallmentScheduleMinAggregateOutputType = {
    id: string | null
    saleId: string | null
    dueDate: Date | null
    dueAmount: Decimal | null
    status: string | null
  }

  export type InstallmentScheduleMaxAggregateOutputType = {
    id: string | null
    saleId: string | null
    dueDate: Date | null
    dueAmount: Decimal | null
    status: string | null
  }

  export type InstallmentScheduleCountAggregateOutputType = {
    id: number
    saleId: number
    dueDate: number
    dueAmount: number
    status: number
    _all: number
  }


  export type InstallmentScheduleAvgAggregateInputType = {
    dueAmount?: true
  }

  export type InstallmentScheduleSumAggregateInputType = {
    dueAmount?: true
  }

  export type InstallmentScheduleMinAggregateInputType = {
    id?: true
    saleId?: true
    dueDate?: true
    dueAmount?: true
    status?: true
  }

  export type InstallmentScheduleMaxAggregateInputType = {
    id?: true
    saleId?: true
    dueDate?: true
    dueAmount?: true
    status?: true
  }

  export type InstallmentScheduleCountAggregateInputType = {
    id?: true
    saleId?: true
    dueDate?: true
    dueAmount?: true
    status?: true
    _all?: true
  }

  export type InstallmentScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InstallmentSchedule to aggregate.
     */
    where?: InstallmentScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstallmentSchedules to fetch.
     */
    orderBy?: InstallmentScheduleOrderByWithRelationInput | InstallmentScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InstallmentScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstallmentSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstallmentSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InstallmentSchedules
    **/
    _count?: true | InstallmentScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InstallmentScheduleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InstallmentScheduleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InstallmentScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InstallmentScheduleMaxAggregateInputType
  }

  export type GetInstallmentScheduleAggregateType<T extends InstallmentScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateInstallmentSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInstallmentSchedule[P]>
      : GetScalarType<T[P], AggregateInstallmentSchedule[P]>
  }




  export type InstallmentScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InstallmentScheduleWhereInput
    orderBy?: InstallmentScheduleOrderByWithAggregationInput | InstallmentScheduleOrderByWithAggregationInput[]
    by: InstallmentScheduleScalarFieldEnum[] | InstallmentScheduleScalarFieldEnum
    having?: InstallmentScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InstallmentScheduleCountAggregateInputType | true
    _avg?: InstallmentScheduleAvgAggregateInputType
    _sum?: InstallmentScheduleSumAggregateInputType
    _min?: InstallmentScheduleMinAggregateInputType
    _max?: InstallmentScheduleMaxAggregateInputType
  }

  export type InstallmentScheduleGroupByOutputType = {
    id: string
    saleId: string
    dueDate: Date
    dueAmount: Decimal
    status: string
    _count: InstallmentScheduleCountAggregateOutputType | null
    _avg: InstallmentScheduleAvgAggregateOutputType | null
    _sum: InstallmentScheduleSumAggregateOutputType | null
    _min: InstallmentScheduleMinAggregateOutputType | null
    _max: InstallmentScheduleMaxAggregateOutputType | null
  }

  type GetInstallmentScheduleGroupByPayload<T extends InstallmentScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InstallmentScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InstallmentScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InstallmentScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], InstallmentScheduleGroupByOutputType[P]>
        }
      >
    >


  export type InstallmentScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    dueDate?: boolean
    dueAmount?: boolean
    status?: boolean
    sale?: boolean | LandSaleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["installmentSchedule"]>



  export type InstallmentScheduleSelectScalar = {
    id?: boolean
    saleId?: boolean
    dueDate?: boolean
    dueAmount?: boolean
    status?: boolean
  }

  export type InstallmentScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "saleId" | "dueDate" | "dueAmount" | "status", ExtArgs["result"]["installmentSchedule"]>
  export type InstallmentScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | LandSaleDefaultArgs<ExtArgs>
  }

  export type $InstallmentSchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InstallmentSchedule"
    objects: {
      sale: Prisma.$LandSalePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      saleId: string
      dueDate: Date
      dueAmount: Prisma.Decimal
      status: string
    }, ExtArgs["result"]["installmentSchedule"]>
    composites: {}
  }

  type InstallmentScheduleGetPayload<S extends boolean | null | undefined | InstallmentScheduleDefaultArgs> = $Result.GetResult<Prisma.$InstallmentSchedulePayload, S>

  type InstallmentScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InstallmentScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InstallmentScheduleCountAggregateInputType | true
    }

  export interface InstallmentScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InstallmentSchedule'], meta: { name: 'InstallmentSchedule' } }
    /**
     * Find zero or one InstallmentSchedule that matches the filter.
     * @param {InstallmentScheduleFindUniqueArgs} args - Arguments to find a InstallmentSchedule
     * @example
     * // Get one InstallmentSchedule
     * const installmentSchedule = await prisma.installmentSchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InstallmentScheduleFindUniqueArgs>(args: SelectSubset<T, InstallmentScheduleFindUniqueArgs<ExtArgs>>): Prisma__InstallmentScheduleClient<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one InstallmentSchedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InstallmentScheduleFindUniqueOrThrowArgs} args - Arguments to find a InstallmentSchedule
     * @example
     * // Get one InstallmentSchedule
     * const installmentSchedule = await prisma.installmentSchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InstallmentScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, InstallmentScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InstallmentScheduleClient<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InstallmentSchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstallmentScheduleFindFirstArgs} args - Arguments to find a InstallmentSchedule
     * @example
     * // Get one InstallmentSchedule
     * const installmentSchedule = await prisma.installmentSchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InstallmentScheduleFindFirstArgs>(args?: SelectSubset<T, InstallmentScheduleFindFirstArgs<ExtArgs>>): Prisma__InstallmentScheduleClient<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first InstallmentSchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstallmentScheduleFindFirstOrThrowArgs} args - Arguments to find a InstallmentSchedule
     * @example
     * // Get one InstallmentSchedule
     * const installmentSchedule = await prisma.installmentSchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InstallmentScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, InstallmentScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__InstallmentScheduleClient<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more InstallmentSchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstallmentScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InstallmentSchedules
     * const installmentSchedules = await prisma.installmentSchedule.findMany()
     * 
     * // Get first 10 InstallmentSchedules
     * const installmentSchedules = await prisma.installmentSchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const installmentScheduleWithIdOnly = await prisma.installmentSchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InstallmentScheduleFindManyArgs>(args?: SelectSubset<T, InstallmentScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a InstallmentSchedule.
     * @param {InstallmentScheduleCreateArgs} args - Arguments to create a InstallmentSchedule.
     * @example
     * // Create one InstallmentSchedule
     * const InstallmentSchedule = await prisma.installmentSchedule.create({
     *   data: {
     *     // ... data to create a InstallmentSchedule
     *   }
     * })
     * 
     */
    create<T extends InstallmentScheduleCreateArgs>(args: SelectSubset<T, InstallmentScheduleCreateArgs<ExtArgs>>): Prisma__InstallmentScheduleClient<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many InstallmentSchedules.
     * @param {InstallmentScheduleCreateManyArgs} args - Arguments to create many InstallmentSchedules.
     * @example
     * // Create many InstallmentSchedules
     * const installmentSchedule = await prisma.installmentSchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InstallmentScheduleCreateManyArgs>(args?: SelectSubset<T, InstallmentScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a InstallmentSchedule.
     * @param {InstallmentScheduleDeleteArgs} args - Arguments to delete one InstallmentSchedule.
     * @example
     * // Delete one InstallmentSchedule
     * const InstallmentSchedule = await prisma.installmentSchedule.delete({
     *   where: {
     *     // ... filter to delete one InstallmentSchedule
     *   }
     * })
     * 
     */
    delete<T extends InstallmentScheduleDeleteArgs>(args: SelectSubset<T, InstallmentScheduleDeleteArgs<ExtArgs>>): Prisma__InstallmentScheduleClient<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one InstallmentSchedule.
     * @param {InstallmentScheduleUpdateArgs} args - Arguments to update one InstallmentSchedule.
     * @example
     * // Update one InstallmentSchedule
     * const installmentSchedule = await prisma.installmentSchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InstallmentScheduleUpdateArgs>(args: SelectSubset<T, InstallmentScheduleUpdateArgs<ExtArgs>>): Prisma__InstallmentScheduleClient<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more InstallmentSchedules.
     * @param {InstallmentScheduleDeleteManyArgs} args - Arguments to filter InstallmentSchedules to delete.
     * @example
     * // Delete a few InstallmentSchedules
     * const { count } = await prisma.installmentSchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InstallmentScheduleDeleteManyArgs>(args?: SelectSubset<T, InstallmentScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InstallmentSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstallmentScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InstallmentSchedules
     * const installmentSchedule = await prisma.installmentSchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InstallmentScheduleUpdateManyArgs>(args: SelectSubset<T, InstallmentScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InstallmentSchedule.
     * @param {InstallmentScheduleUpsertArgs} args - Arguments to update or create a InstallmentSchedule.
     * @example
     * // Update or create a InstallmentSchedule
     * const installmentSchedule = await prisma.installmentSchedule.upsert({
     *   create: {
     *     // ... data to create a InstallmentSchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InstallmentSchedule we want to update
     *   }
     * })
     */
    upsert<T extends InstallmentScheduleUpsertArgs>(args: SelectSubset<T, InstallmentScheduleUpsertArgs<ExtArgs>>): Prisma__InstallmentScheduleClient<$Result.GetResult<Prisma.$InstallmentSchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of InstallmentSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstallmentScheduleCountArgs} args - Arguments to filter InstallmentSchedules to count.
     * @example
     * // Count the number of InstallmentSchedules
     * const count = await prisma.installmentSchedule.count({
     *   where: {
     *     // ... the filter for the InstallmentSchedules we want to count
     *   }
     * })
    **/
    count<T extends InstallmentScheduleCountArgs>(
      args?: Subset<T, InstallmentScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InstallmentScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InstallmentSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstallmentScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends InstallmentScheduleAggregateArgs>(args: Subset<T, InstallmentScheduleAggregateArgs>): Prisma.PrismaPromise<GetInstallmentScheduleAggregateType<T>>

    /**
     * Group by InstallmentSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InstallmentScheduleGroupByArgs} args - Group by arguments.
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
      T extends InstallmentScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InstallmentScheduleGroupByArgs['orderBy'] }
        : { orderBy?: InstallmentScheduleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, InstallmentScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInstallmentScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InstallmentSchedule model
   */
  readonly fields: InstallmentScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InstallmentSchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InstallmentScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends LandSaleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LandSaleDefaultArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the InstallmentSchedule model
   */
  interface InstallmentScheduleFieldRefs {
    readonly id: FieldRef<"InstallmentSchedule", 'String'>
    readonly saleId: FieldRef<"InstallmentSchedule", 'String'>
    readonly dueDate: FieldRef<"InstallmentSchedule", 'DateTime'>
    readonly dueAmount: FieldRef<"InstallmentSchedule", 'Decimal'>
    readonly status: FieldRef<"InstallmentSchedule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * InstallmentSchedule findUnique
   */
  export type InstallmentScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * Filter, which InstallmentSchedule to fetch.
     */
    where: InstallmentScheduleWhereUniqueInput
  }

  /**
   * InstallmentSchedule findUniqueOrThrow
   */
  export type InstallmentScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * Filter, which InstallmentSchedule to fetch.
     */
    where: InstallmentScheduleWhereUniqueInput
  }

  /**
   * InstallmentSchedule findFirst
   */
  export type InstallmentScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * Filter, which InstallmentSchedule to fetch.
     */
    where?: InstallmentScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstallmentSchedules to fetch.
     */
    orderBy?: InstallmentScheduleOrderByWithRelationInput | InstallmentScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InstallmentSchedules.
     */
    cursor?: InstallmentScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstallmentSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstallmentSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InstallmentSchedules.
     */
    distinct?: InstallmentScheduleScalarFieldEnum | InstallmentScheduleScalarFieldEnum[]
  }

  /**
   * InstallmentSchedule findFirstOrThrow
   */
  export type InstallmentScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * Filter, which InstallmentSchedule to fetch.
     */
    where?: InstallmentScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstallmentSchedules to fetch.
     */
    orderBy?: InstallmentScheduleOrderByWithRelationInput | InstallmentScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InstallmentSchedules.
     */
    cursor?: InstallmentScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstallmentSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstallmentSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InstallmentSchedules.
     */
    distinct?: InstallmentScheduleScalarFieldEnum | InstallmentScheduleScalarFieldEnum[]
  }

  /**
   * InstallmentSchedule findMany
   */
  export type InstallmentScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * Filter, which InstallmentSchedules to fetch.
     */
    where?: InstallmentScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InstallmentSchedules to fetch.
     */
    orderBy?: InstallmentScheduleOrderByWithRelationInput | InstallmentScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InstallmentSchedules.
     */
    cursor?: InstallmentScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InstallmentSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InstallmentSchedules.
     */
    skip?: number
    distinct?: InstallmentScheduleScalarFieldEnum | InstallmentScheduleScalarFieldEnum[]
  }

  /**
   * InstallmentSchedule create
   */
  export type InstallmentScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a InstallmentSchedule.
     */
    data: XOR<InstallmentScheduleCreateInput, InstallmentScheduleUncheckedCreateInput>
  }

  /**
   * InstallmentSchedule createMany
   */
  export type InstallmentScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InstallmentSchedules.
     */
    data: InstallmentScheduleCreateManyInput | InstallmentScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InstallmentSchedule update
   */
  export type InstallmentScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a InstallmentSchedule.
     */
    data: XOR<InstallmentScheduleUpdateInput, InstallmentScheduleUncheckedUpdateInput>
    /**
     * Choose, which InstallmentSchedule to update.
     */
    where: InstallmentScheduleWhereUniqueInput
  }

  /**
   * InstallmentSchedule updateMany
   */
  export type InstallmentScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InstallmentSchedules.
     */
    data: XOR<InstallmentScheduleUpdateManyMutationInput, InstallmentScheduleUncheckedUpdateManyInput>
    /**
     * Filter which InstallmentSchedules to update
     */
    where?: InstallmentScheduleWhereInput
    /**
     * Limit how many InstallmentSchedules to update.
     */
    limit?: number
  }

  /**
   * InstallmentSchedule upsert
   */
  export type InstallmentScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the InstallmentSchedule to update in case it exists.
     */
    where: InstallmentScheduleWhereUniqueInput
    /**
     * In case the InstallmentSchedule found by the `where` argument doesn't exist, create a new InstallmentSchedule with this data.
     */
    create: XOR<InstallmentScheduleCreateInput, InstallmentScheduleUncheckedCreateInput>
    /**
     * In case the InstallmentSchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InstallmentScheduleUpdateInput, InstallmentScheduleUncheckedUpdateInput>
  }

  /**
   * InstallmentSchedule delete
   */
  export type InstallmentScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
    /**
     * Filter which InstallmentSchedule to delete.
     */
    where: InstallmentScheduleWhereUniqueInput
  }

  /**
   * InstallmentSchedule deleteMany
   */
  export type InstallmentScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InstallmentSchedules to delete
     */
    where?: InstallmentScheduleWhereInput
    /**
     * Limit how many InstallmentSchedules to delete.
     */
    limit?: number
  }

  /**
   * InstallmentSchedule without action
   */
  export type InstallmentScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InstallmentSchedule
     */
    select?: InstallmentScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the InstallmentSchedule
     */
    omit?: InstallmentScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InstallmentScheduleInclude<ExtArgs> | null
  }


  /**
   * Model CustomerPayment
   */

  export type AggregateCustomerPayment = {
    _count: CustomerPaymentCountAggregateOutputType | null
    _avg: CustomerPaymentAvgAggregateOutputType | null
    _sum: CustomerPaymentSumAggregateOutputType | null
    _min: CustomerPaymentMinAggregateOutputType | null
    _max: CustomerPaymentMaxAggregateOutputType | null
  }

  export type CustomerPaymentAvgAggregateOutputType = {
    amountPaid: Decimal | null
  }

  export type CustomerPaymentSumAggregateOutputType = {
    amountPaid: Decimal | null
  }

  export type CustomerPaymentMinAggregateOutputType = {
    id: string | null
    saleId: string | null
    paymentDate: Date | null
    amountPaid: Decimal | null
    paymentMethod: string | null
    bankAccountId: string | null
    receiptNo: string | null
    remarks: string | null
  }

  export type CustomerPaymentMaxAggregateOutputType = {
    id: string | null
    saleId: string | null
    paymentDate: Date | null
    amountPaid: Decimal | null
    paymentMethod: string | null
    bankAccountId: string | null
    receiptNo: string | null
    remarks: string | null
  }

  export type CustomerPaymentCountAggregateOutputType = {
    id: number
    saleId: number
    paymentDate: number
    amountPaid: number
    paymentMethod: number
    bankAccountId: number
    receiptNo: number
    remarks: number
    _all: number
  }


  export type CustomerPaymentAvgAggregateInputType = {
    amountPaid?: true
  }

  export type CustomerPaymentSumAggregateInputType = {
    amountPaid?: true
  }

  export type CustomerPaymentMinAggregateInputType = {
    id?: true
    saleId?: true
    paymentDate?: true
    amountPaid?: true
    paymentMethod?: true
    bankAccountId?: true
    receiptNo?: true
    remarks?: true
  }

  export type CustomerPaymentMaxAggregateInputType = {
    id?: true
    saleId?: true
    paymentDate?: true
    amountPaid?: true
    paymentMethod?: true
    bankAccountId?: true
    receiptNo?: true
    remarks?: true
  }

  export type CustomerPaymentCountAggregateInputType = {
    id?: true
    saleId?: true
    paymentDate?: true
    amountPaid?: true
    paymentMethod?: true
    bankAccountId?: true
    receiptNo?: true
    remarks?: true
    _all?: true
  }

  export type CustomerPaymentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerPayment to aggregate.
     */
    where?: CustomerPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerPayments to fetch.
     */
    orderBy?: CustomerPaymentOrderByWithRelationInput | CustomerPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomerPayments
    **/
    _count?: true | CustomerPaymentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomerPaymentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomerPaymentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerPaymentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerPaymentMaxAggregateInputType
  }

  export type GetCustomerPaymentAggregateType<T extends CustomerPaymentAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomerPayment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomerPayment[P]>
      : GetScalarType<T[P], AggregateCustomerPayment[P]>
  }




  export type CustomerPaymentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerPaymentWhereInput
    orderBy?: CustomerPaymentOrderByWithAggregationInput | CustomerPaymentOrderByWithAggregationInput[]
    by: CustomerPaymentScalarFieldEnum[] | CustomerPaymentScalarFieldEnum
    having?: CustomerPaymentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerPaymentCountAggregateInputType | true
    _avg?: CustomerPaymentAvgAggregateInputType
    _sum?: CustomerPaymentSumAggregateInputType
    _min?: CustomerPaymentMinAggregateInputType
    _max?: CustomerPaymentMaxAggregateInputType
  }

  export type CustomerPaymentGroupByOutputType = {
    id: string
    saleId: string
    paymentDate: Date
    amountPaid: Decimal
    paymentMethod: string
    bankAccountId: string | null
    receiptNo: string
    remarks: string | null
    _count: CustomerPaymentCountAggregateOutputType | null
    _avg: CustomerPaymentAvgAggregateOutputType | null
    _sum: CustomerPaymentSumAggregateOutputType | null
    _min: CustomerPaymentMinAggregateOutputType | null
    _max: CustomerPaymentMaxAggregateOutputType | null
  }

  type GetCustomerPaymentGroupByPayload<T extends CustomerPaymentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerPaymentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerPaymentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerPaymentGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerPaymentGroupByOutputType[P]>
        }
      >
    >


  export type CustomerPaymentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    saleId?: boolean
    paymentDate?: boolean
    amountPaid?: boolean
    paymentMethod?: boolean
    bankAccountId?: boolean
    receiptNo?: boolean
    remarks?: boolean
    sale?: boolean | LandSaleDefaultArgs<ExtArgs>
    bankAccount?: boolean | CustomerPayment$bankAccountArgs<ExtArgs>
  }, ExtArgs["result"]["customerPayment"]>



  export type CustomerPaymentSelectScalar = {
    id?: boolean
    saleId?: boolean
    paymentDate?: boolean
    amountPaid?: boolean
    paymentMethod?: boolean
    bankAccountId?: boolean
    receiptNo?: boolean
    remarks?: boolean
  }

  export type CustomerPaymentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "saleId" | "paymentDate" | "amountPaid" | "paymentMethod" | "bankAccountId" | "receiptNo" | "remarks", ExtArgs["result"]["customerPayment"]>
  export type CustomerPaymentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sale?: boolean | LandSaleDefaultArgs<ExtArgs>
    bankAccount?: boolean | CustomerPayment$bankAccountArgs<ExtArgs>
  }

  export type $CustomerPaymentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomerPayment"
    objects: {
      sale: Prisma.$LandSalePayload<ExtArgs>
      bankAccount: Prisma.$BankAccountPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      saleId: string
      paymentDate: Date
      amountPaid: Prisma.Decimal
      paymentMethod: string
      bankAccountId: string | null
      receiptNo: string
      remarks: string | null
    }, ExtArgs["result"]["customerPayment"]>
    composites: {}
  }

  type CustomerPaymentGetPayload<S extends boolean | null | undefined | CustomerPaymentDefaultArgs> = $Result.GetResult<Prisma.$CustomerPaymentPayload, S>

  type CustomerPaymentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CustomerPaymentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CustomerPaymentCountAggregateInputType | true
    }

  export interface CustomerPaymentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomerPayment'], meta: { name: 'CustomerPayment' } }
    /**
     * Find zero or one CustomerPayment that matches the filter.
     * @param {CustomerPaymentFindUniqueArgs} args - Arguments to find a CustomerPayment
     * @example
     * // Get one CustomerPayment
     * const customerPayment = await prisma.customerPayment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerPaymentFindUniqueArgs>(args: SelectSubset<T, CustomerPaymentFindUniqueArgs<ExtArgs>>): Prisma__CustomerPaymentClient<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CustomerPayment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerPaymentFindUniqueOrThrowArgs} args - Arguments to find a CustomerPayment
     * @example
     * // Get one CustomerPayment
     * const customerPayment = await prisma.customerPayment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerPaymentFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerPaymentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerPaymentClient<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerPayment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPaymentFindFirstArgs} args - Arguments to find a CustomerPayment
     * @example
     * // Get one CustomerPayment
     * const customerPayment = await prisma.customerPayment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerPaymentFindFirstArgs>(args?: SelectSubset<T, CustomerPaymentFindFirstArgs<ExtArgs>>): Prisma__CustomerPaymentClient<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CustomerPayment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPaymentFindFirstOrThrowArgs} args - Arguments to find a CustomerPayment
     * @example
     * // Get one CustomerPayment
     * const customerPayment = await prisma.customerPayment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerPaymentFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerPaymentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerPaymentClient<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CustomerPayments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPaymentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomerPayments
     * const customerPayments = await prisma.customerPayment.findMany()
     * 
     * // Get first 10 CustomerPayments
     * const customerPayments = await prisma.customerPayment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerPaymentWithIdOnly = await prisma.customerPayment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerPaymentFindManyArgs>(args?: SelectSubset<T, CustomerPaymentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CustomerPayment.
     * @param {CustomerPaymentCreateArgs} args - Arguments to create a CustomerPayment.
     * @example
     * // Create one CustomerPayment
     * const CustomerPayment = await prisma.customerPayment.create({
     *   data: {
     *     // ... data to create a CustomerPayment
     *   }
     * })
     * 
     */
    create<T extends CustomerPaymentCreateArgs>(args: SelectSubset<T, CustomerPaymentCreateArgs<ExtArgs>>): Prisma__CustomerPaymentClient<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CustomerPayments.
     * @param {CustomerPaymentCreateManyArgs} args - Arguments to create many CustomerPayments.
     * @example
     * // Create many CustomerPayments
     * const customerPayment = await prisma.customerPayment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerPaymentCreateManyArgs>(args?: SelectSubset<T, CustomerPaymentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CustomerPayment.
     * @param {CustomerPaymentDeleteArgs} args - Arguments to delete one CustomerPayment.
     * @example
     * // Delete one CustomerPayment
     * const CustomerPayment = await prisma.customerPayment.delete({
     *   where: {
     *     // ... filter to delete one CustomerPayment
     *   }
     * })
     * 
     */
    delete<T extends CustomerPaymentDeleteArgs>(args: SelectSubset<T, CustomerPaymentDeleteArgs<ExtArgs>>): Prisma__CustomerPaymentClient<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CustomerPayment.
     * @param {CustomerPaymentUpdateArgs} args - Arguments to update one CustomerPayment.
     * @example
     * // Update one CustomerPayment
     * const customerPayment = await prisma.customerPayment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerPaymentUpdateArgs>(args: SelectSubset<T, CustomerPaymentUpdateArgs<ExtArgs>>): Prisma__CustomerPaymentClient<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CustomerPayments.
     * @param {CustomerPaymentDeleteManyArgs} args - Arguments to filter CustomerPayments to delete.
     * @example
     * // Delete a few CustomerPayments
     * const { count } = await prisma.customerPayment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerPaymentDeleteManyArgs>(args?: SelectSubset<T, CustomerPaymentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomerPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPaymentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomerPayments
     * const customerPayment = await prisma.customerPayment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerPaymentUpdateManyArgs>(args: SelectSubset<T, CustomerPaymentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CustomerPayment.
     * @param {CustomerPaymentUpsertArgs} args - Arguments to update or create a CustomerPayment.
     * @example
     * // Update or create a CustomerPayment
     * const customerPayment = await prisma.customerPayment.upsert({
     *   create: {
     *     // ... data to create a CustomerPayment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomerPayment we want to update
     *   }
     * })
     */
    upsert<T extends CustomerPaymentUpsertArgs>(args: SelectSubset<T, CustomerPaymentUpsertArgs<ExtArgs>>): Prisma__CustomerPaymentClient<$Result.GetResult<Prisma.$CustomerPaymentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CustomerPayments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPaymentCountArgs} args - Arguments to filter CustomerPayments to count.
     * @example
     * // Count the number of CustomerPayments
     * const count = await prisma.customerPayment.count({
     *   where: {
     *     // ... the filter for the CustomerPayments we want to count
     *   }
     * })
    **/
    count<T extends CustomerPaymentCountArgs>(
      args?: Subset<T, CustomerPaymentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerPaymentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomerPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPaymentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CustomerPaymentAggregateArgs>(args: Subset<T, CustomerPaymentAggregateArgs>): Prisma.PrismaPromise<GetCustomerPaymentAggregateType<T>>

    /**
     * Group by CustomerPayment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerPaymentGroupByArgs} args - Group by arguments.
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
      T extends CustomerPaymentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerPaymentGroupByArgs['orderBy'] }
        : { orderBy?: CustomerPaymentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CustomerPaymentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerPaymentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomerPayment model
   */
  readonly fields: CustomerPaymentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomerPayment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerPaymentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sale<T extends LandSaleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LandSaleDefaultArgs<ExtArgs>>): Prisma__LandSaleClient<$Result.GetResult<Prisma.$LandSalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    bankAccount<T extends CustomerPayment$bankAccountArgs<ExtArgs> = {}>(args?: Subset<T, CustomerPayment$bankAccountArgs<ExtArgs>>): Prisma__BankAccountClient<$Result.GetResult<Prisma.$BankAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the CustomerPayment model
   */
  interface CustomerPaymentFieldRefs {
    readonly id: FieldRef<"CustomerPayment", 'String'>
    readonly saleId: FieldRef<"CustomerPayment", 'String'>
    readonly paymentDate: FieldRef<"CustomerPayment", 'DateTime'>
    readonly amountPaid: FieldRef<"CustomerPayment", 'Decimal'>
    readonly paymentMethod: FieldRef<"CustomerPayment", 'String'>
    readonly bankAccountId: FieldRef<"CustomerPayment", 'String'>
    readonly receiptNo: FieldRef<"CustomerPayment", 'String'>
    readonly remarks: FieldRef<"CustomerPayment", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CustomerPayment findUnique
   */
  export type CustomerPaymentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPayment to fetch.
     */
    where: CustomerPaymentWhereUniqueInput
  }

  /**
   * CustomerPayment findUniqueOrThrow
   */
  export type CustomerPaymentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPayment to fetch.
     */
    where: CustomerPaymentWhereUniqueInput
  }

  /**
   * CustomerPayment findFirst
   */
  export type CustomerPaymentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPayment to fetch.
     */
    where?: CustomerPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerPayments to fetch.
     */
    orderBy?: CustomerPaymentOrderByWithRelationInput | CustomerPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerPayments.
     */
    cursor?: CustomerPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerPayments.
     */
    distinct?: CustomerPaymentScalarFieldEnum | CustomerPaymentScalarFieldEnum[]
  }

  /**
   * CustomerPayment findFirstOrThrow
   */
  export type CustomerPaymentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPayment to fetch.
     */
    where?: CustomerPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerPayments to fetch.
     */
    orderBy?: CustomerPaymentOrderByWithRelationInput | CustomerPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomerPayments.
     */
    cursor?: CustomerPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerPayments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomerPayments.
     */
    distinct?: CustomerPaymentScalarFieldEnum | CustomerPaymentScalarFieldEnum[]
  }

  /**
   * CustomerPayment findMany
   */
  export type CustomerPaymentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * Filter, which CustomerPayments to fetch.
     */
    where?: CustomerPaymentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomerPayments to fetch.
     */
    orderBy?: CustomerPaymentOrderByWithRelationInput | CustomerPaymentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomerPayments.
     */
    cursor?: CustomerPaymentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomerPayments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomerPayments.
     */
    skip?: number
    distinct?: CustomerPaymentScalarFieldEnum | CustomerPaymentScalarFieldEnum[]
  }

  /**
   * CustomerPayment create
   */
  export type CustomerPaymentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * The data needed to create a CustomerPayment.
     */
    data: XOR<CustomerPaymentCreateInput, CustomerPaymentUncheckedCreateInput>
  }

  /**
   * CustomerPayment createMany
   */
  export type CustomerPaymentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomerPayments.
     */
    data: CustomerPaymentCreateManyInput | CustomerPaymentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomerPayment update
   */
  export type CustomerPaymentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * The data needed to update a CustomerPayment.
     */
    data: XOR<CustomerPaymentUpdateInput, CustomerPaymentUncheckedUpdateInput>
    /**
     * Choose, which CustomerPayment to update.
     */
    where: CustomerPaymentWhereUniqueInput
  }

  /**
   * CustomerPayment updateMany
   */
  export type CustomerPaymentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomerPayments.
     */
    data: XOR<CustomerPaymentUpdateManyMutationInput, CustomerPaymentUncheckedUpdateManyInput>
    /**
     * Filter which CustomerPayments to update
     */
    where?: CustomerPaymentWhereInput
    /**
     * Limit how many CustomerPayments to update.
     */
    limit?: number
  }

  /**
   * CustomerPayment upsert
   */
  export type CustomerPaymentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * The filter to search for the CustomerPayment to update in case it exists.
     */
    where: CustomerPaymentWhereUniqueInput
    /**
     * In case the CustomerPayment found by the `where` argument doesn't exist, create a new CustomerPayment with this data.
     */
    create: XOR<CustomerPaymentCreateInput, CustomerPaymentUncheckedCreateInput>
    /**
     * In case the CustomerPayment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerPaymentUpdateInput, CustomerPaymentUncheckedUpdateInput>
  }

  /**
   * CustomerPayment delete
   */
  export type CustomerPaymentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
    /**
     * Filter which CustomerPayment to delete.
     */
    where: CustomerPaymentWhereUniqueInput
  }

  /**
   * CustomerPayment deleteMany
   */
  export type CustomerPaymentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomerPayments to delete
     */
    where?: CustomerPaymentWhereInput
    /**
     * Limit how many CustomerPayments to delete.
     */
    limit?: number
  }

  /**
   * CustomerPayment.bankAccount
   */
  export type CustomerPayment$bankAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BankAccount
     */
    select?: BankAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BankAccount
     */
    omit?: BankAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BankAccountInclude<ExtArgs> | null
    where?: BankAccountWhereInput
  }

  /**
   * CustomerPayment without action
   */
  export type CustomerPaymentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerPayment
     */
    select?: CustomerPaymentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CustomerPayment
     */
    omit?: CustomerPaymentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerPaymentInclude<ExtArgs> | null
  }


  /**
   * Model ProfitDistribution
   */

  export type AggregateProfitDistribution = {
    _count: ProfitDistributionCountAggregateOutputType | null
    _avg: ProfitDistributionAvgAggregateOutputType | null
    _sum: ProfitDistributionSumAggregateOutputType | null
    _min: ProfitDistributionMinAggregateOutputType | null
    _max: ProfitDistributionMaxAggregateOutputType | null
  }

  export type ProfitDistributionAvgAggregateOutputType = {
    totalProjectNetProfit: Decimal | null
    partnerSharePercent: Decimal | null
    payoutAmount: Decimal | null
  }

  export type ProfitDistributionSumAggregateOutputType = {
    totalProjectNetProfit: Decimal | null
    partnerSharePercent: Decimal | null
    payoutAmount: Decimal | null
  }

  export type ProfitDistributionMinAggregateOutputType = {
    id: string | null
    projectId: string | null
    distributionDate: Date | null
    realizationBasis: string | null
    totalProjectNetProfit: Decimal | null
    partnerId: string | null
    partnerSharePercent: Decimal | null
    payoutAmount: Decimal | null
  }

  export type ProfitDistributionMaxAggregateOutputType = {
    id: string | null
    projectId: string | null
    distributionDate: Date | null
    realizationBasis: string | null
    totalProjectNetProfit: Decimal | null
    partnerId: string | null
    partnerSharePercent: Decimal | null
    payoutAmount: Decimal | null
  }

  export type ProfitDistributionCountAggregateOutputType = {
    id: number
    projectId: number
    distributionDate: number
    realizationBasis: number
    totalProjectNetProfit: number
    partnerId: number
    partnerSharePercent: number
    payoutAmount: number
    _all: number
  }


  export type ProfitDistributionAvgAggregateInputType = {
    totalProjectNetProfit?: true
    partnerSharePercent?: true
    payoutAmount?: true
  }

  export type ProfitDistributionSumAggregateInputType = {
    totalProjectNetProfit?: true
    partnerSharePercent?: true
    payoutAmount?: true
  }

  export type ProfitDistributionMinAggregateInputType = {
    id?: true
    projectId?: true
    distributionDate?: true
    realizationBasis?: true
    totalProjectNetProfit?: true
    partnerId?: true
    partnerSharePercent?: true
    payoutAmount?: true
  }

  export type ProfitDistributionMaxAggregateInputType = {
    id?: true
    projectId?: true
    distributionDate?: true
    realizationBasis?: true
    totalProjectNetProfit?: true
    partnerId?: true
    partnerSharePercent?: true
    payoutAmount?: true
  }

  export type ProfitDistributionCountAggregateInputType = {
    id?: true
    projectId?: true
    distributionDate?: true
    realizationBasis?: true
    totalProjectNetProfit?: true
    partnerId?: true
    partnerSharePercent?: true
    payoutAmount?: true
    _all?: true
  }

  export type ProfitDistributionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfitDistribution to aggregate.
     */
    where?: ProfitDistributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfitDistributions to fetch.
     */
    orderBy?: ProfitDistributionOrderByWithRelationInput | ProfitDistributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProfitDistributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfitDistributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfitDistributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProfitDistributions
    **/
    _count?: true | ProfitDistributionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProfitDistributionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProfitDistributionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfitDistributionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfitDistributionMaxAggregateInputType
  }

  export type GetProfitDistributionAggregateType<T extends ProfitDistributionAggregateArgs> = {
        [P in keyof T & keyof AggregateProfitDistribution]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfitDistribution[P]>
      : GetScalarType<T[P], AggregateProfitDistribution[P]>
  }




  export type ProfitDistributionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProfitDistributionWhereInput
    orderBy?: ProfitDistributionOrderByWithAggregationInput | ProfitDistributionOrderByWithAggregationInput[]
    by: ProfitDistributionScalarFieldEnum[] | ProfitDistributionScalarFieldEnum
    having?: ProfitDistributionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfitDistributionCountAggregateInputType | true
    _avg?: ProfitDistributionAvgAggregateInputType
    _sum?: ProfitDistributionSumAggregateInputType
    _min?: ProfitDistributionMinAggregateInputType
    _max?: ProfitDistributionMaxAggregateInputType
  }

  export type ProfitDistributionGroupByOutputType = {
    id: string
    projectId: string
    distributionDate: Date
    realizationBasis: string
    totalProjectNetProfit: Decimal
    partnerId: string
    partnerSharePercent: Decimal
    payoutAmount: Decimal
    _count: ProfitDistributionCountAggregateOutputType | null
    _avg: ProfitDistributionAvgAggregateOutputType | null
    _sum: ProfitDistributionSumAggregateOutputType | null
    _min: ProfitDistributionMinAggregateOutputType | null
    _max: ProfitDistributionMaxAggregateOutputType | null
  }

  type GetProfitDistributionGroupByPayload<T extends ProfitDistributionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProfitDistributionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfitDistributionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfitDistributionGroupByOutputType[P]>
            : GetScalarType<T[P], ProfitDistributionGroupByOutputType[P]>
        }
      >
    >


  export type ProfitDistributionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    distributionDate?: boolean
    realizationBasis?: boolean
    totalProjectNetProfit?: boolean
    partnerId?: boolean
    partnerSharePercent?: boolean
    payoutAmount?: boolean
    project?: boolean | LandProjectDefaultArgs<ExtArgs>
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["profitDistribution"]>



  export type ProfitDistributionSelectScalar = {
    id?: boolean
    projectId?: boolean
    distributionDate?: boolean
    realizationBasis?: boolean
    totalProjectNetProfit?: boolean
    partnerId?: boolean
    partnerSharePercent?: boolean
    payoutAmount?: boolean
  }

  export type ProfitDistributionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "distributionDate" | "realizationBasis" | "totalProjectNetProfit" | "partnerId" | "partnerSharePercent" | "payoutAmount", ExtArgs["result"]["profitDistribution"]>
  export type ProfitDistributionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | LandProjectDefaultArgs<ExtArgs>
    partner?: boolean | PartnerDefaultArgs<ExtArgs>
  }

  export type $ProfitDistributionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProfitDistribution"
    objects: {
      project: Prisma.$LandProjectPayload<ExtArgs>
      partner: Prisma.$PartnerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      projectId: string
      distributionDate: Date
      realizationBasis: string
      totalProjectNetProfit: Prisma.Decimal
      partnerId: string
      partnerSharePercent: Prisma.Decimal
      payoutAmount: Prisma.Decimal
    }, ExtArgs["result"]["profitDistribution"]>
    composites: {}
  }

  type ProfitDistributionGetPayload<S extends boolean | null | undefined | ProfitDistributionDefaultArgs> = $Result.GetResult<Prisma.$ProfitDistributionPayload, S>

  type ProfitDistributionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProfitDistributionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProfitDistributionCountAggregateInputType | true
    }

  export interface ProfitDistributionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProfitDistribution'], meta: { name: 'ProfitDistribution' } }
    /**
     * Find zero or one ProfitDistribution that matches the filter.
     * @param {ProfitDistributionFindUniqueArgs} args - Arguments to find a ProfitDistribution
     * @example
     * // Get one ProfitDistribution
     * const profitDistribution = await prisma.profitDistribution.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfitDistributionFindUniqueArgs>(args: SelectSubset<T, ProfitDistributionFindUniqueArgs<ExtArgs>>): Prisma__ProfitDistributionClient<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProfitDistribution that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfitDistributionFindUniqueOrThrowArgs} args - Arguments to find a ProfitDistribution
     * @example
     * // Get one ProfitDistribution
     * const profitDistribution = await prisma.profitDistribution.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfitDistributionFindUniqueOrThrowArgs>(args: SelectSubset<T, ProfitDistributionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProfitDistributionClient<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfitDistribution that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfitDistributionFindFirstArgs} args - Arguments to find a ProfitDistribution
     * @example
     * // Get one ProfitDistribution
     * const profitDistribution = await prisma.profitDistribution.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfitDistributionFindFirstArgs>(args?: SelectSubset<T, ProfitDistributionFindFirstArgs<ExtArgs>>): Prisma__ProfitDistributionClient<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProfitDistribution that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfitDistributionFindFirstOrThrowArgs} args - Arguments to find a ProfitDistribution
     * @example
     * // Get one ProfitDistribution
     * const profitDistribution = await prisma.profitDistribution.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfitDistributionFindFirstOrThrowArgs>(args?: SelectSubset<T, ProfitDistributionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProfitDistributionClient<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProfitDistributions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfitDistributionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProfitDistributions
     * const profitDistributions = await prisma.profitDistribution.findMany()
     * 
     * // Get first 10 ProfitDistributions
     * const profitDistributions = await prisma.profitDistribution.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profitDistributionWithIdOnly = await prisma.profitDistribution.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProfitDistributionFindManyArgs>(args?: SelectSubset<T, ProfitDistributionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProfitDistribution.
     * @param {ProfitDistributionCreateArgs} args - Arguments to create a ProfitDistribution.
     * @example
     * // Create one ProfitDistribution
     * const ProfitDistribution = await prisma.profitDistribution.create({
     *   data: {
     *     // ... data to create a ProfitDistribution
     *   }
     * })
     * 
     */
    create<T extends ProfitDistributionCreateArgs>(args: SelectSubset<T, ProfitDistributionCreateArgs<ExtArgs>>): Prisma__ProfitDistributionClient<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProfitDistributions.
     * @param {ProfitDistributionCreateManyArgs} args - Arguments to create many ProfitDistributions.
     * @example
     * // Create many ProfitDistributions
     * const profitDistribution = await prisma.profitDistribution.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProfitDistributionCreateManyArgs>(args?: SelectSubset<T, ProfitDistributionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ProfitDistribution.
     * @param {ProfitDistributionDeleteArgs} args - Arguments to delete one ProfitDistribution.
     * @example
     * // Delete one ProfitDistribution
     * const ProfitDistribution = await prisma.profitDistribution.delete({
     *   where: {
     *     // ... filter to delete one ProfitDistribution
     *   }
     * })
     * 
     */
    delete<T extends ProfitDistributionDeleteArgs>(args: SelectSubset<T, ProfitDistributionDeleteArgs<ExtArgs>>): Prisma__ProfitDistributionClient<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProfitDistribution.
     * @param {ProfitDistributionUpdateArgs} args - Arguments to update one ProfitDistribution.
     * @example
     * // Update one ProfitDistribution
     * const profitDistribution = await prisma.profitDistribution.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProfitDistributionUpdateArgs>(args: SelectSubset<T, ProfitDistributionUpdateArgs<ExtArgs>>): Prisma__ProfitDistributionClient<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProfitDistributions.
     * @param {ProfitDistributionDeleteManyArgs} args - Arguments to filter ProfitDistributions to delete.
     * @example
     * // Delete a few ProfitDistributions
     * const { count } = await prisma.profitDistribution.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProfitDistributionDeleteManyArgs>(args?: SelectSubset<T, ProfitDistributionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProfitDistributions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfitDistributionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProfitDistributions
     * const profitDistribution = await prisma.profitDistribution.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProfitDistributionUpdateManyArgs>(args: SelectSubset<T, ProfitDistributionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ProfitDistribution.
     * @param {ProfitDistributionUpsertArgs} args - Arguments to update or create a ProfitDistribution.
     * @example
     * // Update or create a ProfitDistribution
     * const profitDistribution = await prisma.profitDistribution.upsert({
     *   create: {
     *     // ... data to create a ProfitDistribution
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProfitDistribution we want to update
     *   }
     * })
     */
    upsert<T extends ProfitDistributionUpsertArgs>(args: SelectSubset<T, ProfitDistributionUpsertArgs<ExtArgs>>): Prisma__ProfitDistributionClient<$Result.GetResult<Prisma.$ProfitDistributionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProfitDistributions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfitDistributionCountArgs} args - Arguments to filter ProfitDistributions to count.
     * @example
     * // Count the number of ProfitDistributions
     * const count = await prisma.profitDistribution.count({
     *   where: {
     *     // ... the filter for the ProfitDistributions we want to count
     *   }
     * })
    **/
    count<T extends ProfitDistributionCountArgs>(
      args?: Subset<T, ProfitDistributionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfitDistributionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProfitDistribution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfitDistributionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProfitDistributionAggregateArgs>(args: Subset<T, ProfitDistributionAggregateArgs>): Prisma.PrismaPromise<GetProfitDistributionAggregateType<T>>

    /**
     * Group by ProfitDistribution.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfitDistributionGroupByArgs} args - Group by arguments.
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
      T extends ProfitDistributionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfitDistributionGroupByArgs['orderBy'] }
        : { orderBy?: ProfitDistributionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProfitDistributionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfitDistributionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProfitDistribution model
   */
  readonly fields: ProfitDistributionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProfitDistribution.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfitDistributionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends LandProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LandProjectDefaultArgs<ExtArgs>>): Prisma__LandProjectClient<$Result.GetResult<Prisma.$LandProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    partner<T extends PartnerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PartnerDefaultArgs<ExtArgs>>): Prisma__PartnerClient<$Result.GetResult<Prisma.$PartnerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ProfitDistribution model
   */
  interface ProfitDistributionFieldRefs {
    readonly id: FieldRef<"ProfitDistribution", 'String'>
    readonly projectId: FieldRef<"ProfitDistribution", 'String'>
    readonly distributionDate: FieldRef<"ProfitDistribution", 'DateTime'>
    readonly realizationBasis: FieldRef<"ProfitDistribution", 'String'>
    readonly totalProjectNetProfit: FieldRef<"ProfitDistribution", 'Decimal'>
    readonly partnerId: FieldRef<"ProfitDistribution", 'String'>
    readonly partnerSharePercent: FieldRef<"ProfitDistribution", 'Decimal'>
    readonly payoutAmount: FieldRef<"ProfitDistribution", 'Decimal'>
  }
    

  // Custom InputTypes
  /**
   * ProfitDistribution findUnique
   */
  export type ProfitDistributionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * Filter, which ProfitDistribution to fetch.
     */
    where: ProfitDistributionWhereUniqueInput
  }

  /**
   * ProfitDistribution findUniqueOrThrow
   */
  export type ProfitDistributionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * Filter, which ProfitDistribution to fetch.
     */
    where: ProfitDistributionWhereUniqueInput
  }

  /**
   * ProfitDistribution findFirst
   */
  export type ProfitDistributionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * Filter, which ProfitDistribution to fetch.
     */
    where?: ProfitDistributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfitDistributions to fetch.
     */
    orderBy?: ProfitDistributionOrderByWithRelationInput | ProfitDistributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfitDistributions.
     */
    cursor?: ProfitDistributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfitDistributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfitDistributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfitDistributions.
     */
    distinct?: ProfitDistributionScalarFieldEnum | ProfitDistributionScalarFieldEnum[]
  }

  /**
   * ProfitDistribution findFirstOrThrow
   */
  export type ProfitDistributionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * Filter, which ProfitDistribution to fetch.
     */
    where?: ProfitDistributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfitDistributions to fetch.
     */
    orderBy?: ProfitDistributionOrderByWithRelationInput | ProfitDistributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProfitDistributions.
     */
    cursor?: ProfitDistributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfitDistributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfitDistributions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProfitDistributions.
     */
    distinct?: ProfitDistributionScalarFieldEnum | ProfitDistributionScalarFieldEnum[]
  }

  /**
   * ProfitDistribution findMany
   */
  export type ProfitDistributionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * Filter, which ProfitDistributions to fetch.
     */
    where?: ProfitDistributionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProfitDistributions to fetch.
     */
    orderBy?: ProfitDistributionOrderByWithRelationInput | ProfitDistributionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProfitDistributions.
     */
    cursor?: ProfitDistributionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProfitDistributions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProfitDistributions.
     */
    skip?: number
    distinct?: ProfitDistributionScalarFieldEnum | ProfitDistributionScalarFieldEnum[]
  }

  /**
   * ProfitDistribution create
   */
  export type ProfitDistributionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * The data needed to create a ProfitDistribution.
     */
    data: XOR<ProfitDistributionCreateInput, ProfitDistributionUncheckedCreateInput>
  }

  /**
   * ProfitDistribution createMany
   */
  export type ProfitDistributionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProfitDistributions.
     */
    data: ProfitDistributionCreateManyInput | ProfitDistributionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProfitDistribution update
   */
  export type ProfitDistributionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * The data needed to update a ProfitDistribution.
     */
    data: XOR<ProfitDistributionUpdateInput, ProfitDistributionUncheckedUpdateInput>
    /**
     * Choose, which ProfitDistribution to update.
     */
    where: ProfitDistributionWhereUniqueInput
  }

  /**
   * ProfitDistribution updateMany
   */
  export type ProfitDistributionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProfitDistributions.
     */
    data: XOR<ProfitDistributionUpdateManyMutationInput, ProfitDistributionUncheckedUpdateManyInput>
    /**
     * Filter which ProfitDistributions to update
     */
    where?: ProfitDistributionWhereInput
    /**
     * Limit how many ProfitDistributions to update.
     */
    limit?: number
  }

  /**
   * ProfitDistribution upsert
   */
  export type ProfitDistributionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * The filter to search for the ProfitDistribution to update in case it exists.
     */
    where: ProfitDistributionWhereUniqueInput
    /**
     * In case the ProfitDistribution found by the `where` argument doesn't exist, create a new ProfitDistribution with this data.
     */
    create: XOR<ProfitDistributionCreateInput, ProfitDistributionUncheckedCreateInput>
    /**
     * In case the ProfitDistribution was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfitDistributionUpdateInput, ProfitDistributionUncheckedUpdateInput>
  }

  /**
   * ProfitDistribution delete
   */
  export type ProfitDistributionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
    /**
     * Filter which ProfitDistribution to delete.
     */
    where: ProfitDistributionWhereUniqueInput
  }

  /**
   * ProfitDistribution deleteMany
   */
  export type ProfitDistributionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProfitDistributions to delete
     */
    where?: ProfitDistributionWhereInput
    /**
     * Limit how many ProfitDistributions to delete.
     */
    limit?: number
  }

  /**
   * ProfitDistribution without action
   */
  export type ProfitDistributionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProfitDistribution
     */
    select?: ProfitDistributionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProfitDistribution
     */
    omit?: ProfitDistributionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfitDistributionInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    tableName: string | null
    recordId: string | null
    action: string | null
    changedBy: string | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    tableName: string | null
    recordId: string | null
    action: string | null
    changedBy: string | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    tableName: number
    recordId: number
    action: number
    changedBy: number
    oldValues: number
    newValues: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    tableName?: true
    recordId?: true
    action?: true
    changedBy?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    tableName?: true
    recordId?: true
    action?: true
    changedBy?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    tableName?: true
    recordId?: true
    action?: true
    changedBy?: true
    oldValues?: true
    newValues?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    tableName: string
    recordId: string
    action: string
    changedBy: string
    oldValues: JsonValue | null
    newValues: JsonValue | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tableName?: boolean
    recordId?: boolean
    action?: boolean
    changedBy?: boolean
    oldValues?: boolean
    newValues?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["auditLog"]>



  export type AuditLogSelectScalar = {
    id?: boolean
    tableName?: boolean
    recordId?: boolean
    action?: boolean
    changedBy?: boolean
    oldValues?: boolean
    newValues?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tableName" | "recordId" | "action" | "changedBy" | "oldValues" | "newValues" | "createdAt", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tableName: string
      recordId: string
      action: string
      changedBy: string
      oldValues: Prisma.JsonValue | null
      newValues: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly tableName: FieldRef<"AuditLog", 'String'>
    readonly recordId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly changedBy: FieldRef<"AuditLog", 'String'>
    readonly oldValues: FieldRef<"AuditLog", 'Json'>
    readonly newValues: FieldRef<"AuditLog", 'Json'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
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


  export const PartnerScalarFieldEnum: {
    id: 'id',
    globalUserId: 'globalUserId',
    name: 'name',
    phone: 'phone',
    nidNumber: 'nidNumber',
    openingBalance: 'openingBalance',
    createdAt: 'createdAt'
  };

  export type PartnerScalarFieldEnum = (typeof PartnerScalarFieldEnum)[keyof typeof PartnerScalarFieldEnum]


  export const BankAccountScalarFieldEnum: {
    id: 'id',
    bankName: 'bankName',
    accountNumber: 'accountNumber',
    branchName: 'branchName',
    currentBalance: 'currentBalance',
    isActive: 'isActive'
  };

  export type BankAccountScalarFieldEnum = (typeof BankAccountScalarFieldEnum)[keyof typeof BankAccountScalarFieldEnum]


  export const LandProjectScalarFieldEnum: {
    id: 'id',
    projectName: 'projectName',
    mouza: 'mouza',
    jlNumber: 'jlNumber',
    dagNumbers: 'dagNumbers',
    khatianNumbers: 'khatianNumbers',
    totalAreaShotok: 'totalAreaShotok',
    purchasePrice: 'purchasePrice',
    baynaAmount: 'baynaAmount',
    registrationCost: 'registrationCost',
    mutationTaxCost: 'mutationTaxCost',
    status: 'status',
    createdAt: 'createdAt'
  };

  export type LandProjectScalarFieldEnum = (typeof LandProjectScalarFieldEnum)[keyof typeof LandProjectScalarFieldEnum]


  export const ProjectPartnerScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    partnerId: 'partnerId',
    sharePercentage: 'sharePercentage'
  };

  export type ProjectPartnerScalarFieldEnum = (typeof ProjectPartnerScalarFieldEnum)[keyof typeof ProjectPartnerScalarFieldEnum]


  export const TreasuryLedgerScalarFieldEnum: {
    id: 'id',
    txnDate: 'txnDate',
    accountType: 'accountType',
    bankAccountId: 'bankAccountId',
    flowType: 'flowType',
    amount: 'amount',
    purpose: 'purpose',
    referenceType: 'referenceType',
    referenceId: 'referenceId',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type TreasuryLedgerScalarFieldEnum = (typeof TreasuryLedgerScalarFieldEnum)[keyof typeof TreasuryLedgerScalarFieldEnum]


  export const PartnerTransactionScalarFieldEnum: {
    id: 'id',
    partnerId: 'partnerId',
    txnType: 'txnType',
    amount: 'amount',
    txnDate: 'txnDate',
    referenceId: 'referenceId',
    notes: 'notes',
    createdAt: 'createdAt'
  };

  export type PartnerTransactionScalarFieldEnum = (typeof PartnerTransactionScalarFieldEnum)[keyof typeof PartnerTransactionScalarFieldEnum]


  export const ProjectExpenseScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    expenseCategory: 'expenseCategory',
    amount: 'amount',
    expenseDate: 'expenseDate',
    description: 'description',
    paymentChannel: 'paymentChannel',
    bankAccountId: 'bankAccountId',
    paidByPartnerId: 'paidByPartnerId',
    voucherImageUrl: 'voucherImageUrl',
    status: 'status',
    approvedBy: 'approvedBy',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
  };

  export type ProjectExpenseScalarFieldEnum = (typeof ProjectExpenseScalarFieldEnum)[keyof typeof ProjectExpenseScalarFieldEnum]


  export const ProjectPlotScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    plotNumber: 'plotNumber',
    plotSizeShotok: 'plotSizeShotok',
    askingPrice: 'askingPrice',
    status: 'status'
  };

  export type ProjectPlotScalarFieldEnum = (typeof ProjectPlotScalarFieldEnum)[keyof typeof ProjectPlotScalarFieldEnum]


  export const LandSaleScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    plotId: 'plotId',
    buyerName: 'buyerName',
    buyerPhone: 'buyerPhone',
    buyerNid: 'buyerNid',
    saleDate: 'saleDate',
    totalAgreedPrice: 'totalAgreedPrice',
    advanceBookingAmount: 'advanceBookingAmount',
    currentDueAmount: 'currentDueAmount',
    status: 'status'
  };

  export type LandSaleScalarFieldEnum = (typeof LandSaleScalarFieldEnum)[keyof typeof LandSaleScalarFieldEnum]


  export const InstallmentScheduleScalarFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    dueDate: 'dueDate',
    dueAmount: 'dueAmount',
    status: 'status'
  };

  export type InstallmentScheduleScalarFieldEnum = (typeof InstallmentScheduleScalarFieldEnum)[keyof typeof InstallmentScheduleScalarFieldEnum]


  export const CustomerPaymentScalarFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    paymentDate: 'paymentDate',
    amountPaid: 'amountPaid',
    paymentMethod: 'paymentMethod',
    bankAccountId: 'bankAccountId',
    receiptNo: 'receiptNo',
    remarks: 'remarks'
  };

  export type CustomerPaymentScalarFieldEnum = (typeof CustomerPaymentScalarFieldEnum)[keyof typeof CustomerPaymentScalarFieldEnum]


  export const ProfitDistributionScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    distributionDate: 'distributionDate',
    realizationBasis: 'realizationBasis',
    totalProjectNetProfit: 'totalProjectNetProfit',
    partnerId: 'partnerId',
    partnerSharePercent: 'partnerSharePercent',
    payoutAmount: 'payoutAmount'
  };

  export type ProfitDistributionScalarFieldEnum = (typeof ProfitDistributionScalarFieldEnum)[keyof typeof ProfitDistributionScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    tableName: 'tableName',
    recordId: 'recordId',
    action: 'action',
    changedBy: 'changedBy',
    oldValues: 'oldValues',
    newValues: 'newValues',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


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


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const PartnerOrderByRelevanceFieldEnum: {
    id: 'id',
    globalUserId: 'globalUserId',
    name: 'name',
    phone: 'phone',
    nidNumber: 'nidNumber'
  };

  export type PartnerOrderByRelevanceFieldEnum = (typeof PartnerOrderByRelevanceFieldEnum)[keyof typeof PartnerOrderByRelevanceFieldEnum]


  export const BankAccountOrderByRelevanceFieldEnum: {
    id: 'id',
    bankName: 'bankName',
    accountNumber: 'accountNumber',
    branchName: 'branchName'
  };

  export type BankAccountOrderByRelevanceFieldEnum = (typeof BankAccountOrderByRelevanceFieldEnum)[keyof typeof BankAccountOrderByRelevanceFieldEnum]


  export const LandProjectOrderByRelevanceFieldEnum: {
    id: 'id',
    projectName: 'projectName',
    mouza: 'mouza',
    jlNumber: 'jlNumber',
    dagNumbers: 'dagNumbers',
    khatianNumbers: 'khatianNumbers',
    status: 'status'
  };

  export type LandProjectOrderByRelevanceFieldEnum = (typeof LandProjectOrderByRelevanceFieldEnum)[keyof typeof LandProjectOrderByRelevanceFieldEnum]


  export const ProjectPartnerOrderByRelevanceFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    partnerId: 'partnerId'
  };

  export type ProjectPartnerOrderByRelevanceFieldEnum = (typeof ProjectPartnerOrderByRelevanceFieldEnum)[keyof typeof ProjectPartnerOrderByRelevanceFieldEnum]


  export const TreasuryLedgerOrderByRelevanceFieldEnum: {
    id: 'id',
    accountType: 'accountType',
    bankAccountId: 'bankAccountId',
    flowType: 'flowType',
    purpose: 'purpose',
    referenceType: 'referenceType',
    referenceId: 'referenceId',
    createdBy: 'createdBy'
  };

  export type TreasuryLedgerOrderByRelevanceFieldEnum = (typeof TreasuryLedgerOrderByRelevanceFieldEnum)[keyof typeof TreasuryLedgerOrderByRelevanceFieldEnum]


  export const PartnerTransactionOrderByRelevanceFieldEnum: {
    id: 'id',
    partnerId: 'partnerId',
    txnType: 'txnType',
    referenceId: 'referenceId',
    notes: 'notes'
  };

  export type PartnerTransactionOrderByRelevanceFieldEnum = (typeof PartnerTransactionOrderByRelevanceFieldEnum)[keyof typeof PartnerTransactionOrderByRelevanceFieldEnum]


  export const ProjectExpenseOrderByRelevanceFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    expenseCategory: 'expenseCategory',
    description: 'description',
    paymentChannel: 'paymentChannel',
    bankAccountId: 'bankAccountId',
    paidByPartnerId: 'paidByPartnerId',
    voucherImageUrl: 'voucherImageUrl',
    status: 'status',
    approvedBy: 'approvedBy',
    createdBy: 'createdBy'
  };

  export type ProjectExpenseOrderByRelevanceFieldEnum = (typeof ProjectExpenseOrderByRelevanceFieldEnum)[keyof typeof ProjectExpenseOrderByRelevanceFieldEnum]


  export const ProjectPlotOrderByRelevanceFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    plotNumber: 'plotNumber',
    status: 'status'
  };

  export type ProjectPlotOrderByRelevanceFieldEnum = (typeof ProjectPlotOrderByRelevanceFieldEnum)[keyof typeof ProjectPlotOrderByRelevanceFieldEnum]


  export const LandSaleOrderByRelevanceFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    plotId: 'plotId',
    buyerName: 'buyerName',
    buyerPhone: 'buyerPhone',
    buyerNid: 'buyerNid',
    status: 'status'
  };

  export type LandSaleOrderByRelevanceFieldEnum = (typeof LandSaleOrderByRelevanceFieldEnum)[keyof typeof LandSaleOrderByRelevanceFieldEnum]


  export const InstallmentScheduleOrderByRelevanceFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    status: 'status'
  };

  export type InstallmentScheduleOrderByRelevanceFieldEnum = (typeof InstallmentScheduleOrderByRelevanceFieldEnum)[keyof typeof InstallmentScheduleOrderByRelevanceFieldEnum]


  export const CustomerPaymentOrderByRelevanceFieldEnum: {
    id: 'id',
    saleId: 'saleId',
    paymentMethod: 'paymentMethod',
    bankAccountId: 'bankAccountId',
    receiptNo: 'receiptNo',
    remarks: 'remarks'
  };

  export type CustomerPaymentOrderByRelevanceFieldEnum = (typeof CustomerPaymentOrderByRelevanceFieldEnum)[keyof typeof CustomerPaymentOrderByRelevanceFieldEnum]


  export const ProfitDistributionOrderByRelevanceFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    realizationBasis: 'realizationBasis',
    partnerId: 'partnerId'
  };

  export type ProfitDistributionOrderByRelevanceFieldEnum = (typeof ProfitDistributionOrderByRelevanceFieldEnum)[keyof typeof ProfitDistributionOrderByRelevanceFieldEnum]


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


  export const AuditLogOrderByRelevanceFieldEnum: {
    id: 'id',
    tableName: 'tableName',
    recordId: 'recordId',
    action: 'action',
    changedBy: 'changedBy'
  };

  export type AuditLogOrderByRelevanceFieldEnum = (typeof AuditLogOrderByRelevanceFieldEnum)[keyof typeof AuditLogOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type PartnerWhereInput = {
    AND?: PartnerWhereInput | PartnerWhereInput[]
    OR?: PartnerWhereInput[]
    NOT?: PartnerWhereInput | PartnerWhereInput[]
    id?: StringFilter<"Partner"> | string
    globalUserId?: StringNullableFilter<"Partner"> | string | null
    name?: StringFilter<"Partner"> | string
    phone?: StringFilter<"Partner"> | string
    nidNumber?: StringNullableFilter<"Partner"> | string | null
    openingBalance?: DecimalFilter<"Partner"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Partner"> | Date | string
    projectPartners?: ProjectPartnerListRelationFilter
    partnerTransactions?: PartnerTransactionListRelationFilter
    paidExpenses?: ProjectExpenseListRelationFilter
    profitDistributions?: ProfitDistributionListRelationFilter
  }

  export type PartnerOrderByWithRelationInput = {
    id?: SortOrder
    globalUserId?: SortOrderInput | SortOrder
    name?: SortOrder
    phone?: SortOrder
    nidNumber?: SortOrderInput | SortOrder
    openingBalance?: SortOrder
    createdAt?: SortOrder
    projectPartners?: ProjectPartnerOrderByRelationAggregateInput
    partnerTransactions?: PartnerTransactionOrderByRelationAggregateInput
    paidExpenses?: ProjectExpenseOrderByRelationAggregateInput
    profitDistributions?: ProfitDistributionOrderByRelationAggregateInput
    _relevance?: PartnerOrderByRelevanceInput
  }

  export type PartnerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    phone?: string
    AND?: PartnerWhereInput | PartnerWhereInput[]
    OR?: PartnerWhereInput[]
    NOT?: PartnerWhereInput | PartnerWhereInput[]
    globalUserId?: StringNullableFilter<"Partner"> | string | null
    name?: StringFilter<"Partner"> | string
    nidNumber?: StringNullableFilter<"Partner"> | string | null
    openingBalance?: DecimalFilter<"Partner"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"Partner"> | Date | string
    projectPartners?: ProjectPartnerListRelationFilter
    partnerTransactions?: PartnerTransactionListRelationFilter
    paidExpenses?: ProjectExpenseListRelationFilter
    profitDistributions?: ProfitDistributionListRelationFilter
  }, "id" | "phone">

  export type PartnerOrderByWithAggregationInput = {
    id?: SortOrder
    globalUserId?: SortOrderInput | SortOrder
    name?: SortOrder
    phone?: SortOrder
    nidNumber?: SortOrderInput | SortOrder
    openingBalance?: SortOrder
    createdAt?: SortOrder
    _count?: PartnerCountOrderByAggregateInput
    _avg?: PartnerAvgOrderByAggregateInput
    _max?: PartnerMaxOrderByAggregateInput
    _min?: PartnerMinOrderByAggregateInput
    _sum?: PartnerSumOrderByAggregateInput
  }

  export type PartnerScalarWhereWithAggregatesInput = {
    AND?: PartnerScalarWhereWithAggregatesInput | PartnerScalarWhereWithAggregatesInput[]
    OR?: PartnerScalarWhereWithAggregatesInput[]
    NOT?: PartnerScalarWhereWithAggregatesInput | PartnerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Partner"> | string
    globalUserId?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    name?: StringWithAggregatesFilter<"Partner"> | string
    phone?: StringWithAggregatesFilter<"Partner"> | string
    nidNumber?: StringNullableWithAggregatesFilter<"Partner"> | string | null
    openingBalance?: DecimalWithAggregatesFilter<"Partner"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"Partner"> | Date | string
  }

  export type BankAccountWhereInput = {
    AND?: BankAccountWhereInput | BankAccountWhereInput[]
    OR?: BankAccountWhereInput[]
    NOT?: BankAccountWhereInput | BankAccountWhereInput[]
    id?: StringFilter<"BankAccount"> | string
    bankName?: StringFilter<"BankAccount"> | string
    accountNumber?: StringFilter<"BankAccount"> | string
    branchName?: StringNullableFilter<"BankAccount"> | string | null
    currentBalance?: DecimalFilter<"BankAccount"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"BankAccount"> | boolean
    treasuryLedgers?: TreasuryLedgerListRelationFilter
    expenses?: ProjectExpenseListRelationFilter
    customerPayments?: CustomerPaymentListRelationFilter
  }

  export type BankAccountOrderByWithRelationInput = {
    id?: SortOrder
    bankName?: SortOrder
    accountNumber?: SortOrder
    branchName?: SortOrderInput | SortOrder
    currentBalance?: SortOrder
    isActive?: SortOrder
    treasuryLedgers?: TreasuryLedgerOrderByRelationAggregateInput
    expenses?: ProjectExpenseOrderByRelationAggregateInput
    customerPayments?: CustomerPaymentOrderByRelationAggregateInput
    _relevance?: BankAccountOrderByRelevanceInput
  }

  export type BankAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    accountNumber?: string
    AND?: BankAccountWhereInput | BankAccountWhereInput[]
    OR?: BankAccountWhereInput[]
    NOT?: BankAccountWhereInput | BankAccountWhereInput[]
    bankName?: StringFilter<"BankAccount"> | string
    branchName?: StringNullableFilter<"BankAccount"> | string | null
    currentBalance?: DecimalFilter<"BankAccount"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"BankAccount"> | boolean
    treasuryLedgers?: TreasuryLedgerListRelationFilter
    expenses?: ProjectExpenseListRelationFilter
    customerPayments?: CustomerPaymentListRelationFilter
  }, "id" | "accountNumber">

  export type BankAccountOrderByWithAggregationInput = {
    id?: SortOrder
    bankName?: SortOrder
    accountNumber?: SortOrder
    branchName?: SortOrderInput | SortOrder
    currentBalance?: SortOrder
    isActive?: SortOrder
    _count?: BankAccountCountOrderByAggregateInput
    _avg?: BankAccountAvgOrderByAggregateInput
    _max?: BankAccountMaxOrderByAggregateInput
    _min?: BankAccountMinOrderByAggregateInput
    _sum?: BankAccountSumOrderByAggregateInput
  }

  export type BankAccountScalarWhereWithAggregatesInput = {
    AND?: BankAccountScalarWhereWithAggregatesInput | BankAccountScalarWhereWithAggregatesInput[]
    OR?: BankAccountScalarWhereWithAggregatesInput[]
    NOT?: BankAccountScalarWhereWithAggregatesInput | BankAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"BankAccount"> | string
    bankName?: StringWithAggregatesFilter<"BankAccount"> | string
    accountNumber?: StringWithAggregatesFilter<"BankAccount"> | string
    branchName?: StringNullableWithAggregatesFilter<"BankAccount"> | string | null
    currentBalance?: DecimalWithAggregatesFilter<"BankAccount"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolWithAggregatesFilter<"BankAccount"> | boolean
  }

  export type LandProjectWhereInput = {
    AND?: LandProjectWhereInput | LandProjectWhereInput[]
    OR?: LandProjectWhereInput[]
    NOT?: LandProjectWhereInput | LandProjectWhereInput[]
    id?: StringFilter<"LandProject"> | string
    projectName?: StringFilter<"LandProject"> | string
    mouza?: StringFilter<"LandProject"> | string
    jlNumber?: StringNullableFilter<"LandProject"> | string | null
    dagNumbers?: StringFilter<"LandProject"> | string
    khatianNumbers?: StringFilter<"LandProject"> | string
    totalAreaShotok?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"LandProject"> | string
    createdAt?: DateTimeFilter<"LandProject"> | Date | string
    projectPartners?: ProjectPartnerListRelationFilter
    projectExpenses?: ProjectExpenseListRelationFilter
    projectPlots?: ProjectPlotListRelationFilter
    landSales?: LandSaleListRelationFilter
    profitDistributions?: ProfitDistributionListRelationFilter
  }

  export type LandProjectOrderByWithRelationInput = {
    id?: SortOrder
    projectName?: SortOrder
    mouza?: SortOrder
    jlNumber?: SortOrderInput | SortOrder
    dagNumbers?: SortOrder
    khatianNumbers?: SortOrder
    totalAreaShotok?: SortOrder
    purchasePrice?: SortOrder
    baynaAmount?: SortOrder
    registrationCost?: SortOrder
    mutationTaxCost?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    projectPartners?: ProjectPartnerOrderByRelationAggregateInput
    projectExpenses?: ProjectExpenseOrderByRelationAggregateInput
    projectPlots?: ProjectPlotOrderByRelationAggregateInput
    landSales?: LandSaleOrderByRelationAggregateInput
    profitDistributions?: ProfitDistributionOrderByRelationAggregateInput
    _relevance?: LandProjectOrderByRelevanceInput
  }

  export type LandProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LandProjectWhereInput | LandProjectWhereInput[]
    OR?: LandProjectWhereInput[]
    NOT?: LandProjectWhereInput | LandProjectWhereInput[]
    projectName?: StringFilter<"LandProject"> | string
    mouza?: StringFilter<"LandProject"> | string
    jlNumber?: StringNullableFilter<"LandProject"> | string | null
    dagNumbers?: StringFilter<"LandProject"> | string
    khatianNumbers?: StringFilter<"LandProject"> | string
    totalAreaShotok?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"LandProject"> | string
    createdAt?: DateTimeFilter<"LandProject"> | Date | string
    projectPartners?: ProjectPartnerListRelationFilter
    projectExpenses?: ProjectExpenseListRelationFilter
    projectPlots?: ProjectPlotListRelationFilter
    landSales?: LandSaleListRelationFilter
    profitDistributions?: ProfitDistributionListRelationFilter
  }, "id">

  export type LandProjectOrderByWithAggregationInput = {
    id?: SortOrder
    projectName?: SortOrder
    mouza?: SortOrder
    jlNumber?: SortOrderInput | SortOrder
    dagNumbers?: SortOrder
    khatianNumbers?: SortOrder
    totalAreaShotok?: SortOrder
    purchasePrice?: SortOrder
    baynaAmount?: SortOrder
    registrationCost?: SortOrder
    mutationTaxCost?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    _count?: LandProjectCountOrderByAggregateInput
    _avg?: LandProjectAvgOrderByAggregateInput
    _max?: LandProjectMaxOrderByAggregateInput
    _min?: LandProjectMinOrderByAggregateInput
    _sum?: LandProjectSumOrderByAggregateInput
  }

  export type LandProjectScalarWhereWithAggregatesInput = {
    AND?: LandProjectScalarWhereWithAggregatesInput | LandProjectScalarWhereWithAggregatesInput[]
    OR?: LandProjectScalarWhereWithAggregatesInput[]
    NOT?: LandProjectScalarWhereWithAggregatesInput | LandProjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LandProject"> | string
    projectName?: StringWithAggregatesFilter<"LandProject"> | string
    mouza?: StringWithAggregatesFilter<"LandProject"> | string
    jlNumber?: StringNullableWithAggregatesFilter<"LandProject"> | string | null
    dagNumbers?: StringWithAggregatesFilter<"LandProject"> | string
    khatianNumbers?: StringWithAggregatesFilter<"LandProject"> | string
    totalAreaShotok?: DecimalWithAggregatesFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalWithAggregatesFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalWithAggregatesFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalWithAggregatesFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalWithAggregatesFilter<"LandProject"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"LandProject"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LandProject"> | Date | string
  }

  export type ProjectPartnerWhereInput = {
    AND?: ProjectPartnerWhereInput | ProjectPartnerWhereInput[]
    OR?: ProjectPartnerWhereInput[]
    NOT?: ProjectPartnerWhereInput | ProjectPartnerWhereInput[]
    id?: StringFilter<"ProjectPartner"> | string
    projectId?: StringFilter<"ProjectPartner"> | string
    partnerId?: StringFilter<"ProjectPartner"> | string
    sharePercentage?: DecimalFilter<"ProjectPartner"> | Decimal | DecimalJsLike | number | string
    project?: XOR<LandProjectScalarRelationFilter, LandProjectWhereInput>
    partner?: XOR<PartnerScalarRelationFilter, PartnerWhereInput>
  }

  export type ProjectPartnerOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    partnerId?: SortOrder
    sharePercentage?: SortOrder
    project?: LandProjectOrderByWithRelationInput
    partner?: PartnerOrderByWithRelationInput
    _relevance?: ProjectPartnerOrderByRelevanceInput
  }

  export type ProjectPartnerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    projectId_partnerId?: ProjectPartnerProjectIdPartnerIdCompoundUniqueInput
    AND?: ProjectPartnerWhereInput | ProjectPartnerWhereInput[]
    OR?: ProjectPartnerWhereInput[]
    NOT?: ProjectPartnerWhereInput | ProjectPartnerWhereInput[]
    projectId?: StringFilter<"ProjectPartner"> | string
    partnerId?: StringFilter<"ProjectPartner"> | string
    sharePercentage?: DecimalFilter<"ProjectPartner"> | Decimal | DecimalJsLike | number | string
    project?: XOR<LandProjectScalarRelationFilter, LandProjectWhereInput>
    partner?: XOR<PartnerScalarRelationFilter, PartnerWhereInput>
  }, "id" | "projectId_partnerId">

  export type ProjectPartnerOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    partnerId?: SortOrder
    sharePercentage?: SortOrder
    _count?: ProjectPartnerCountOrderByAggregateInput
    _avg?: ProjectPartnerAvgOrderByAggregateInput
    _max?: ProjectPartnerMaxOrderByAggregateInput
    _min?: ProjectPartnerMinOrderByAggregateInput
    _sum?: ProjectPartnerSumOrderByAggregateInput
  }

  export type ProjectPartnerScalarWhereWithAggregatesInput = {
    AND?: ProjectPartnerScalarWhereWithAggregatesInput | ProjectPartnerScalarWhereWithAggregatesInput[]
    OR?: ProjectPartnerScalarWhereWithAggregatesInput[]
    NOT?: ProjectPartnerScalarWhereWithAggregatesInput | ProjectPartnerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectPartner"> | string
    projectId?: StringWithAggregatesFilter<"ProjectPartner"> | string
    partnerId?: StringWithAggregatesFilter<"ProjectPartner"> | string
    sharePercentage?: DecimalWithAggregatesFilter<"ProjectPartner"> | Decimal | DecimalJsLike | number | string
  }

  export type TreasuryLedgerWhereInput = {
    AND?: TreasuryLedgerWhereInput | TreasuryLedgerWhereInput[]
    OR?: TreasuryLedgerWhereInput[]
    NOT?: TreasuryLedgerWhereInput | TreasuryLedgerWhereInput[]
    id?: StringFilter<"TreasuryLedger"> | string
    txnDate?: DateTimeFilter<"TreasuryLedger"> | Date | string
    accountType?: StringFilter<"TreasuryLedger"> | string
    bankAccountId?: StringNullableFilter<"TreasuryLedger"> | string | null
    flowType?: StringFilter<"TreasuryLedger"> | string
    amount?: DecimalFilter<"TreasuryLedger"> | Decimal | DecimalJsLike | number | string
    purpose?: StringFilter<"TreasuryLedger"> | string
    referenceType?: StringFilter<"TreasuryLedger"> | string
    referenceId?: StringNullableFilter<"TreasuryLedger"> | string | null
    createdBy?: StringFilter<"TreasuryLedger"> | string
    createdAt?: DateTimeFilter<"TreasuryLedger"> | Date | string
    bankAccount?: XOR<BankAccountNullableScalarRelationFilter, BankAccountWhereInput> | null
  }

  export type TreasuryLedgerOrderByWithRelationInput = {
    id?: SortOrder
    txnDate?: SortOrder
    accountType?: SortOrder
    bankAccountId?: SortOrderInput | SortOrder
    flowType?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    referenceType?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    bankAccount?: BankAccountOrderByWithRelationInput
    _relevance?: TreasuryLedgerOrderByRelevanceInput
  }

  export type TreasuryLedgerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TreasuryLedgerWhereInput | TreasuryLedgerWhereInput[]
    OR?: TreasuryLedgerWhereInput[]
    NOT?: TreasuryLedgerWhereInput | TreasuryLedgerWhereInput[]
    txnDate?: DateTimeFilter<"TreasuryLedger"> | Date | string
    accountType?: StringFilter<"TreasuryLedger"> | string
    bankAccountId?: StringNullableFilter<"TreasuryLedger"> | string | null
    flowType?: StringFilter<"TreasuryLedger"> | string
    amount?: DecimalFilter<"TreasuryLedger"> | Decimal | DecimalJsLike | number | string
    purpose?: StringFilter<"TreasuryLedger"> | string
    referenceType?: StringFilter<"TreasuryLedger"> | string
    referenceId?: StringNullableFilter<"TreasuryLedger"> | string | null
    createdBy?: StringFilter<"TreasuryLedger"> | string
    createdAt?: DateTimeFilter<"TreasuryLedger"> | Date | string
    bankAccount?: XOR<BankAccountNullableScalarRelationFilter, BankAccountWhereInput> | null
  }, "id">

  export type TreasuryLedgerOrderByWithAggregationInput = {
    id?: SortOrder
    txnDate?: SortOrder
    accountType?: SortOrder
    bankAccountId?: SortOrderInput | SortOrder
    flowType?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    referenceType?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    _count?: TreasuryLedgerCountOrderByAggregateInput
    _avg?: TreasuryLedgerAvgOrderByAggregateInput
    _max?: TreasuryLedgerMaxOrderByAggregateInput
    _min?: TreasuryLedgerMinOrderByAggregateInput
    _sum?: TreasuryLedgerSumOrderByAggregateInput
  }

  export type TreasuryLedgerScalarWhereWithAggregatesInput = {
    AND?: TreasuryLedgerScalarWhereWithAggregatesInput | TreasuryLedgerScalarWhereWithAggregatesInput[]
    OR?: TreasuryLedgerScalarWhereWithAggregatesInput[]
    NOT?: TreasuryLedgerScalarWhereWithAggregatesInput | TreasuryLedgerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TreasuryLedger"> | string
    txnDate?: DateTimeWithAggregatesFilter<"TreasuryLedger"> | Date | string
    accountType?: StringWithAggregatesFilter<"TreasuryLedger"> | string
    bankAccountId?: StringNullableWithAggregatesFilter<"TreasuryLedger"> | string | null
    flowType?: StringWithAggregatesFilter<"TreasuryLedger"> | string
    amount?: DecimalWithAggregatesFilter<"TreasuryLedger"> | Decimal | DecimalJsLike | number | string
    purpose?: StringWithAggregatesFilter<"TreasuryLedger"> | string
    referenceType?: StringWithAggregatesFilter<"TreasuryLedger"> | string
    referenceId?: StringNullableWithAggregatesFilter<"TreasuryLedger"> | string | null
    createdBy?: StringWithAggregatesFilter<"TreasuryLedger"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TreasuryLedger"> | Date | string
  }

  export type PartnerTransactionWhereInput = {
    AND?: PartnerTransactionWhereInput | PartnerTransactionWhereInput[]
    OR?: PartnerTransactionWhereInput[]
    NOT?: PartnerTransactionWhereInput | PartnerTransactionWhereInput[]
    id?: StringFilter<"PartnerTransaction"> | string
    partnerId?: StringFilter<"PartnerTransaction"> | string
    txnType?: StringFilter<"PartnerTransaction"> | string
    amount?: DecimalFilter<"PartnerTransaction"> | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFilter<"PartnerTransaction"> | Date | string
    referenceId?: StringNullableFilter<"PartnerTransaction"> | string | null
    notes?: StringNullableFilter<"PartnerTransaction"> | string | null
    createdAt?: DateTimeFilter<"PartnerTransaction"> | Date | string
    partner?: XOR<PartnerScalarRelationFilter, PartnerWhereInput>
  }

  export type PartnerTransactionOrderByWithRelationInput = {
    id?: SortOrder
    partnerId?: SortOrder
    txnType?: SortOrder
    amount?: SortOrder
    txnDate?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    partner?: PartnerOrderByWithRelationInput
    _relevance?: PartnerTransactionOrderByRelevanceInput
  }

  export type PartnerTransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PartnerTransactionWhereInput | PartnerTransactionWhereInput[]
    OR?: PartnerTransactionWhereInput[]
    NOT?: PartnerTransactionWhereInput | PartnerTransactionWhereInput[]
    partnerId?: StringFilter<"PartnerTransaction"> | string
    txnType?: StringFilter<"PartnerTransaction"> | string
    amount?: DecimalFilter<"PartnerTransaction"> | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFilter<"PartnerTransaction"> | Date | string
    referenceId?: StringNullableFilter<"PartnerTransaction"> | string | null
    notes?: StringNullableFilter<"PartnerTransaction"> | string | null
    createdAt?: DateTimeFilter<"PartnerTransaction"> | Date | string
    partner?: XOR<PartnerScalarRelationFilter, PartnerWhereInput>
  }, "id">

  export type PartnerTransactionOrderByWithAggregationInput = {
    id?: SortOrder
    partnerId?: SortOrder
    txnType?: SortOrder
    amount?: SortOrder
    txnDate?: SortOrder
    referenceId?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PartnerTransactionCountOrderByAggregateInput
    _avg?: PartnerTransactionAvgOrderByAggregateInput
    _max?: PartnerTransactionMaxOrderByAggregateInput
    _min?: PartnerTransactionMinOrderByAggregateInput
    _sum?: PartnerTransactionSumOrderByAggregateInput
  }

  export type PartnerTransactionScalarWhereWithAggregatesInput = {
    AND?: PartnerTransactionScalarWhereWithAggregatesInput | PartnerTransactionScalarWhereWithAggregatesInput[]
    OR?: PartnerTransactionScalarWhereWithAggregatesInput[]
    NOT?: PartnerTransactionScalarWhereWithAggregatesInput | PartnerTransactionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PartnerTransaction"> | string
    partnerId?: StringWithAggregatesFilter<"PartnerTransaction"> | string
    txnType?: StringWithAggregatesFilter<"PartnerTransaction"> | string
    amount?: DecimalWithAggregatesFilter<"PartnerTransaction"> | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeWithAggregatesFilter<"PartnerTransaction"> | Date | string
    referenceId?: StringNullableWithAggregatesFilter<"PartnerTransaction"> | string | null
    notes?: StringNullableWithAggregatesFilter<"PartnerTransaction"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PartnerTransaction"> | Date | string
  }

  export type ProjectExpenseWhereInput = {
    AND?: ProjectExpenseWhereInput | ProjectExpenseWhereInput[]
    OR?: ProjectExpenseWhereInput[]
    NOT?: ProjectExpenseWhereInput | ProjectExpenseWhereInput[]
    id?: StringFilter<"ProjectExpense"> | string
    projectId?: StringNullableFilter<"ProjectExpense"> | string | null
    expenseCategory?: StringFilter<"ProjectExpense"> | string
    amount?: DecimalFilter<"ProjectExpense"> | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFilter<"ProjectExpense"> | Date | string
    description?: StringNullableFilter<"ProjectExpense"> | string | null
    paymentChannel?: StringFilter<"ProjectExpense"> | string
    bankAccountId?: StringNullableFilter<"ProjectExpense"> | string | null
    paidByPartnerId?: StringNullableFilter<"ProjectExpense"> | string | null
    voucherImageUrl?: StringNullableFilter<"ProjectExpense"> | string | null
    status?: StringFilter<"ProjectExpense"> | string
    approvedBy?: StringNullableFilter<"ProjectExpense"> | string | null
    createdBy?: StringFilter<"ProjectExpense"> | string
    createdAt?: DateTimeFilter<"ProjectExpense"> | Date | string
    project?: XOR<LandProjectNullableScalarRelationFilter, LandProjectWhereInput> | null
    bankAccount?: XOR<BankAccountNullableScalarRelationFilter, BankAccountWhereInput> | null
    paidByPartner?: XOR<PartnerNullableScalarRelationFilter, PartnerWhereInput> | null
  }

  export type ProjectExpenseOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrderInput | SortOrder
    expenseCategory?: SortOrder
    amount?: SortOrder
    expenseDate?: SortOrder
    description?: SortOrderInput | SortOrder
    paymentChannel?: SortOrder
    bankAccountId?: SortOrderInput | SortOrder
    paidByPartnerId?: SortOrderInput | SortOrder
    voucherImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    project?: LandProjectOrderByWithRelationInput
    bankAccount?: BankAccountOrderByWithRelationInput
    paidByPartner?: PartnerOrderByWithRelationInput
    _relevance?: ProjectExpenseOrderByRelevanceInput
  }

  export type ProjectExpenseWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectExpenseWhereInput | ProjectExpenseWhereInput[]
    OR?: ProjectExpenseWhereInput[]
    NOT?: ProjectExpenseWhereInput | ProjectExpenseWhereInput[]
    projectId?: StringNullableFilter<"ProjectExpense"> | string | null
    expenseCategory?: StringFilter<"ProjectExpense"> | string
    amount?: DecimalFilter<"ProjectExpense"> | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFilter<"ProjectExpense"> | Date | string
    description?: StringNullableFilter<"ProjectExpense"> | string | null
    paymentChannel?: StringFilter<"ProjectExpense"> | string
    bankAccountId?: StringNullableFilter<"ProjectExpense"> | string | null
    paidByPartnerId?: StringNullableFilter<"ProjectExpense"> | string | null
    voucherImageUrl?: StringNullableFilter<"ProjectExpense"> | string | null
    status?: StringFilter<"ProjectExpense"> | string
    approvedBy?: StringNullableFilter<"ProjectExpense"> | string | null
    createdBy?: StringFilter<"ProjectExpense"> | string
    createdAt?: DateTimeFilter<"ProjectExpense"> | Date | string
    project?: XOR<LandProjectNullableScalarRelationFilter, LandProjectWhereInput> | null
    bankAccount?: XOR<BankAccountNullableScalarRelationFilter, BankAccountWhereInput> | null
    paidByPartner?: XOR<PartnerNullableScalarRelationFilter, PartnerWhereInput> | null
  }, "id">

  export type ProjectExpenseOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrderInput | SortOrder
    expenseCategory?: SortOrder
    amount?: SortOrder
    expenseDate?: SortOrder
    description?: SortOrderInput | SortOrder
    paymentChannel?: SortOrder
    bankAccountId?: SortOrderInput | SortOrder
    paidByPartnerId?: SortOrderInput | SortOrder
    voucherImageUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    _count?: ProjectExpenseCountOrderByAggregateInput
    _avg?: ProjectExpenseAvgOrderByAggregateInput
    _max?: ProjectExpenseMaxOrderByAggregateInput
    _min?: ProjectExpenseMinOrderByAggregateInput
    _sum?: ProjectExpenseSumOrderByAggregateInput
  }

  export type ProjectExpenseScalarWhereWithAggregatesInput = {
    AND?: ProjectExpenseScalarWhereWithAggregatesInput | ProjectExpenseScalarWhereWithAggregatesInput[]
    OR?: ProjectExpenseScalarWhereWithAggregatesInput[]
    NOT?: ProjectExpenseScalarWhereWithAggregatesInput | ProjectExpenseScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectExpense"> | string
    projectId?: StringNullableWithAggregatesFilter<"ProjectExpense"> | string | null
    expenseCategory?: StringWithAggregatesFilter<"ProjectExpense"> | string
    amount?: DecimalWithAggregatesFilter<"ProjectExpense"> | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeWithAggregatesFilter<"ProjectExpense"> | Date | string
    description?: StringNullableWithAggregatesFilter<"ProjectExpense"> | string | null
    paymentChannel?: StringWithAggregatesFilter<"ProjectExpense"> | string
    bankAccountId?: StringNullableWithAggregatesFilter<"ProjectExpense"> | string | null
    paidByPartnerId?: StringNullableWithAggregatesFilter<"ProjectExpense"> | string | null
    voucherImageUrl?: StringNullableWithAggregatesFilter<"ProjectExpense"> | string | null
    status?: StringWithAggregatesFilter<"ProjectExpense"> | string
    approvedBy?: StringNullableWithAggregatesFilter<"ProjectExpense"> | string | null
    createdBy?: StringWithAggregatesFilter<"ProjectExpense"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ProjectExpense"> | Date | string
  }

  export type ProjectPlotWhereInput = {
    AND?: ProjectPlotWhereInput | ProjectPlotWhereInput[]
    OR?: ProjectPlotWhereInput[]
    NOT?: ProjectPlotWhereInput | ProjectPlotWhereInput[]
    id?: StringFilter<"ProjectPlot"> | string
    projectId?: StringFilter<"ProjectPlot"> | string
    plotNumber?: StringFilter<"ProjectPlot"> | string
    plotSizeShotok?: DecimalFilter<"ProjectPlot"> | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFilter<"ProjectPlot"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"ProjectPlot"> | string
    project?: XOR<LandProjectScalarRelationFilter, LandProjectWhereInput>
    landSales?: LandSaleListRelationFilter
  }

  export type ProjectPlotOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotNumber?: SortOrder
    plotSizeShotok?: SortOrder
    askingPrice?: SortOrder
    status?: SortOrder
    project?: LandProjectOrderByWithRelationInput
    landSales?: LandSaleOrderByRelationAggregateInput
    _relevance?: ProjectPlotOrderByRelevanceInput
  }

  export type ProjectPlotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProjectPlotWhereInput | ProjectPlotWhereInput[]
    OR?: ProjectPlotWhereInput[]
    NOT?: ProjectPlotWhereInput | ProjectPlotWhereInput[]
    projectId?: StringFilter<"ProjectPlot"> | string
    plotNumber?: StringFilter<"ProjectPlot"> | string
    plotSizeShotok?: DecimalFilter<"ProjectPlot"> | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFilter<"ProjectPlot"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"ProjectPlot"> | string
    project?: XOR<LandProjectScalarRelationFilter, LandProjectWhereInput>
    landSales?: LandSaleListRelationFilter
  }, "id">

  export type ProjectPlotOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotNumber?: SortOrder
    plotSizeShotok?: SortOrder
    askingPrice?: SortOrder
    status?: SortOrder
    _count?: ProjectPlotCountOrderByAggregateInput
    _avg?: ProjectPlotAvgOrderByAggregateInput
    _max?: ProjectPlotMaxOrderByAggregateInput
    _min?: ProjectPlotMinOrderByAggregateInput
    _sum?: ProjectPlotSumOrderByAggregateInput
  }

  export type ProjectPlotScalarWhereWithAggregatesInput = {
    AND?: ProjectPlotScalarWhereWithAggregatesInput | ProjectPlotScalarWhereWithAggregatesInput[]
    OR?: ProjectPlotScalarWhereWithAggregatesInput[]
    NOT?: ProjectPlotScalarWhereWithAggregatesInput | ProjectPlotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProjectPlot"> | string
    projectId?: StringWithAggregatesFilter<"ProjectPlot"> | string
    plotNumber?: StringWithAggregatesFilter<"ProjectPlot"> | string
    plotSizeShotok?: DecimalWithAggregatesFilter<"ProjectPlot"> | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalWithAggregatesFilter<"ProjectPlot"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"ProjectPlot"> | string
  }

  export type LandSaleWhereInput = {
    AND?: LandSaleWhereInput | LandSaleWhereInput[]
    OR?: LandSaleWhereInput[]
    NOT?: LandSaleWhereInput | LandSaleWhereInput[]
    id?: StringFilter<"LandSale"> | string
    projectId?: StringFilter<"LandSale"> | string
    plotId?: StringNullableFilter<"LandSale"> | string | null
    buyerName?: StringFilter<"LandSale"> | string
    buyerPhone?: StringFilter<"LandSale"> | string
    buyerNid?: StringNullableFilter<"LandSale"> | string | null
    saleDate?: DateTimeFilter<"LandSale"> | Date | string
    totalAgreedPrice?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"LandSale"> | string
    project?: XOR<LandProjectScalarRelationFilter, LandProjectWhereInput>
    plot?: XOR<ProjectPlotNullableScalarRelationFilter, ProjectPlotWhereInput> | null
    installmentSchedules?: InstallmentScheduleListRelationFilter
    customerPayments?: CustomerPaymentListRelationFilter
  }

  export type LandSaleOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotId?: SortOrderInput | SortOrder
    buyerName?: SortOrder
    buyerPhone?: SortOrder
    buyerNid?: SortOrderInput | SortOrder
    saleDate?: SortOrder
    totalAgreedPrice?: SortOrder
    advanceBookingAmount?: SortOrder
    currentDueAmount?: SortOrder
    status?: SortOrder
    project?: LandProjectOrderByWithRelationInput
    plot?: ProjectPlotOrderByWithRelationInput
    installmentSchedules?: InstallmentScheduleOrderByRelationAggregateInput
    customerPayments?: CustomerPaymentOrderByRelationAggregateInput
    _relevance?: LandSaleOrderByRelevanceInput
  }

  export type LandSaleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LandSaleWhereInput | LandSaleWhereInput[]
    OR?: LandSaleWhereInput[]
    NOT?: LandSaleWhereInput | LandSaleWhereInput[]
    projectId?: StringFilter<"LandSale"> | string
    plotId?: StringNullableFilter<"LandSale"> | string | null
    buyerName?: StringFilter<"LandSale"> | string
    buyerPhone?: StringFilter<"LandSale"> | string
    buyerNid?: StringNullableFilter<"LandSale"> | string | null
    saleDate?: DateTimeFilter<"LandSale"> | Date | string
    totalAgreedPrice?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"LandSale"> | string
    project?: XOR<LandProjectScalarRelationFilter, LandProjectWhereInput>
    plot?: XOR<ProjectPlotNullableScalarRelationFilter, ProjectPlotWhereInput> | null
    installmentSchedules?: InstallmentScheduleListRelationFilter
    customerPayments?: CustomerPaymentListRelationFilter
  }, "id">

  export type LandSaleOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotId?: SortOrderInput | SortOrder
    buyerName?: SortOrder
    buyerPhone?: SortOrder
    buyerNid?: SortOrderInput | SortOrder
    saleDate?: SortOrder
    totalAgreedPrice?: SortOrder
    advanceBookingAmount?: SortOrder
    currentDueAmount?: SortOrder
    status?: SortOrder
    _count?: LandSaleCountOrderByAggregateInput
    _avg?: LandSaleAvgOrderByAggregateInput
    _max?: LandSaleMaxOrderByAggregateInput
    _min?: LandSaleMinOrderByAggregateInput
    _sum?: LandSaleSumOrderByAggregateInput
  }

  export type LandSaleScalarWhereWithAggregatesInput = {
    AND?: LandSaleScalarWhereWithAggregatesInput | LandSaleScalarWhereWithAggregatesInput[]
    OR?: LandSaleScalarWhereWithAggregatesInput[]
    NOT?: LandSaleScalarWhereWithAggregatesInput | LandSaleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LandSale"> | string
    projectId?: StringWithAggregatesFilter<"LandSale"> | string
    plotId?: StringNullableWithAggregatesFilter<"LandSale"> | string | null
    buyerName?: StringWithAggregatesFilter<"LandSale"> | string
    buyerPhone?: StringWithAggregatesFilter<"LandSale"> | string
    buyerNid?: StringNullableWithAggregatesFilter<"LandSale"> | string | null
    saleDate?: DateTimeWithAggregatesFilter<"LandSale"> | Date | string
    totalAgreedPrice?: DecimalWithAggregatesFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalWithAggregatesFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalWithAggregatesFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"LandSale"> | string
  }

  export type InstallmentScheduleWhereInput = {
    AND?: InstallmentScheduleWhereInput | InstallmentScheduleWhereInput[]
    OR?: InstallmentScheduleWhereInput[]
    NOT?: InstallmentScheduleWhereInput | InstallmentScheduleWhereInput[]
    id?: StringFilter<"InstallmentSchedule"> | string
    saleId?: StringFilter<"InstallmentSchedule"> | string
    dueDate?: DateTimeFilter<"InstallmentSchedule"> | Date | string
    dueAmount?: DecimalFilter<"InstallmentSchedule"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"InstallmentSchedule"> | string
    sale?: XOR<LandSaleScalarRelationFilter, LandSaleWhereInput>
  }

  export type InstallmentScheduleOrderByWithRelationInput = {
    id?: SortOrder
    saleId?: SortOrder
    dueDate?: SortOrder
    dueAmount?: SortOrder
    status?: SortOrder
    sale?: LandSaleOrderByWithRelationInput
    _relevance?: InstallmentScheduleOrderByRelevanceInput
  }

  export type InstallmentScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InstallmentScheduleWhereInput | InstallmentScheduleWhereInput[]
    OR?: InstallmentScheduleWhereInput[]
    NOT?: InstallmentScheduleWhereInput | InstallmentScheduleWhereInput[]
    saleId?: StringFilter<"InstallmentSchedule"> | string
    dueDate?: DateTimeFilter<"InstallmentSchedule"> | Date | string
    dueAmount?: DecimalFilter<"InstallmentSchedule"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"InstallmentSchedule"> | string
    sale?: XOR<LandSaleScalarRelationFilter, LandSaleWhereInput>
  }, "id">

  export type InstallmentScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    saleId?: SortOrder
    dueDate?: SortOrder
    dueAmount?: SortOrder
    status?: SortOrder
    _count?: InstallmentScheduleCountOrderByAggregateInput
    _avg?: InstallmentScheduleAvgOrderByAggregateInput
    _max?: InstallmentScheduleMaxOrderByAggregateInput
    _min?: InstallmentScheduleMinOrderByAggregateInput
    _sum?: InstallmentScheduleSumOrderByAggregateInput
  }

  export type InstallmentScheduleScalarWhereWithAggregatesInput = {
    AND?: InstallmentScheduleScalarWhereWithAggregatesInput | InstallmentScheduleScalarWhereWithAggregatesInput[]
    OR?: InstallmentScheduleScalarWhereWithAggregatesInput[]
    NOT?: InstallmentScheduleScalarWhereWithAggregatesInput | InstallmentScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InstallmentSchedule"> | string
    saleId?: StringWithAggregatesFilter<"InstallmentSchedule"> | string
    dueDate?: DateTimeWithAggregatesFilter<"InstallmentSchedule"> | Date | string
    dueAmount?: DecimalWithAggregatesFilter<"InstallmentSchedule"> | Decimal | DecimalJsLike | number | string
    status?: StringWithAggregatesFilter<"InstallmentSchedule"> | string
  }

  export type CustomerPaymentWhereInput = {
    AND?: CustomerPaymentWhereInput | CustomerPaymentWhereInput[]
    OR?: CustomerPaymentWhereInput[]
    NOT?: CustomerPaymentWhereInput | CustomerPaymentWhereInput[]
    id?: StringFilter<"CustomerPayment"> | string
    saleId?: StringFilter<"CustomerPayment"> | string
    paymentDate?: DateTimeFilter<"CustomerPayment"> | Date | string
    amountPaid?: DecimalFilter<"CustomerPayment"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"CustomerPayment"> | string
    bankAccountId?: StringNullableFilter<"CustomerPayment"> | string | null
    receiptNo?: StringFilter<"CustomerPayment"> | string
    remarks?: StringNullableFilter<"CustomerPayment"> | string | null
    sale?: XOR<LandSaleScalarRelationFilter, LandSaleWhereInput>
    bankAccount?: XOR<BankAccountNullableScalarRelationFilter, BankAccountWhereInput> | null
  }

  export type CustomerPaymentOrderByWithRelationInput = {
    id?: SortOrder
    saleId?: SortOrder
    paymentDate?: SortOrder
    amountPaid?: SortOrder
    paymentMethod?: SortOrder
    bankAccountId?: SortOrderInput | SortOrder
    receiptNo?: SortOrder
    remarks?: SortOrderInput | SortOrder
    sale?: LandSaleOrderByWithRelationInput
    bankAccount?: BankAccountOrderByWithRelationInput
    _relevance?: CustomerPaymentOrderByRelevanceInput
  }

  export type CustomerPaymentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    receiptNo?: string
    AND?: CustomerPaymentWhereInput | CustomerPaymentWhereInput[]
    OR?: CustomerPaymentWhereInput[]
    NOT?: CustomerPaymentWhereInput | CustomerPaymentWhereInput[]
    saleId?: StringFilter<"CustomerPayment"> | string
    paymentDate?: DateTimeFilter<"CustomerPayment"> | Date | string
    amountPaid?: DecimalFilter<"CustomerPayment"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"CustomerPayment"> | string
    bankAccountId?: StringNullableFilter<"CustomerPayment"> | string | null
    remarks?: StringNullableFilter<"CustomerPayment"> | string | null
    sale?: XOR<LandSaleScalarRelationFilter, LandSaleWhereInput>
    bankAccount?: XOR<BankAccountNullableScalarRelationFilter, BankAccountWhereInput> | null
  }, "id" | "receiptNo">

  export type CustomerPaymentOrderByWithAggregationInput = {
    id?: SortOrder
    saleId?: SortOrder
    paymentDate?: SortOrder
    amountPaid?: SortOrder
    paymentMethod?: SortOrder
    bankAccountId?: SortOrderInput | SortOrder
    receiptNo?: SortOrder
    remarks?: SortOrderInput | SortOrder
    _count?: CustomerPaymentCountOrderByAggregateInput
    _avg?: CustomerPaymentAvgOrderByAggregateInput
    _max?: CustomerPaymentMaxOrderByAggregateInput
    _min?: CustomerPaymentMinOrderByAggregateInput
    _sum?: CustomerPaymentSumOrderByAggregateInput
  }

  export type CustomerPaymentScalarWhereWithAggregatesInput = {
    AND?: CustomerPaymentScalarWhereWithAggregatesInput | CustomerPaymentScalarWhereWithAggregatesInput[]
    OR?: CustomerPaymentScalarWhereWithAggregatesInput[]
    NOT?: CustomerPaymentScalarWhereWithAggregatesInput | CustomerPaymentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomerPayment"> | string
    saleId?: StringWithAggregatesFilter<"CustomerPayment"> | string
    paymentDate?: DateTimeWithAggregatesFilter<"CustomerPayment"> | Date | string
    amountPaid?: DecimalWithAggregatesFilter<"CustomerPayment"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringWithAggregatesFilter<"CustomerPayment"> | string
    bankAccountId?: StringNullableWithAggregatesFilter<"CustomerPayment"> | string | null
    receiptNo?: StringWithAggregatesFilter<"CustomerPayment"> | string
    remarks?: StringNullableWithAggregatesFilter<"CustomerPayment"> | string | null
  }

  export type ProfitDistributionWhereInput = {
    AND?: ProfitDistributionWhereInput | ProfitDistributionWhereInput[]
    OR?: ProfitDistributionWhereInput[]
    NOT?: ProfitDistributionWhereInput | ProfitDistributionWhereInput[]
    id?: StringFilter<"ProfitDistribution"> | string
    projectId?: StringFilter<"ProfitDistribution"> | string
    distributionDate?: DateTimeFilter<"ProfitDistribution"> | Date | string
    realizationBasis?: StringFilter<"ProfitDistribution"> | string
    totalProjectNetProfit?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    partnerId?: StringFilter<"ProfitDistribution"> | string
    partnerSharePercent?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    project?: XOR<LandProjectScalarRelationFilter, LandProjectWhereInput>
    partner?: XOR<PartnerScalarRelationFilter, PartnerWhereInput>
  }

  export type ProfitDistributionOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    distributionDate?: SortOrder
    realizationBasis?: SortOrder
    totalProjectNetProfit?: SortOrder
    partnerId?: SortOrder
    partnerSharePercent?: SortOrder
    payoutAmount?: SortOrder
    project?: LandProjectOrderByWithRelationInput
    partner?: PartnerOrderByWithRelationInput
    _relevance?: ProfitDistributionOrderByRelevanceInput
  }

  export type ProfitDistributionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ProfitDistributionWhereInput | ProfitDistributionWhereInput[]
    OR?: ProfitDistributionWhereInput[]
    NOT?: ProfitDistributionWhereInput | ProfitDistributionWhereInput[]
    projectId?: StringFilter<"ProfitDistribution"> | string
    distributionDate?: DateTimeFilter<"ProfitDistribution"> | Date | string
    realizationBasis?: StringFilter<"ProfitDistribution"> | string
    totalProjectNetProfit?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    partnerId?: StringFilter<"ProfitDistribution"> | string
    partnerSharePercent?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    project?: XOR<LandProjectScalarRelationFilter, LandProjectWhereInput>
    partner?: XOR<PartnerScalarRelationFilter, PartnerWhereInput>
  }, "id">

  export type ProfitDistributionOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    distributionDate?: SortOrder
    realizationBasis?: SortOrder
    totalProjectNetProfit?: SortOrder
    partnerId?: SortOrder
    partnerSharePercent?: SortOrder
    payoutAmount?: SortOrder
    _count?: ProfitDistributionCountOrderByAggregateInput
    _avg?: ProfitDistributionAvgOrderByAggregateInput
    _max?: ProfitDistributionMaxOrderByAggregateInput
    _min?: ProfitDistributionMinOrderByAggregateInput
    _sum?: ProfitDistributionSumOrderByAggregateInput
  }

  export type ProfitDistributionScalarWhereWithAggregatesInput = {
    AND?: ProfitDistributionScalarWhereWithAggregatesInput | ProfitDistributionScalarWhereWithAggregatesInput[]
    OR?: ProfitDistributionScalarWhereWithAggregatesInput[]
    NOT?: ProfitDistributionScalarWhereWithAggregatesInput | ProfitDistributionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProfitDistribution"> | string
    projectId?: StringWithAggregatesFilter<"ProfitDistribution"> | string
    distributionDate?: DateTimeWithAggregatesFilter<"ProfitDistribution"> | Date | string
    realizationBasis?: StringWithAggregatesFilter<"ProfitDistribution"> | string
    totalProjectNetProfit?: DecimalWithAggregatesFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    partnerId?: StringWithAggregatesFilter<"ProfitDistribution"> | string
    partnerSharePercent?: DecimalWithAggregatesFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalWithAggregatesFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    tableName?: StringFilter<"AuditLog"> | string
    recordId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    changedBy?: StringFilter<"AuditLog"> | string
    oldValues?: JsonNullableFilter<"AuditLog">
    newValues?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrder
    action?: SortOrder
    changedBy?: SortOrder
    oldValues?: SortOrderInput | SortOrder
    newValues?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _relevance?: AuditLogOrderByRelevanceInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    tableName?: StringFilter<"AuditLog"> | string
    recordId?: StringFilter<"AuditLog"> | string
    action?: StringFilter<"AuditLog"> | string
    changedBy?: StringFilter<"AuditLog"> | string
    oldValues?: JsonNullableFilter<"AuditLog">
    newValues?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrder
    action?: SortOrder
    changedBy?: SortOrder
    oldValues?: SortOrderInput | SortOrder
    newValues?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    tableName?: StringWithAggregatesFilter<"AuditLog"> | string
    recordId?: StringWithAggregatesFilter<"AuditLog"> | string
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    changedBy?: StringWithAggregatesFilter<"AuditLog"> | string
    oldValues?: JsonNullableWithAggregatesFilter<"AuditLog">
    newValues?: JsonNullableWithAggregatesFilter<"AuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type PartnerCreateInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutPartnerInput
    partnerTransactions?: PartnerTransactionCreateNestedManyWithoutPartnerInput
    paidExpenses?: ProjectExpenseCreateNestedManyWithoutPaidByPartnerInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUncheckedCreateInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutPartnerInput
    partnerTransactions?: PartnerTransactionUncheckedCreateNestedManyWithoutPartnerInput
    paidExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutPaidByPartnerInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutPartnerNestedInput
    partnerTransactions?: PartnerTransactionUpdateManyWithoutPartnerNestedInput
    paidExpenses?: ProjectExpenseUpdateManyWithoutPaidByPartnerNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutPartnerNestedInput
    partnerTransactions?: PartnerTransactionUncheckedUpdateManyWithoutPartnerNestedInput
    paidExpenses?: ProjectExpenseUncheckedUpdateManyWithoutPaidByPartnerNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerCreateManyInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
  }

  export type PartnerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PartnerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BankAccountCreateInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    treasuryLedgers?: TreasuryLedgerCreateNestedManyWithoutBankAccountInput
    expenses?: ProjectExpenseCreateNestedManyWithoutBankAccountInput
    customerPayments?: CustomerPaymentCreateNestedManyWithoutBankAccountInput
  }

  export type BankAccountUncheckedCreateInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    treasuryLedgers?: TreasuryLedgerUncheckedCreateNestedManyWithoutBankAccountInput
    expenses?: ProjectExpenseUncheckedCreateNestedManyWithoutBankAccountInput
    customerPayments?: CustomerPaymentUncheckedCreateNestedManyWithoutBankAccountInput
  }

  export type BankAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    treasuryLedgers?: TreasuryLedgerUpdateManyWithoutBankAccountNestedInput
    expenses?: ProjectExpenseUpdateManyWithoutBankAccountNestedInput
    customerPayments?: CustomerPaymentUpdateManyWithoutBankAccountNestedInput
  }

  export type BankAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    treasuryLedgers?: TreasuryLedgerUncheckedUpdateManyWithoutBankAccountNestedInput
    expenses?: ProjectExpenseUncheckedUpdateManyWithoutBankAccountNestedInput
    customerPayments?: CustomerPaymentUncheckedUpdateManyWithoutBankAccountNestedInput
  }

  export type BankAccountCreateManyInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
  }

  export type BankAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BankAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LandProjectCreateInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutProjectInput
    projectExpenses?: ProjectExpenseCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotCreateNestedManyWithoutProjectInput
    landSales?: LandSaleCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutProjectInput
  }

  export type LandProjectUncheckedCreateInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutProjectInput
    projectExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotUncheckedCreateNestedManyWithoutProjectInput
    landSales?: LandSaleUncheckedCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutProjectInput
  }

  export type LandProjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutProjectNestedInput
    projectExpenses?: ProjectExpenseUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutProjectNestedInput
  }

  export type LandProjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutProjectNestedInput
    projectExpenses?: ProjectExpenseUncheckedUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUncheckedUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUncheckedUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type LandProjectCreateManyInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
  }

  export type LandProjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LandProjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectPartnerCreateInput = {
    id: string
    sharePercentage: Decimal | DecimalJsLike | number | string
    project: LandProjectCreateNestedOneWithoutProjectPartnersInput
    partner: PartnerCreateNestedOneWithoutProjectPartnersInput
  }

  export type ProjectPartnerUncheckedCreateInput = {
    id: string
    projectId: string
    partnerId: string
    sharePercentage: Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    project?: LandProjectUpdateOneRequiredWithoutProjectPartnersNestedInput
    partner?: PartnerUpdateOneRequiredWithoutProjectPartnersNestedInput
  }

  export type ProjectPartnerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerCreateManyInput = {
    id: string
    projectId: string
    partnerId: string
    sharePercentage: Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type TreasuryLedgerCreateInput = {
    id: string
    txnDate: Date | string
    accountType: string
    flowType: string
    amount: Decimal | DecimalJsLike | number | string
    purpose: string
    referenceType: string
    referenceId?: string | null
    createdBy: string
    createdAt?: Date | string
    bankAccount?: BankAccountCreateNestedOneWithoutTreasuryLedgersInput
  }

  export type TreasuryLedgerUncheckedCreateInput = {
    id: string
    txnDate: Date | string
    accountType: string
    bankAccountId?: string | null
    flowType: string
    amount: Decimal | DecimalJsLike | number | string
    purpose: string
    referenceType: string
    referenceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type TreasuryLedgerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    accountType?: StringFieldUpdateOperationsInput | string
    flowType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purpose?: StringFieldUpdateOperationsInput | string
    referenceType?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bankAccount?: BankAccountUpdateOneWithoutTreasuryLedgersNestedInput
  }

  export type TreasuryLedgerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    accountType?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    flowType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purpose?: StringFieldUpdateOperationsInput | string
    referenceType?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreasuryLedgerCreateManyInput = {
    id: string
    txnDate: Date | string
    accountType: string
    bankAccountId?: string | null
    flowType: string
    amount: Decimal | DecimalJsLike | number | string
    purpose: string
    referenceType: string
    referenceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type TreasuryLedgerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    accountType?: StringFieldUpdateOperationsInput | string
    flowType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purpose?: StringFieldUpdateOperationsInput | string
    referenceType?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreasuryLedgerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    accountType?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    flowType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purpose?: StringFieldUpdateOperationsInput | string
    referenceType?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PartnerTransactionCreateInput = {
    id: string
    txnType: string
    amount: Decimal | DecimalJsLike | number | string
    txnDate: Date | string
    referenceId?: string | null
    notes?: string | null
    createdAt?: Date | string
    partner: PartnerCreateNestedOneWithoutPartnerTransactionsInput
  }

  export type PartnerTransactionUncheckedCreateInput = {
    id: string
    partnerId: string
    txnType: string
    amount: Decimal | DecimalJsLike | number | string
    txnDate: Date | string
    referenceId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type PartnerTransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partner?: PartnerUpdateOneRequiredWithoutPartnerTransactionsNestedInput
  }

  export type PartnerTransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    txnType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PartnerTransactionCreateManyInput = {
    id: string
    partnerId: string
    txnType: string
    amount: Decimal | DecimalJsLike | number | string
    txnDate: Date | string
    referenceId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type PartnerTransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PartnerTransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    txnType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectExpenseCreateInput = {
    id: string
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
    project?: LandProjectCreateNestedOneWithoutProjectExpensesInput
    bankAccount?: BankAccountCreateNestedOneWithoutExpensesInput
    paidByPartner?: PartnerCreateNestedOneWithoutPaidExpensesInput
  }

  export type ProjectExpenseUncheckedCreateInput = {
    id: string
    projectId?: string | null
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    bankAccountId?: string | null
    paidByPartnerId?: string | null
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type ProjectExpenseUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: LandProjectUpdateOneWithoutProjectExpensesNestedInput
    bankAccount?: BankAccountUpdateOneWithoutExpensesNestedInput
    paidByPartner?: PartnerUpdateOneWithoutPaidExpensesNestedInput
  }

  export type ProjectExpenseUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    paidByPartnerId?: NullableStringFieldUpdateOperationsInput | string | null
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectExpenseCreateManyInput = {
    id: string
    projectId?: string | null
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    bankAccountId?: string | null
    paidByPartnerId?: string | null
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type ProjectExpenseUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectExpenseUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    paidByPartnerId?: NullableStringFieldUpdateOperationsInput | string | null
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectPlotCreateInput = {
    id: string
    plotNumber: string
    plotSizeShotok: Decimal | DecimalJsLike | number | string
    askingPrice: Decimal | DecimalJsLike | number | string
    status?: string
    project: LandProjectCreateNestedOneWithoutProjectPlotsInput
    landSales?: LandSaleCreateNestedManyWithoutPlotInput
  }

  export type ProjectPlotUncheckedCreateInput = {
    id: string
    projectId: string
    plotNumber: string
    plotSizeShotok: Decimal | DecimalJsLike | number | string
    askingPrice: Decimal | DecimalJsLike | number | string
    status?: string
    landSales?: LandSaleUncheckedCreateNestedManyWithoutPlotInput
  }

  export type ProjectPlotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    project?: LandProjectUpdateOneRequiredWithoutProjectPlotsNestedInput
    landSales?: LandSaleUpdateManyWithoutPlotNestedInput
  }

  export type ProjectPlotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    landSales?: LandSaleUncheckedUpdateManyWithoutPlotNestedInput
  }

  export type ProjectPlotCreateManyInput = {
    id: string
    projectId: string
    plotNumber: string
    plotSizeShotok: Decimal | DecimalJsLike | number | string
    askingPrice: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type ProjectPlotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProjectPlotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type LandSaleCreateInput = {
    id: string
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    project: LandProjectCreateNestedOneWithoutLandSalesInput
    plot?: ProjectPlotCreateNestedOneWithoutLandSalesInput
    installmentSchedules?: InstallmentScheduleCreateNestedManyWithoutSaleInput
    customerPayments?: CustomerPaymentCreateNestedManyWithoutSaleInput
  }

  export type LandSaleUncheckedCreateInput = {
    id: string
    projectId: string
    plotId?: string | null
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    installmentSchedules?: InstallmentScheduleUncheckedCreateNestedManyWithoutSaleInput
    customerPayments?: CustomerPaymentUncheckedCreateNestedManyWithoutSaleInput
  }

  export type LandSaleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    project?: LandProjectUpdateOneRequiredWithoutLandSalesNestedInput
    plot?: ProjectPlotUpdateOneWithoutLandSalesNestedInput
    installmentSchedules?: InstallmentScheduleUpdateManyWithoutSaleNestedInput
    customerPayments?: CustomerPaymentUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    plotId?: NullableStringFieldUpdateOperationsInput | string | null
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    installmentSchedules?: InstallmentScheduleUncheckedUpdateManyWithoutSaleNestedInput
    customerPayments?: CustomerPaymentUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleCreateManyInput = {
    id: string
    projectId: string
    plotId?: string | null
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type LandSaleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type LandSaleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    plotId?: NullableStringFieldUpdateOperationsInput | string | null
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type InstallmentScheduleCreateInput = {
    id: string
    dueDate: Date | string
    dueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    sale: LandSaleCreateNestedOneWithoutInstallmentSchedulesInput
  }

  export type InstallmentScheduleUncheckedCreateInput = {
    id: string
    saleId: string
    dueDate: Date | string
    dueAmount: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type InstallmentScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    sale?: LandSaleUpdateOneRequiredWithoutInstallmentSchedulesNestedInput
  }

  export type InstallmentScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type InstallmentScheduleCreateManyInput = {
    id: string
    saleId: string
    dueDate: Date | string
    dueAmount: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type InstallmentScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type InstallmentScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CustomerPaymentCreateInput = {
    id: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    receiptNo: string
    remarks?: string | null
    sale: LandSaleCreateNestedOneWithoutCustomerPaymentsInput
    bankAccount?: BankAccountCreateNestedOneWithoutCustomerPaymentsInput
  }

  export type CustomerPaymentUncheckedCreateInput = {
    id: string
    saleId: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    bankAccountId?: string | null
    receiptNo: string
    remarks?: string | null
  }

  export type CustomerPaymentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    sale?: LandSaleUpdateOneRequiredWithoutCustomerPaymentsNestedInput
    bankAccount?: BankAccountUpdateOneWithoutCustomerPaymentsNestedInput
  }

  export type CustomerPaymentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerPaymentCreateManyInput = {
    id: string
    saleId: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    bankAccountId?: string | null
    receiptNo: string
    remarks?: string | null
  }

  export type CustomerPaymentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerPaymentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProfitDistributionCreateInput = {
    id: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
    project: LandProjectCreateNestedOneWithoutProfitDistributionsInput
    partner: PartnerCreateNestedOneWithoutProfitDistributionsInput
  }

  export type ProfitDistributionUncheckedCreateInput = {
    id: string
    projectId: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerId: string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
  }

  export type ProfitDistributionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    project?: LandProjectUpdateOneRequiredWithoutProfitDistributionsNestedInput
    partner?: PartnerUpdateOneRequiredWithoutProfitDistributionsNestedInput
  }

  export type ProfitDistributionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerId?: StringFieldUpdateOperationsInput | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProfitDistributionCreateManyInput = {
    id: string
    projectId: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerId: string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
  }

  export type ProfitDistributionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProfitDistributionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerId?: StringFieldUpdateOperationsInput | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type AuditLogCreateInput = {
    id: string
    tableName: string
    recordId: string
    action: string
    changedBy: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUncheckedCreateInput = {
    id: string
    tableName: string
    recordId: string
    action: string
    changedBy: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableName?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    changedBy?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableName?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    changedBy?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id: string
    tableName: string
    recordId: string
    action: string
    changedBy: string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableName?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    changedBy?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tableName?: StringFieldUpdateOperationsInput | string
    recordId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    changedBy?: StringFieldUpdateOperationsInput | string
    oldValues?: NullableJsonNullValueInput | InputJsonValue
    newValues?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type ProjectPartnerListRelationFilter = {
    every?: ProjectPartnerWhereInput
    some?: ProjectPartnerWhereInput
    none?: ProjectPartnerWhereInput
  }

  export type PartnerTransactionListRelationFilter = {
    every?: PartnerTransactionWhereInput
    some?: PartnerTransactionWhereInput
    none?: PartnerTransactionWhereInput
  }

  export type ProjectExpenseListRelationFilter = {
    every?: ProjectExpenseWhereInput
    some?: ProjectExpenseWhereInput
    none?: ProjectExpenseWhereInput
  }

  export type ProfitDistributionListRelationFilter = {
    every?: ProfitDistributionWhereInput
    some?: ProfitDistributionWhereInput
    none?: ProfitDistributionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProjectPartnerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PartnerTransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectExpenseOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfitDistributionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PartnerOrderByRelevanceInput = {
    fields: PartnerOrderByRelevanceFieldEnum | PartnerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PartnerCountOrderByAggregateInput = {
    id?: SortOrder
    globalUserId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    nidNumber?: SortOrder
    openingBalance?: SortOrder
    createdAt?: SortOrder
  }

  export type PartnerAvgOrderByAggregateInput = {
    openingBalance?: SortOrder
  }

  export type PartnerMaxOrderByAggregateInput = {
    id?: SortOrder
    globalUserId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    nidNumber?: SortOrder
    openingBalance?: SortOrder
    createdAt?: SortOrder
  }

  export type PartnerMinOrderByAggregateInput = {
    id?: SortOrder
    globalUserId?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    nidNumber?: SortOrder
    openingBalance?: SortOrder
    createdAt?: SortOrder
  }

  export type PartnerSumOrderByAggregateInput = {
    openingBalance?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TreasuryLedgerListRelationFilter = {
    every?: TreasuryLedgerWhereInput
    some?: TreasuryLedgerWhereInput
    none?: TreasuryLedgerWhereInput
  }

  export type CustomerPaymentListRelationFilter = {
    every?: CustomerPaymentWhereInput
    some?: CustomerPaymentWhereInput
    none?: CustomerPaymentWhereInput
  }

  export type TreasuryLedgerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CustomerPaymentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BankAccountOrderByRelevanceInput = {
    fields: BankAccountOrderByRelevanceFieldEnum | BankAccountOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BankAccountCountOrderByAggregateInput = {
    id?: SortOrder
    bankName?: SortOrder
    accountNumber?: SortOrder
    branchName?: SortOrder
    currentBalance?: SortOrder
    isActive?: SortOrder
  }

  export type BankAccountAvgOrderByAggregateInput = {
    currentBalance?: SortOrder
  }

  export type BankAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    bankName?: SortOrder
    accountNumber?: SortOrder
    branchName?: SortOrder
    currentBalance?: SortOrder
    isActive?: SortOrder
  }

  export type BankAccountMinOrderByAggregateInput = {
    id?: SortOrder
    bankName?: SortOrder
    accountNumber?: SortOrder
    branchName?: SortOrder
    currentBalance?: SortOrder
    isActive?: SortOrder
  }

  export type BankAccountSumOrderByAggregateInput = {
    currentBalance?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type ProjectPlotListRelationFilter = {
    every?: ProjectPlotWhereInput
    some?: ProjectPlotWhereInput
    none?: ProjectPlotWhereInput
  }

  export type LandSaleListRelationFilter = {
    every?: LandSaleWhereInput
    some?: LandSaleWhereInput
    none?: LandSaleWhereInput
  }

  export type ProjectPlotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LandSaleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LandProjectOrderByRelevanceInput = {
    fields: LandProjectOrderByRelevanceFieldEnum | LandProjectOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LandProjectCountOrderByAggregateInput = {
    id?: SortOrder
    projectName?: SortOrder
    mouza?: SortOrder
    jlNumber?: SortOrder
    dagNumbers?: SortOrder
    khatianNumbers?: SortOrder
    totalAreaShotok?: SortOrder
    purchasePrice?: SortOrder
    baynaAmount?: SortOrder
    registrationCost?: SortOrder
    mutationTaxCost?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type LandProjectAvgOrderByAggregateInput = {
    totalAreaShotok?: SortOrder
    purchasePrice?: SortOrder
    baynaAmount?: SortOrder
    registrationCost?: SortOrder
    mutationTaxCost?: SortOrder
  }

  export type LandProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    projectName?: SortOrder
    mouza?: SortOrder
    jlNumber?: SortOrder
    dagNumbers?: SortOrder
    khatianNumbers?: SortOrder
    totalAreaShotok?: SortOrder
    purchasePrice?: SortOrder
    baynaAmount?: SortOrder
    registrationCost?: SortOrder
    mutationTaxCost?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type LandProjectMinOrderByAggregateInput = {
    id?: SortOrder
    projectName?: SortOrder
    mouza?: SortOrder
    jlNumber?: SortOrder
    dagNumbers?: SortOrder
    khatianNumbers?: SortOrder
    totalAreaShotok?: SortOrder
    purchasePrice?: SortOrder
    baynaAmount?: SortOrder
    registrationCost?: SortOrder
    mutationTaxCost?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type LandProjectSumOrderByAggregateInput = {
    totalAreaShotok?: SortOrder
    purchasePrice?: SortOrder
    baynaAmount?: SortOrder
    registrationCost?: SortOrder
    mutationTaxCost?: SortOrder
  }

  export type LandProjectScalarRelationFilter = {
    is?: LandProjectWhereInput
    isNot?: LandProjectWhereInput
  }

  export type PartnerScalarRelationFilter = {
    is?: PartnerWhereInput
    isNot?: PartnerWhereInput
  }

  export type ProjectPartnerOrderByRelevanceInput = {
    fields: ProjectPartnerOrderByRelevanceFieldEnum | ProjectPartnerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProjectPartnerProjectIdPartnerIdCompoundUniqueInput = {
    projectId: string
    partnerId: string
  }

  export type ProjectPartnerCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    partnerId?: SortOrder
    sharePercentage?: SortOrder
  }

  export type ProjectPartnerAvgOrderByAggregateInput = {
    sharePercentage?: SortOrder
  }

  export type ProjectPartnerMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    partnerId?: SortOrder
    sharePercentage?: SortOrder
  }

  export type ProjectPartnerMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    partnerId?: SortOrder
    sharePercentage?: SortOrder
  }

  export type ProjectPartnerSumOrderByAggregateInput = {
    sharePercentage?: SortOrder
  }

  export type BankAccountNullableScalarRelationFilter = {
    is?: BankAccountWhereInput | null
    isNot?: BankAccountWhereInput | null
  }

  export type TreasuryLedgerOrderByRelevanceInput = {
    fields: TreasuryLedgerOrderByRelevanceFieldEnum | TreasuryLedgerOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TreasuryLedgerCountOrderByAggregateInput = {
    id?: SortOrder
    txnDate?: SortOrder
    accountType?: SortOrder
    bankAccountId?: SortOrder
    flowType?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    referenceType?: SortOrder
    referenceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type TreasuryLedgerAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type TreasuryLedgerMaxOrderByAggregateInput = {
    id?: SortOrder
    txnDate?: SortOrder
    accountType?: SortOrder
    bankAccountId?: SortOrder
    flowType?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    referenceType?: SortOrder
    referenceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type TreasuryLedgerMinOrderByAggregateInput = {
    id?: SortOrder
    txnDate?: SortOrder
    accountType?: SortOrder
    bankAccountId?: SortOrder
    flowType?: SortOrder
    amount?: SortOrder
    purpose?: SortOrder
    referenceType?: SortOrder
    referenceId?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type TreasuryLedgerSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PartnerTransactionOrderByRelevanceInput = {
    fields: PartnerTransactionOrderByRelevanceFieldEnum | PartnerTransactionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PartnerTransactionCountOrderByAggregateInput = {
    id?: SortOrder
    partnerId?: SortOrder
    txnType?: SortOrder
    amount?: SortOrder
    txnDate?: SortOrder
    referenceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type PartnerTransactionAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PartnerTransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    partnerId?: SortOrder
    txnType?: SortOrder
    amount?: SortOrder
    txnDate?: SortOrder
    referenceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type PartnerTransactionMinOrderByAggregateInput = {
    id?: SortOrder
    partnerId?: SortOrder
    txnType?: SortOrder
    amount?: SortOrder
    txnDate?: SortOrder
    referenceId?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
  }

  export type PartnerTransactionSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type LandProjectNullableScalarRelationFilter = {
    is?: LandProjectWhereInput | null
    isNot?: LandProjectWhereInput | null
  }

  export type PartnerNullableScalarRelationFilter = {
    is?: PartnerWhereInput | null
    isNot?: PartnerWhereInput | null
  }

  export type ProjectExpenseOrderByRelevanceInput = {
    fields: ProjectExpenseOrderByRelevanceFieldEnum | ProjectExpenseOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProjectExpenseCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    expenseCategory?: SortOrder
    amount?: SortOrder
    expenseDate?: SortOrder
    description?: SortOrder
    paymentChannel?: SortOrder
    bankAccountId?: SortOrder
    paidByPartnerId?: SortOrder
    voucherImageUrl?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectExpenseAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ProjectExpenseMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    expenseCategory?: SortOrder
    amount?: SortOrder
    expenseDate?: SortOrder
    description?: SortOrder
    paymentChannel?: SortOrder
    bankAccountId?: SortOrder
    paidByPartnerId?: SortOrder
    voucherImageUrl?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectExpenseMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    expenseCategory?: SortOrder
    amount?: SortOrder
    expenseDate?: SortOrder
    description?: SortOrder
    paymentChannel?: SortOrder
    bankAccountId?: SortOrder
    paidByPartnerId?: SortOrder
    voucherImageUrl?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
  }

  export type ProjectExpenseSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type ProjectPlotOrderByRelevanceInput = {
    fields: ProjectPlotOrderByRelevanceFieldEnum | ProjectPlotOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProjectPlotCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotNumber?: SortOrder
    plotSizeShotok?: SortOrder
    askingPrice?: SortOrder
    status?: SortOrder
  }

  export type ProjectPlotAvgOrderByAggregateInput = {
    plotSizeShotok?: SortOrder
    askingPrice?: SortOrder
  }

  export type ProjectPlotMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotNumber?: SortOrder
    plotSizeShotok?: SortOrder
    askingPrice?: SortOrder
    status?: SortOrder
  }

  export type ProjectPlotMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotNumber?: SortOrder
    plotSizeShotok?: SortOrder
    askingPrice?: SortOrder
    status?: SortOrder
  }

  export type ProjectPlotSumOrderByAggregateInput = {
    plotSizeShotok?: SortOrder
    askingPrice?: SortOrder
  }

  export type ProjectPlotNullableScalarRelationFilter = {
    is?: ProjectPlotWhereInput | null
    isNot?: ProjectPlotWhereInput | null
  }

  export type InstallmentScheduleListRelationFilter = {
    every?: InstallmentScheduleWhereInput
    some?: InstallmentScheduleWhereInput
    none?: InstallmentScheduleWhereInput
  }

  export type InstallmentScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LandSaleOrderByRelevanceInput = {
    fields: LandSaleOrderByRelevanceFieldEnum | LandSaleOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LandSaleCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotId?: SortOrder
    buyerName?: SortOrder
    buyerPhone?: SortOrder
    buyerNid?: SortOrder
    saleDate?: SortOrder
    totalAgreedPrice?: SortOrder
    advanceBookingAmount?: SortOrder
    currentDueAmount?: SortOrder
    status?: SortOrder
  }

  export type LandSaleAvgOrderByAggregateInput = {
    totalAgreedPrice?: SortOrder
    advanceBookingAmount?: SortOrder
    currentDueAmount?: SortOrder
  }

  export type LandSaleMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotId?: SortOrder
    buyerName?: SortOrder
    buyerPhone?: SortOrder
    buyerNid?: SortOrder
    saleDate?: SortOrder
    totalAgreedPrice?: SortOrder
    advanceBookingAmount?: SortOrder
    currentDueAmount?: SortOrder
    status?: SortOrder
  }

  export type LandSaleMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    plotId?: SortOrder
    buyerName?: SortOrder
    buyerPhone?: SortOrder
    buyerNid?: SortOrder
    saleDate?: SortOrder
    totalAgreedPrice?: SortOrder
    advanceBookingAmount?: SortOrder
    currentDueAmount?: SortOrder
    status?: SortOrder
  }

  export type LandSaleSumOrderByAggregateInput = {
    totalAgreedPrice?: SortOrder
    advanceBookingAmount?: SortOrder
    currentDueAmount?: SortOrder
  }

  export type LandSaleScalarRelationFilter = {
    is?: LandSaleWhereInput
    isNot?: LandSaleWhereInput
  }

  export type InstallmentScheduleOrderByRelevanceInput = {
    fields: InstallmentScheduleOrderByRelevanceFieldEnum | InstallmentScheduleOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type InstallmentScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    dueDate?: SortOrder
    dueAmount?: SortOrder
    status?: SortOrder
  }

  export type InstallmentScheduleAvgOrderByAggregateInput = {
    dueAmount?: SortOrder
  }

  export type InstallmentScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    dueDate?: SortOrder
    dueAmount?: SortOrder
    status?: SortOrder
  }

  export type InstallmentScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    dueDate?: SortOrder
    dueAmount?: SortOrder
    status?: SortOrder
  }

  export type InstallmentScheduleSumOrderByAggregateInput = {
    dueAmount?: SortOrder
  }

  export type CustomerPaymentOrderByRelevanceInput = {
    fields: CustomerPaymentOrderByRelevanceFieldEnum | CustomerPaymentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CustomerPaymentCountOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    paymentDate?: SortOrder
    amountPaid?: SortOrder
    paymentMethod?: SortOrder
    bankAccountId?: SortOrder
    receiptNo?: SortOrder
    remarks?: SortOrder
  }

  export type CustomerPaymentAvgOrderByAggregateInput = {
    amountPaid?: SortOrder
  }

  export type CustomerPaymentMaxOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    paymentDate?: SortOrder
    amountPaid?: SortOrder
    paymentMethod?: SortOrder
    bankAccountId?: SortOrder
    receiptNo?: SortOrder
    remarks?: SortOrder
  }

  export type CustomerPaymentMinOrderByAggregateInput = {
    id?: SortOrder
    saleId?: SortOrder
    paymentDate?: SortOrder
    amountPaid?: SortOrder
    paymentMethod?: SortOrder
    bankAccountId?: SortOrder
    receiptNo?: SortOrder
    remarks?: SortOrder
  }

  export type CustomerPaymentSumOrderByAggregateInput = {
    amountPaid?: SortOrder
  }

  export type ProfitDistributionOrderByRelevanceInput = {
    fields: ProfitDistributionOrderByRelevanceFieldEnum | ProfitDistributionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ProfitDistributionCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    distributionDate?: SortOrder
    realizationBasis?: SortOrder
    totalProjectNetProfit?: SortOrder
    partnerId?: SortOrder
    partnerSharePercent?: SortOrder
    payoutAmount?: SortOrder
  }

  export type ProfitDistributionAvgOrderByAggregateInput = {
    totalProjectNetProfit?: SortOrder
    partnerSharePercent?: SortOrder
    payoutAmount?: SortOrder
  }

  export type ProfitDistributionMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    distributionDate?: SortOrder
    realizationBasis?: SortOrder
    totalProjectNetProfit?: SortOrder
    partnerId?: SortOrder
    partnerSharePercent?: SortOrder
    payoutAmount?: SortOrder
  }

  export type ProfitDistributionMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    distributionDate?: SortOrder
    realizationBasis?: SortOrder
    totalProjectNetProfit?: SortOrder
    partnerId?: SortOrder
    partnerSharePercent?: SortOrder
    payoutAmount?: SortOrder
  }

  export type ProfitDistributionSumOrderByAggregateInput = {
    totalProjectNetProfit?: SortOrder
    partnerSharePercent?: SortOrder
    payoutAmount?: SortOrder
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

  export type AuditLogOrderByRelevanceInput = {
    fields: AuditLogOrderByRelevanceFieldEnum | AuditLogOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrder
    action?: SortOrder
    changedBy?: SortOrder
    oldValues?: SortOrder
    newValues?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrder
    action?: SortOrder
    changedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    tableName?: SortOrder
    recordId?: SortOrder
    action?: SortOrder
    changedBy?: SortOrder
    createdAt?: SortOrder
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

  export type ProjectPartnerCreateNestedManyWithoutPartnerInput = {
    create?: XOR<ProjectPartnerCreateWithoutPartnerInput, ProjectPartnerUncheckedCreateWithoutPartnerInput> | ProjectPartnerCreateWithoutPartnerInput[] | ProjectPartnerUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ProjectPartnerCreateOrConnectWithoutPartnerInput | ProjectPartnerCreateOrConnectWithoutPartnerInput[]
    createMany?: ProjectPartnerCreateManyPartnerInputEnvelope
    connect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
  }

  export type PartnerTransactionCreateNestedManyWithoutPartnerInput = {
    create?: XOR<PartnerTransactionCreateWithoutPartnerInput, PartnerTransactionUncheckedCreateWithoutPartnerInput> | PartnerTransactionCreateWithoutPartnerInput[] | PartnerTransactionUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: PartnerTransactionCreateOrConnectWithoutPartnerInput | PartnerTransactionCreateOrConnectWithoutPartnerInput[]
    createMany?: PartnerTransactionCreateManyPartnerInputEnvelope
    connect?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
  }

  export type ProjectExpenseCreateNestedManyWithoutPaidByPartnerInput = {
    create?: XOR<ProjectExpenseCreateWithoutPaidByPartnerInput, ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput> | ProjectExpenseCreateWithoutPaidByPartnerInput[] | ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput | ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput[]
    createMany?: ProjectExpenseCreateManyPaidByPartnerInputEnvelope
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
  }

  export type ProfitDistributionCreateNestedManyWithoutPartnerInput = {
    create?: XOR<ProfitDistributionCreateWithoutPartnerInput, ProfitDistributionUncheckedCreateWithoutPartnerInput> | ProfitDistributionCreateWithoutPartnerInput[] | ProfitDistributionUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ProfitDistributionCreateOrConnectWithoutPartnerInput | ProfitDistributionCreateOrConnectWithoutPartnerInput[]
    createMany?: ProfitDistributionCreateManyPartnerInputEnvelope
    connect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
  }

  export type ProjectPartnerUncheckedCreateNestedManyWithoutPartnerInput = {
    create?: XOR<ProjectPartnerCreateWithoutPartnerInput, ProjectPartnerUncheckedCreateWithoutPartnerInput> | ProjectPartnerCreateWithoutPartnerInput[] | ProjectPartnerUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ProjectPartnerCreateOrConnectWithoutPartnerInput | ProjectPartnerCreateOrConnectWithoutPartnerInput[]
    createMany?: ProjectPartnerCreateManyPartnerInputEnvelope
    connect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
  }

  export type PartnerTransactionUncheckedCreateNestedManyWithoutPartnerInput = {
    create?: XOR<PartnerTransactionCreateWithoutPartnerInput, PartnerTransactionUncheckedCreateWithoutPartnerInput> | PartnerTransactionCreateWithoutPartnerInput[] | PartnerTransactionUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: PartnerTransactionCreateOrConnectWithoutPartnerInput | PartnerTransactionCreateOrConnectWithoutPartnerInput[]
    createMany?: PartnerTransactionCreateManyPartnerInputEnvelope
    connect?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
  }

  export type ProjectExpenseUncheckedCreateNestedManyWithoutPaidByPartnerInput = {
    create?: XOR<ProjectExpenseCreateWithoutPaidByPartnerInput, ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput> | ProjectExpenseCreateWithoutPaidByPartnerInput[] | ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput | ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput[]
    createMany?: ProjectExpenseCreateManyPaidByPartnerInputEnvelope
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
  }

  export type ProfitDistributionUncheckedCreateNestedManyWithoutPartnerInput = {
    create?: XOR<ProfitDistributionCreateWithoutPartnerInput, ProfitDistributionUncheckedCreateWithoutPartnerInput> | ProfitDistributionCreateWithoutPartnerInput[] | ProfitDistributionUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ProfitDistributionCreateOrConnectWithoutPartnerInput | ProfitDistributionCreateOrConnectWithoutPartnerInput[]
    createMany?: ProfitDistributionCreateManyPartnerInputEnvelope
    connect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectPartnerUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<ProjectPartnerCreateWithoutPartnerInput, ProjectPartnerUncheckedCreateWithoutPartnerInput> | ProjectPartnerCreateWithoutPartnerInput[] | ProjectPartnerUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ProjectPartnerCreateOrConnectWithoutPartnerInput | ProjectPartnerCreateOrConnectWithoutPartnerInput[]
    upsert?: ProjectPartnerUpsertWithWhereUniqueWithoutPartnerInput | ProjectPartnerUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: ProjectPartnerCreateManyPartnerInputEnvelope
    set?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    disconnect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    delete?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    connect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    update?: ProjectPartnerUpdateWithWhereUniqueWithoutPartnerInput | ProjectPartnerUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: ProjectPartnerUpdateManyWithWhereWithoutPartnerInput | ProjectPartnerUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: ProjectPartnerScalarWhereInput | ProjectPartnerScalarWhereInput[]
  }

  export type PartnerTransactionUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<PartnerTransactionCreateWithoutPartnerInput, PartnerTransactionUncheckedCreateWithoutPartnerInput> | PartnerTransactionCreateWithoutPartnerInput[] | PartnerTransactionUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: PartnerTransactionCreateOrConnectWithoutPartnerInput | PartnerTransactionCreateOrConnectWithoutPartnerInput[]
    upsert?: PartnerTransactionUpsertWithWhereUniqueWithoutPartnerInput | PartnerTransactionUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: PartnerTransactionCreateManyPartnerInputEnvelope
    set?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
    disconnect?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
    delete?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
    connect?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
    update?: PartnerTransactionUpdateWithWhereUniqueWithoutPartnerInput | PartnerTransactionUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: PartnerTransactionUpdateManyWithWhereWithoutPartnerInput | PartnerTransactionUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: PartnerTransactionScalarWhereInput | PartnerTransactionScalarWhereInput[]
  }

  export type ProjectExpenseUpdateManyWithoutPaidByPartnerNestedInput = {
    create?: XOR<ProjectExpenseCreateWithoutPaidByPartnerInput, ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput> | ProjectExpenseCreateWithoutPaidByPartnerInput[] | ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput | ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput[]
    upsert?: ProjectExpenseUpsertWithWhereUniqueWithoutPaidByPartnerInput | ProjectExpenseUpsertWithWhereUniqueWithoutPaidByPartnerInput[]
    createMany?: ProjectExpenseCreateManyPaidByPartnerInputEnvelope
    set?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    disconnect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    delete?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    update?: ProjectExpenseUpdateWithWhereUniqueWithoutPaidByPartnerInput | ProjectExpenseUpdateWithWhereUniqueWithoutPaidByPartnerInput[]
    updateMany?: ProjectExpenseUpdateManyWithWhereWithoutPaidByPartnerInput | ProjectExpenseUpdateManyWithWhereWithoutPaidByPartnerInput[]
    deleteMany?: ProjectExpenseScalarWhereInput | ProjectExpenseScalarWhereInput[]
  }

  export type ProfitDistributionUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<ProfitDistributionCreateWithoutPartnerInput, ProfitDistributionUncheckedCreateWithoutPartnerInput> | ProfitDistributionCreateWithoutPartnerInput[] | ProfitDistributionUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ProfitDistributionCreateOrConnectWithoutPartnerInput | ProfitDistributionCreateOrConnectWithoutPartnerInput[]
    upsert?: ProfitDistributionUpsertWithWhereUniqueWithoutPartnerInput | ProfitDistributionUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: ProfitDistributionCreateManyPartnerInputEnvelope
    set?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    disconnect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    delete?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    connect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    update?: ProfitDistributionUpdateWithWhereUniqueWithoutPartnerInput | ProfitDistributionUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: ProfitDistributionUpdateManyWithWhereWithoutPartnerInput | ProfitDistributionUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: ProfitDistributionScalarWhereInput | ProfitDistributionScalarWhereInput[]
  }

  export type ProjectPartnerUncheckedUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<ProjectPartnerCreateWithoutPartnerInput, ProjectPartnerUncheckedCreateWithoutPartnerInput> | ProjectPartnerCreateWithoutPartnerInput[] | ProjectPartnerUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ProjectPartnerCreateOrConnectWithoutPartnerInput | ProjectPartnerCreateOrConnectWithoutPartnerInput[]
    upsert?: ProjectPartnerUpsertWithWhereUniqueWithoutPartnerInput | ProjectPartnerUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: ProjectPartnerCreateManyPartnerInputEnvelope
    set?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    disconnect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    delete?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    connect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    update?: ProjectPartnerUpdateWithWhereUniqueWithoutPartnerInput | ProjectPartnerUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: ProjectPartnerUpdateManyWithWhereWithoutPartnerInput | ProjectPartnerUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: ProjectPartnerScalarWhereInput | ProjectPartnerScalarWhereInput[]
  }

  export type PartnerTransactionUncheckedUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<PartnerTransactionCreateWithoutPartnerInput, PartnerTransactionUncheckedCreateWithoutPartnerInput> | PartnerTransactionCreateWithoutPartnerInput[] | PartnerTransactionUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: PartnerTransactionCreateOrConnectWithoutPartnerInput | PartnerTransactionCreateOrConnectWithoutPartnerInput[]
    upsert?: PartnerTransactionUpsertWithWhereUniqueWithoutPartnerInput | PartnerTransactionUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: PartnerTransactionCreateManyPartnerInputEnvelope
    set?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
    disconnect?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
    delete?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
    connect?: PartnerTransactionWhereUniqueInput | PartnerTransactionWhereUniqueInput[]
    update?: PartnerTransactionUpdateWithWhereUniqueWithoutPartnerInput | PartnerTransactionUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: PartnerTransactionUpdateManyWithWhereWithoutPartnerInput | PartnerTransactionUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: PartnerTransactionScalarWhereInput | PartnerTransactionScalarWhereInput[]
  }

  export type ProjectExpenseUncheckedUpdateManyWithoutPaidByPartnerNestedInput = {
    create?: XOR<ProjectExpenseCreateWithoutPaidByPartnerInput, ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput> | ProjectExpenseCreateWithoutPaidByPartnerInput[] | ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput | ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput[]
    upsert?: ProjectExpenseUpsertWithWhereUniqueWithoutPaidByPartnerInput | ProjectExpenseUpsertWithWhereUniqueWithoutPaidByPartnerInput[]
    createMany?: ProjectExpenseCreateManyPaidByPartnerInputEnvelope
    set?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    disconnect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    delete?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    update?: ProjectExpenseUpdateWithWhereUniqueWithoutPaidByPartnerInput | ProjectExpenseUpdateWithWhereUniqueWithoutPaidByPartnerInput[]
    updateMany?: ProjectExpenseUpdateManyWithWhereWithoutPaidByPartnerInput | ProjectExpenseUpdateManyWithWhereWithoutPaidByPartnerInput[]
    deleteMany?: ProjectExpenseScalarWhereInput | ProjectExpenseScalarWhereInput[]
  }

  export type ProfitDistributionUncheckedUpdateManyWithoutPartnerNestedInput = {
    create?: XOR<ProfitDistributionCreateWithoutPartnerInput, ProfitDistributionUncheckedCreateWithoutPartnerInput> | ProfitDistributionCreateWithoutPartnerInput[] | ProfitDistributionUncheckedCreateWithoutPartnerInput[]
    connectOrCreate?: ProfitDistributionCreateOrConnectWithoutPartnerInput | ProfitDistributionCreateOrConnectWithoutPartnerInput[]
    upsert?: ProfitDistributionUpsertWithWhereUniqueWithoutPartnerInput | ProfitDistributionUpsertWithWhereUniqueWithoutPartnerInput[]
    createMany?: ProfitDistributionCreateManyPartnerInputEnvelope
    set?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    disconnect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    delete?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    connect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    update?: ProfitDistributionUpdateWithWhereUniqueWithoutPartnerInput | ProfitDistributionUpdateWithWhereUniqueWithoutPartnerInput[]
    updateMany?: ProfitDistributionUpdateManyWithWhereWithoutPartnerInput | ProfitDistributionUpdateManyWithWhereWithoutPartnerInput[]
    deleteMany?: ProfitDistributionScalarWhereInput | ProfitDistributionScalarWhereInput[]
  }

  export type TreasuryLedgerCreateNestedManyWithoutBankAccountInput = {
    create?: XOR<TreasuryLedgerCreateWithoutBankAccountInput, TreasuryLedgerUncheckedCreateWithoutBankAccountInput> | TreasuryLedgerCreateWithoutBankAccountInput[] | TreasuryLedgerUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: TreasuryLedgerCreateOrConnectWithoutBankAccountInput | TreasuryLedgerCreateOrConnectWithoutBankAccountInput[]
    createMany?: TreasuryLedgerCreateManyBankAccountInputEnvelope
    connect?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
  }

  export type ProjectExpenseCreateNestedManyWithoutBankAccountInput = {
    create?: XOR<ProjectExpenseCreateWithoutBankAccountInput, ProjectExpenseUncheckedCreateWithoutBankAccountInput> | ProjectExpenseCreateWithoutBankAccountInput[] | ProjectExpenseUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutBankAccountInput | ProjectExpenseCreateOrConnectWithoutBankAccountInput[]
    createMany?: ProjectExpenseCreateManyBankAccountInputEnvelope
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
  }

  export type CustomerPaymentCreateNestedManyWithoutBankAccountInput = {
    create?: XOR<CustomerPaymentCreateWithoutBankAccountInput, CustomerPaymentUncheckedCreateWithoutBankAccountInput> | CustomerPaymentCreateWithoutBankAccountInput[] | CustomerPaymentUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: CustomerPaymentCreateOrConnectWithoutBankAccountInput | CustomerPaymentCreateOrConnectWithoutBankAccountInput[]
    createMany?: CustomerPaymentCreateManyBankAccountInputEnvelope
    connect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
  }

  export type TreasuryLedgerUncheckedCreateNestedManyWithoutBankAccountInput = {
    create?: XOR<TreasuryLedgerCreateWithoutBankAccountInput, TreasuryLedgerUncheckedCreateWithoutBankAccountInput> | TreasuryLedgerCreateWithoutBankAccountInput[] | TreasuryLedgerUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: TreasuryLedgerCreateOrConnectWithoutBankAccountInput | TreasuryLedgerCreateOrConnectWithoutBankAccountInput[]
    createMany?: TreasuryLedgerCreateManyBankAccountInputEnvelope
    connect?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
  }

  export type ProjectExpenseUncheckedCreateNestedManyWithoutBankAccountInput = {
    create?: XOR<ProjectExpenseCreateWithoutBankAccountInput, ProjectExpenseUncheckedCreateWithoutBankAccountInput> | ProjectExpenseCreateWithoutBankAccountInput[] | ProjectExpenseUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutBankAccountInput | ProjectExpenseCreateOrConnectWithoutBankAccountInput[]
    createMany?: ProjectExpenseCreateManyBankAccountInputEnvelope
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
  }

  export type CustomerPaymentUncheckedCreateNestedManyWithoutBankAccountInput = {
    create?: XOR<CustomerPaymentCreateWithoutBankAccountInput, CustomerPaymentUncheckedCreateWithoutBankAccountInput> | CustomerPaymentCreateWithoutBankAccountInput[] | CustomerPaymentUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: CustomerPaymentCreateOrConnectWithoutBankAccountInput | CustomerPaymentCreateOrConnectWithoutBankAccountInput[]
    createMany?: CustomerPaymentCreateManyBankAccountInputEnvelope
    connect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TreasuryLedgerUpdateManyWithoutBankAccountNestedInput = {
    create?: XOR<TreasuryLedgerCreateWithoutBankAccountInput, TreasuryLedgerUncheckedCreateWithoutBankAccountInput> | TreasuryLedgerCreateWithoutBankAccountInput[] | TreasuryLedgerUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: TreasuryLedgerCreateOrConnectWithoutBankAccountInput | TreasuryLedgerCreateOrConnectWithoutBankAccountInput[]
    upsert?: TreasuryLedgerUpsertWithWhereUniqueWithoutBankAccountInput | TreasuryLedgerUpsertWithWhereUniqueWithoutBankAccountInput[]
    createMany?: TreasuryLedgerCreateManyBankAccountInputEnvelope
    set?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
    disconnect?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
    delete?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
    connect?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
    update?: TreasuryLedgerUpdateWithWhereUniqueWithoutBankAccountInput | TreasuryLedgerUpdateWithWhereUniqueWithoutBankAccountInput[]
    updateMany?: TreasuryLedgerUpdateManyWithWhereWithoutBankAccountInput | TreasuryLedgerUpdateManyWithWhereWithoutBankAccountInput[]
    deleteMany?: TreasuryLedgerScalarWhereInput | TreasuryLedgerScalarWhereInput[]
  }

  export type ProjectExpenseUpdateManyWithoutBankAccountNestedInput = {
    create?: XOR<ProjectExpenseCreateWithoutBankAccountInput, ProjectExpenseUncheckedCreateWithoutBankAccountInput> | ProjectExpenseCreateWithoutBankAccountInput[] | ProjectExpenseUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutBankAccountInput | ProjectExpenseCreateOrConnectWithoutBankAccountInput[]
    upsert?: ProjectExpenseUpsertWithWhereUniqueWithoutBankAccountInput | ProjectExpenseUpsertWithWhereUniqueWithoutBankAccountInput[]
    createMany?: ProjectExpenseCreateManyBankAccountInputEnvelope
    set?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    disconnect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    delete?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    update?: ProjectExpenseUpdateWithWhereUniqueWithoutBankAccountInput | ProjectExpenseUpdateWithWhereUniqueWithoutBankAccountInput[]
    updateMany?: ProjectExpenseUpdateManyWithWhereWithoutBankAccountInput | ProjectExpenseUpdateManyWithWhereWithoutBankAccountInput[]
    deleteMany?: ProjectExpenseScalarWhereInput | ProjectExpenseScalarWhereInput[]
  }

  export type CustomerPaymentUpdateManyWithoutBankAccountNestedInput = {
    create?: XOR<CustomerPaymentCreateWithoutBankAccountInput, CustomerPaymentUncheckedCreateWithoutBankAccountInput> | CustomerPaymentCreateWithoutBankAccountInput[] | CustomerPaymentUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: CustomerPaymentCreateOrConnectWithoutBankAccountInput | CustomerPaymentCreateOrConnectWithoutBankAccountInput[]
    upsert?: CustomerPaymentUpsertWithWhereUniqueWithoutBankAccountInput | CustomerPaymentUpsertWithWhereUniqueWithoutBankAccountInput[]
    createMany?: CustomerPaymentCreateManyBankAccountInputEnvelope
    set?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    disconnect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    delete?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    connect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    update?: CustomerPaymentUpdateWithWhereUniqueWithoutBankAccountInput | CustomerPaymentUpdateWithWhereUniqueWithoutBankAccountInput[]
    updateMany?: CustomerPaymentUpdateManyWithWhereWithoutBankAccountInput | CustomerPaymentUpdateManyWithWhereWithoutBankAccountInput[]
    deleteMany?: CustomerPaymentScalarWhereInput | CustomerPaymentScalarWhereInput[]
  }

  export type TreasuryLedgerUncheckedUpdateManyWithoutBankAccountNestedInput = {
    create?: XOR<TreasuryLedgerCreateWithoutBankAccountInput, TreasuryLedgerUncheckedCreateWithoutBankAccountInput> | TreasuryLedgerCreateWithoutBankAccountInput[] | TreasuryLedgerUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: TreasuryLedgerCreateOrConnectWithoutBankAccountInput | TreasuryLedgerCreateOrConnectWithoutBankAccountInput[]
    upsert?: TreasuryLedgerUpsertWithWhereUniqueWithoutBankAccountInput | TreasuryLedgerUpsertWithWhereUniqueWithoutBankAccountInput[]
    createMany?: TreasuryLedgerCreateManyBankAccountInputEnvelope
    set?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
    disconnect?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
    delete?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
    connect?: TreasuryLedgerWhereUniqueInput | TreasuryLedgerWhereUniqueInput[]
    update?: TreasuryLedgerUpdateWithWhereUniqueWithoutBankAccountInput | TreasuryLedgerUpdateWithWhereUniqueWithoutBankAccountInput[]
    updateMany?: TreasuryLedgerUpdateManyWithWhereWithoutBankAccountInput | TreasuryLedgerUpdateManyWithWhereWithoutBankAccountInput[]
    deleteMany?: TreasuryLedgerScalarWhereInput | TreasuryLedgerScalarWhereInput[]
  }

  export type ProjectExpenseUncheckedUpdateManyWithoutBankAccountNestedInput = {
    create?: XOR<ProjectExpenseCreateWithoutBankAccountInput, ProjectExpenseUncheckedCreateWithoutBankAccountInput> | ProjectExpenseCreateWithoutBankAccountInput[] | ProjectExpenseUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutBankAccountInput | ProjectExpenseCreateOrConnectWithoutBankAccountInput[]
    upsert?: ProjectExpenseUpsertWithWhereUniqueWithoutBankAccountInput | ProjectExpenseUpsertWithWhereUniqueWithoutBankAccountInput[]
    createMany?: ProjectExpenseCreateManyBankAccountInputEnvelope
    set?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    disconnect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    delete?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    update?: ProjectExpenseUpdateWithWhereUniqueWithoutBankAccountInput | ProjectExpenseUpdateWithWhereUniqueWithoutBankAccountInput[]
    updateMany?: ProjectExpenseUpdateManyWithWhereWithoutBankAccountInput | ProjectExpenseUpdateManyWithWhereWithoutBankAccountInput[]
    deleteMany?: ProjectExpenseScalarWhereInput | ProjectExpenseScalarWhereInput[]
  }

  export type CustomerPaymentUncheckedUpdateManyWithoutBankAccountNestedInput = {
    create?: XOR<CustomerPaymentCreateWithoutBankAccountInput, CustomerPaymentUncheckedCreateWithoutBankAccountInput> | CustomerPaymentCreateWithoutBankAccountInput[] | CustomerPaymentUncheckedCreateWithoutBankAccountInput[]
    connectOrCreate?: CustomerPaymentCreateOrConnectWithoutBankAccountInput | CustomerPaymentCreateOrConnectWithoutBankAccountInput[]
    upsert?: CustomerPaymentUpsertWithWhereUniqueWithoutBankAccountInput | CustomerPaymentUpsertWithWhereUniqueWithoutBankAccountInput[]
    createMany?: CustomerPaymentCreateManyBankAccountInputEnvelope
    set?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    disconnect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    delete?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    connect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    update?: CustomerPaymentUpdateWithWhereUniqueWithoutBankAccountInput | CustomerPaymentUpdateWithWhereUniqueWithoutBankAccountInput[]
    updateMany?: CustomerPaymentUpdateManyWithWhereWithoutBankAccountInput | CustomerPaymentUpdateManyWithWhereWithoutBankAccountInput[]
    deleteMany?: CustomerPaymentScalarWhereInput | CustomerPaymentScalarWhereInput[]
  }

  export type ProjectPartnerCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectPartnerCreateWithoutProjectInput, ProjectPartnerUncheckedCreateWithoutProjectInput> | ProjectPartnerCreateWithoutProjectInput[] | ProjectPartnerUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectPartnerCreateOrConnectWithoutProjectInput | ProjectPartnerCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectPartnerCreateManyProjectInputEnvelope
    connect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
  }

  export type ProjectExpenseCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectExpenseCreateWithoutProjectInput, ProjectExpenseUncheckedCreateWithoutProjectInput> | ProjectExpenseCreateWithoutProjectInput[] | ProjectExpenseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutProjectInput | ProjectExpenseCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectExpenseCreateManyProjectInputEnvelope
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
  }

  export type ProjectPlotCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectPlotCreateWithoutProjectInput, ProjectPlotUncheckedCreateWithoutProjectInput> | ProjectPlotCreateWithoutProjectInput[] | ProjectPlotUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectPlotCreateOrConnectWithoutProjectInput | ProjectPlotCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectPlotCreateManyProjectInputEnvelope
    connect?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
  }

  export type LandSaleCreateNestedManyWithoutProjectInput = {
    create?: XOR<LandSaleCreateWithoutProjectInput, LandSaleUncheckedCreateWithoutProjectInput> | LandSaleCreateWithoutProjectInput[] | LandSaleUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: LandSaleCreateOrConnectWithoutProjectInput | LandSaleCreateOrConnectWithoutProjectInput[]
    createMany?: LandSaleCreateManyProjectInputEnvelope
    connect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
  }

  export type ProfitDistributionCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProfitDistributionCreateWithoutProjectInput, ProfitDistributionUncheckedCreateWithoutProjectInput> | ProfitDistributionCreateWithoutProjectInput[] | ProfitDistributionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProfitDistributionCreateOrConnectWithoutProjectInput | ProfitDistributionCreateOrConnectWithoutProjectInput[]
    createMany?: ProfitDistributionCreateManyProjectInputEnvelope
    connect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
  }

  export type ProjectPartnerUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectPartnerCreateWithoutProjectInput, ProjectPartnerUncheckedCreateWithoutProjectInput> | ProjectPartnerCreateWithoutProjectInput[] | ProjectPartnerUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectPartnerCreateOrConnectWithoutProjectInput | ProjectPartnerCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectPartnerCreateManyProjectInputEnvelope
    connect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
  }

  export type ProjectExpenseUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectExpenseCreateWithoutProjectInput, ProjectExpenseUncheckedCreateWithoutProjectInput> | ProjectExpenseCreateWithoutProjectInput[] | ProjectExpenseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutProjectInput | ProjectExpenseCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectExpenseCreateManyProjectInputEnvelope
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
  }

  export type ProjectPlotUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProjectPlotCreateWithoutProjectInput, ProjectPlotUncheckedCreateWithoutProjectInput> | ProjectPlotCreateWithoutProjectInput[] | ProjectPlotUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectPlotCreateOrConnectWithoutProjectInput | ProjectPlotCreateOrConnectWithoutProjectInput[]
    createMany?: ProjectPlotCreateManyProjectInputEnvelope
    connect?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
  }

  export type LandSaleUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<LandSaleCreateWithoutProjectInput, LandSaleUncheckedCreateWithoutProjectInput> | LandSaleCreateWithoutProjectInput[] | LandSaleUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: LandSaleCreateOrConnectWithoutProjectInput | LandSaleCreateOrConnectWithoutProjectInput[]
    createMany?: LandSaleCreateManyProjectInputEnvelope
    connect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
  }

  export type ProfitDistributionUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<ProfitDistributionCreateWithoutProjectInput, ProfitDistributionUncheckedCreateWithoutProjectInput> | ProfitDistributionCreateWithoutProjectInput[] | ProfitDistributionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProfitDistributionCreateOrConnectWithoutProjectInput | ProfitDistributionCreateOrConnectWithoutProjectInput[]
    createMany?: ProfitDistributionCreateManyProjectInputEnvelope
    connect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
  }

  export type ProjectPartnerUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectPartnerCreateWithoutProjectInput, ProjectPartnerUncheckedCreateWithoutProjectInput> | ProjectPartnerCreateWithoutProjectInput[] | ProjectPartnerUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectPartnerCreateOrConnectWithoutProjectInput | ProjectPartnerCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectPartnerUpsertWithWhereUniqueWithoutProjectInput | ProjectPartnerUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectPartnerCreateManyProjectInputEnvelope
    set?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    disconnect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    delete?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    connect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    update?: ProjectPartnerUpdateWithWhereUniqueWithoutProjectInput | ProjectPartnerUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectPartnerUpdateManyWithWhereWithoutProjectInput | ProjectPartnerUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectPartnerScalarWhereInput | ProjectPartnerScalarWhereInput[]
  }

  export type ProjectExpenseUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectExpenseCreateWithoutProjectInput, ProjectExpenseUncheckedCreateWithoutProjectInput> | ProjectExpenseCreateWithoutProjectInput[] | ProjectExpenseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutProjectInput | ProjectExpenseCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectExpenseUpsertWithWhereUniqueWithoutProjectInput | ProjectExpenseUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectExpenseCreateManyProjectInputEnvelope
    set?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    disconnect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    delete?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    update?: ProjectExpenseUpdateWithWhereUniqueWithoutProjectInput | ProjectExpenseUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectExpenseUpdateManyWithWhereWithoutProjectInput | ProjectExpenseUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectExpenseScalarWhereInput | ProjectExpenseScalarWhereInput[]
  }

  export type ProjectPlotUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectPlotCreateWithoutProjectInput, ProjectPlotUncheckedCreateWithoutProjectInput> | ProjectPlotCreateWithoutProjectInput[] | ProjectPlotUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectPlotCreateOrConnectWithoutProjectInput | ProjectPlotCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectPlotUpsertWithWhereUniqueWithoutProjectInput | ProjectPlotUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectPlotCreateManyProjectInputEnvelope
    set?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
    disconnect?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
    delete?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
    connect?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
    update?: ProjectPlotUpdateWithWhereUniqueWithoutProjectInput | ProjectPlotUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectPlotUpdateManyWithWhereWithoutProjectInput | ProjectPlotUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectPlotScalarWhereInput | ProjectPlotScalarWhereInput[]
  }

  export type LandSaleUpdateManyWithoutProjectNestedInput = {
    create?: XOR<LandSaleCreateWithoutProjectInput, LandSaleUncheckedCreateWithoutProjectInput> | LandSaleCreateWithoutProjectInput[] | LandSaleUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: LandSaleCreateOrConnectWithoutProjectInput | LandSaleCreateOrConnectWithoutProjectInput[]
    upsert?: LandSaleUpsertWithWhereUniqueWithoutProjectInput | LandSaleUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: LandSaleCreateManyProjectInputEnvelope
    set?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    disconnect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    delete?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    connect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    update?: LandSaleUpdateWithWhereUniqueWithoutProjectInput | LandSaleUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: LandSaleUpdateManyWithWhereWithoutProjectInput | LandSaleUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: LandSaleScalarWhereInput | LandSaleScalarWhereInput[]
  }

  export type ProfitDistributionUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProfitDistributionCreateWithoutProjectInput, ProfitDistributionUncheckedCreateWithoutProjectInput> | ProfitDistributionCreateWithoutProjectInput[] | ProfitDistributionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProfitDistributionCreateOrConnectWithoutProjectInput | ProfitDistributionCreateOrConnectWithoutProjectInput[]
    upsert?: ProfitDistributionUpsertWithWhereUniqueWithoutProjectInput | ProfitDistributionUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProfitDistributionCreateManyProjectInputEnvelope
    set?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    disconnect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    delete?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    connect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    update?: ProfitDistributionUpdateWithWhereUniqueWithoutProjectInput | ProfitDistributionUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProfitDistributionUpdateManyWithWhereWithoutProjectInput | ProfitDistributionUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProfitDistributionScalarWhereInput | ProfitDistributionScalarWhereInput[]
  }

  export type ProjectPartnerUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectPartnerCreateWithoutProjectInput, ProjectPartnerUncheckedCreateWithoutProjectInput> | ProjectPartnerCreateWithoutProjectInput[] | ProjectPartnerUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectPartnerCreateOrConnectWithoutProjectInput | ProjectPartnerCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectPartnerUpsertWithWhereUniqueWithoutProjectInput | ProjectPartnerUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectPartnerCreateManyProjectInputEnvelope
    set?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    disconnect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    delete?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    connect?: ProjectPartnerWhereUniqueInput | ProjectPartnerWhereUniqueInput[]
    update?: ProjectPartnerUpdateWithWhereUniqueWithoutProjectInput | ProjectPartnerUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectPartnerUpdateManyWithWhereWithoutProjectInput | ProjectPartnerUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectPartnerScalarWhereInput | ProjectPartnerScalarWhereInput[]
  }

  export type ProjectExpenseUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectExpenseCreateWithoutProjectInput, ProjectExpenseUncheckedCreateWithoutProjectInput> | ProjectExpenseCreateWithoutProjectInput[] | ProjectExpenseUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectExpenseCreateOrConnectWithoutProjectInput | ProjectExpenseCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectExpenseUpsertWithWhereUniqueWithoutProjectInput | ProjectExpenseUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectExpenseCreateManyProjectInputEnvelope
    set?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    disconnect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    delete?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    connect?: ProjectExpenseWhereUniqueInput | ProjectExpenseWhereUniqueInput[]
    update?: ProjectExpenseUpdateWithWhereUniqueWithoutProjectInput | ProjectExpenseUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectExpenseUpdateManyWithWhereWithoutProjectInput | ProjectExpenseUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectExpenseScalarWhereInput | ProjectExpenseScalarWhereInput[]
  }

  export type ProjectPlotUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProjectPlotCreateWithoutProjectInput, ProjectPlotUncheckedCreateWithoutProjectInput> | ProjectPlotCreateWithoutProjectInput[] | ProjectPlotUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProjectPlotCreateOrConnectWithoutProjectInput | ProjectPlotCreateOrConnectWithoutProjectInput[]
    upsert?: ProjectPlotUpsertWithWhereUniqueWithoutProjectInput | ProjectPlotUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProjectPlotCreateManyProjectInputEnvelope
    set?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
    disconnect?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
    delete?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
    connect?: ProjectPlotWhereUniqueInput | ProjectPlotWhereUniqueInput[]
    update?: ProjectPlotUpdateWithWhereUniqueWithoutProjectInput | ProjectPlotUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProjectPlotUpdateManyWithWhereWithoutProjectInput | ProjectPlotUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProjectPlotScalarWhereInput | ProjectPlotScalarWhereInput[]
  }

  export type LandSaleUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<LandSaleCreateWithoutProjectInput, LandSaleUncheckedCreateWithoutProjectInput> | LandSaleCreateWithoutProjectInput[] | LandSaleUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: LandSaleCreateOrConnectWithoutProjectInput | LandSaleCreateOrConnectWithoutProjectInput[]
    upsert?: LandSaleUpsertWithWhereUniqueWithoutProjectInput | LandSaleUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: LandSaleCreateManyProjectInputEnvelope
    set?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    disconnect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    delete?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    connect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    update?: LandSaleUpdateWithWhereUniqueWithoutProjectInput | LandSaleUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: LandSaleUpdateManyWithWhereWithoutProjectInput | LandSaleUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: LandSaleScalarWhereInput | LandSaleScalarWhereInput[]
  }

  export type ProfitDistributionUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<ProfitDistributionCreateWithoutProjectInput, ProfitDistributionUncheckedCreateWithoutProjectInput> | ProfitDistributionCreateWithoutProjectInput[] | ProfitDistributionUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: ProfitDistributionCreateOrConnectWithoutProjectInput | ProfitDistributionCreateOrConnectWithoutProjectInput[]
    upsert?: ProfitDistributionUpsertWithWhereUniqueWithoutProjectInput | ProfitDistributionUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: ProfitDistributionCreateManyProjectInputEnvelope
    set?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    disconnect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    delete?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    connect?: ProfitDistributionWhereUniqueInput | ProfitDistributionWhereUniqueInput[]
    update?: ProfitDistributionUpdateWithWhereUniqueWithoutProjectInput | ProfitDistributionUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: ProfitDistributionUpdateManyWithWhereWithoutProjectInput | ProfitDistributionUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: ProfitDistributionScalarWhereInput | ProfitDistributionScalarWhereInput[]
  }

  export type LandProjectCreateNestedOneWithoutProjectPartnersInput = {
    create?: XOR<LandProjectCreateWithoutProjectPartnersInput, LandProjectUncheckedCreateWithoutProjectPartnersInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutProjectPartnersInput
    connect?: LandProjectWhereUniqueInput
  }

  export type PartnerCreateNestedOneWithoutProjectPartnersInput = {
    create?: XOR<PartnerCreateWithoutProjectPartnersInput, PartnerUncheckedCreateWithoutProjectPartnersInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutProjectPartnersInput
    connect?: PartnerWhereUniqueInput
  }

  export type LandProjectUpdateOneRequiredWithoutProjectPartnersNestedInput = {
    create?: XOR<LandProjectCreateWithoutProjectPartnersInput, LandProjectUncheckedCreateWithoutProjectPartnersInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutProjectPartnersInput
    upsert?: LandProjectUpsertWithoutProjectPartnersInput
    connect?: LandProjectWhereUniqueInput
    update?: XOR<XOR<LandProjectUpdateToOneWithWhereWithoutProjectPartnersInput, LandProjectUpdateWithoutProjectPartnersInput>, LandProjectUncheckedUpdateWithoutProjectPartnersInput>
  }

  export type PartnerUpdateOneRequiredWithoutProjectPartnersNestedInput = {
    create?: XOR<PartnerCreateWithoutProjectPartnersInput, PartnerUncheckedCreateWithoutProjectPartnersInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutProjectPartnersInput
    upsert?: PartnerUpsertWithoutProjectPartnersInput
    connect?: PartnerWhereUniqueInput
    update?: XOR<XOR<PartnerUpdateToOneWithWhereWithoutProjectPartnersInput, PartnerUpdateWithoutProjectPartnersInput>, PartnerUncheckedUpdateWithoutProjectPartnersInput>
  }

  export type BankAccountCreateNestedOneWithoutTreasuryLedgersInput = {
    create?: XOR<BankAccountCreateWithoutTreasuryLedgersInput, BankAccountUncheckedCreateWithoutTreasuryLedgersInput>
    connectOrCreate?: BankAccountCreateOrConnectWithoutTreasuryLedgersInput
    connect?: BankAccountWhereUniqueInput
  }

  export type BankAccountUpdateOneWithoutTreasuryLedgersNestedInput = {
    create?: XOR<BankAccountCreateWithoutTreasuryLedgersInput, BankAccountUncheckedCreateWithoutTreasuryLedgersInput>
    connectOrCreate?: BankAccountCreateOrConnectWithoutTreasuryLedgersInput
    upsert?: BankAccountUpsertWithoutTreasuryLedgersInput
    disconnect?: BankAccountWhereInput | boolean
    delete?: BankAccountWhereInput | boolean
    connect?: BankAccountWhereUniqueInput
    update?: XOR<XOR<BankAccountUpdateToOneWithWhereWithoutTreasuryLedgersInput, BankAccountUpdateWithoutTreasuryLedgersInput>, BankAccountUncheckedUpdateWithoutTreasuryLedgersInput>
  }

  export type PartnerCreateNestedOneWithoutPartnerTransactionsInput = {
    create?: XOR<PartnerCreateWithoutPartnerTransactionsInput, PartnerUncheckedCreateWithoutPartnerTransactionsInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutPartnerTransactionsInput
    connect?: PartnerWhereUniqueInput
  }

  export type PartnerUpdateOneRequiredWithoutPartnerTransactionsNestedInput = {
    create?: XOR<PartnerCreateWithoutPartnerTransactionsInput, PartnerUncheckedCreateWithoutPartnerTransactionsInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutPartnerTransactionsInput
    upsert?: PartnerUpsertWithoutPartnerTransactionsInput
    connect?: PartnerWhereUniqueInput
    update?: XOR<XOR<PartnerUpdateToOneWithWhereWithoutPartnerTransactionsInput, PartnerUpdateWithoutPartnerTransactionsInput>, PartnerUncheckedUpdateWithoutPartnerTransactionsInput>
  }

  export type LandProjectCreateNestedOneWithoutProjectExpensesInput = {
    create?: XOR<LandProjectCreateWithoutProjectExpensesInput, LandProjectUncheckedCreateWithoutProjectExpensesInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutProjectExpensesInput
    connect?: LandProjectWhereUniqueInput
  }

  export type BankAccountCreateNestedOneWithoutExpensesInput = {
    create?: XOR<BankAccountCreateWithoutExpensesInput, BankAccountUncheckedCreateWithoutExpensesInput>
    connectOrCreate?: BankAccountCreateOrConnectWithoutExpensesInput
    connect?: BankAccountWhereUniqueInput
  }

  export type PartnerCreateNestedOneWithoutPaidExpensesInput = {
    create?: XOR<PartnerCreateWithoutPaidExpensesInput, PartnerUncheckedCreateWithoutPaidExpensesInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutPaidExpensesInput
    connect?: PartnerWhereUniqueInput
  }

  export type LandProjectUpdateOneWithoutProjectExpensesNestedInput = {
    create?: XOR<LandProjectCreateWithoutProjectExpensesInput, LandProjectUncheckedCreateWithoutProjectExpensesInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutProjectExpensesInput
    upsert?: LandProjectUpsertWithoutProjectExpensesInput
    disconnect?: LandProjectWhereInput | boolean
    delete?: LandProjectWhereInput | boolean
    connect?: LandProjectWhereUniqueInput
    update?: XOR<XOR<LandProjectUpdateToOneWithWhereWithoutProjectExpensesInput, LandProjectUpdateWithoutProjectExpensesInput>, LandProjectUncheckedUpdateWithoutProjectExpensesInput>
  }

  export type BankAccountUpdateOneWithoutExpensesNestedInput = {
    create?: XOR<BankAccountCreateWithoutExpensesInput, BankAccountUncheckedCreateWithoutExpensesInput>
    connectOrCreate?: BankAccountCreateOrConnectWithoutExpensesInput
    upsert?: BankAccountUpsertWithoutExpensesInput
    disconnect?: BankAccountWhereInput | boolean
    delete?: BankAccountWhereInput | boolean
    connect?: BankAccountWhereUniqueInput
    update?: XOR<XOR<BankAccountUpdateToOneWithWhereWithoutExpensesInput, BankAccountUpdateWithoutExpensesInput>, BankAccountUncheckedUpdateWithoutExpensesInput>
  }

  export type PartnerUpdateOneWithoutPaidExpensesNestedInput = {
    create?: XOR<PartnerCreateWithoutPaidExpensesInput, PartnerUncheckedCreateWithoutPaidExpensesInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutPaidExpensesInput
    upsert?: PartnerUpsertWithoutPaidExpensesInput
    disconnect?: PartnerWhereInput | boolean
    delete?: PartnerWhereInput | boolean
    connect?: PartnerWhereUniqueInput
    update?: XOR<XOR<PartnerUpdateToOneWithWhereWithoutPaidExpensesInput, PartnerUpdateWithoutPaidExpensesInput>, PartnerUncheckedUpdateWithoutPaidExpensesInput>
  }

  export type LandProjectCreateNestedOneWithoutProjectPlotsInput = {
    create?: XOR<LandProjectCreateWithoutProjectPlotsInput, LandProjectUncheckedCreateWithoutProjectPlotsInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutProjectPlotsInput
    connect?: LandProjectWhereUniqueInput
  }

  export type LandSaleCreateNestedManyWithoutPlotInput = {
    create?: XOR<LandSaleCreateWithoutPlotInput, LandSaleUncheckedCreateWithoutPlotInput> | LandSaleCreateWithoutPlotInput[] | LandSaleUncheckedCreateWithoutPlotInput[]
    connectOrCreate?: LandSaleCreateOrConnectWithoutPlotInput | LandSaleCreateOrConnectWithoutPlotInput[]
    createMany?: LandSaleCreateManyPlotInputEnvelope
    connect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
  }

  export type LandSaleUncheckedCreateNestedManyWithoutPlotInput = {
    create?: XOR<LandSaleCreateWithoutPlotInput, LandSaleUncheckedCreateWithoutPlotInput> | LandSaleCreateWithoutPlotInput[] | LandSaleUncheckedCreateWithoutPlotInput[]
    connectOrCreate?: LandSaleCreateOrConnectWithoutPlotInput | LandSaleCreateOrConnectWithoutPlotInput[]
    createMany?: LandSaleCreateManyPlotInputEnvelope
    connect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
  }

  export type LandProjectUpdateOneRequiredWithoutProjectPlotsNestedInput = {
    create?: XOR<LandProjectCreateWithoutProjectPlotsInput, LandProjectUncheckedCreateWithoutProjectPlotsInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutProjectPlotsInput
    upsert?: LandProjectUpsertWithoutProjectPlotsInput
    connect?: LandProjectWhereUniqueInput
    update?: XOR<XOR<LandProjectUpdateToOneWithWhereWithoutProjectPlotsInput, LandProjectUpdateWithoutProjectPlotsInput>, LandProjectUncheckedUpdateWithoutProjectPlotsInput>
  }

  export type LandSaleUpdateManyWithoutPlotNestedInput = {
    create?: XOR<LandSaleCreateWithoutPlotInput, LandSaleUncheckedCreateWithoutPlotInput> | LandSaleCreateWithoutPlotInput[] | LandSaleUncheckedCreateWithoutPlotInput[]
    connectOrCreate?: LandSaleCreateOrConnectWithoutPlotInput | LandSaleCreateOrConnectWithoutPlotInput[]
    upsert?: LandSaleUpsertWithWhereUniqueWithoutPlotInput | LandSaleUpsertWithWhereUniqueWithoutPlotInput[]
    createMany?: LandSaleCreateManyPlotInputEnvelope
    set?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    disconnect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    delete?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    connect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    update?: LandSaleUpdateWithWhereUniqueWithoutPlotInput | LandSaleUpdateWithWhereUniqueWithoutPlotInput[]
    updateMany?: LandSaleUpdateManyWithWhereWithoutPlotInput | LandSaleUpdateManyWithWhereWithoutPlotInput[]
    deleteMany?: LandSaleScalarWhereInput | LandSaleScalarWhereInput[]
  }

  export type LandSaleUncheckedUpdateManyWithoutPlotNestedInput = {
    create?: XOR<LandSaleCreateWithoutPlotInput, LandSaleUncheckedCreateWithoutPlotInput> | LandSaleCreateWithoutPlotInput[] | LandSaleUncheckedCreateWithoutPlotInput[]
    connectOrCreate?: LandSaleCreateOrConnectWithoutPlotInput | LandSaleCreateOrConnectWithoutPlotInput[]
    upsert?: LandSaleUpsertWithWhereUniqueWithoutPlotInput | LandSaleUpsertWithWhereUniqueWithoutPlotInput[]
    createMany?: LandSaleCreateManyPlotInputEnvelope
    set?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    disconnect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    delete?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    connect?: LandSaleWhereUniqueInput | LandSaleWhereUniqueInput[]
    update?: LandSaleUpdateWithWhereUniqueWithoutPlotInput | LandSaleUpdateWithWhereUniqueWithoutPlotInput[]
    updateMany?: LandSaleUpdateManyWithWhereWithoutPlotInput | LandSaleUpdateManyWithWhereWithoutPlotInput[]
    deleteMany?: LandSaleScalarWhereInput | LandSaleScalarWhereInput[]
  }

  export type LandProjectCreateNestedOneWithoutLandSalesInput = {
    create?: XOR<LandProjectCreateWithoutLandSalesInput, LandProjectUncheckedCreateWithoutLandSalesInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutLandSalesInput
    connect?: LandProjectWhereUniqueInput
  }

  export type ProjectPlotCreateNestedOneWithoutLandSalesInput = {
    create?: XOR<ProjectPlotCreateWithoutLandSalesInput, ProjectPlotUncheckedCreateWithoutLandSalesInput>
    connectOrCreate?: ProjectPlotCreateOrConnectWithoutLandSalesInput
    connect?: ProjectPlotWhereUniqueInput
  }

  export type InstallmentScheduleCreateNestedManyWithoutSaleInput = {
    create?: XOR<InstallmentScheduleCreateWithoutSaleInput, InstallmentScheduleUncheckedCreateWithoutSaleInput> | InstallmentScheduleCreateWithoutSaleInput[] | InstallmentScheduleUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: InstallmentScheduleCreateOrConnectWithoutSaleInput | InstallmentScheduleCreateOrConnectWithoutSaleInput[]
    createMany?: InstallmentScheduleCreateManySaleInputEnvelope
    connect?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
  }

  export type CustomerPaymentCreateNestedManyWithoutSaleInput = {
    create?: XOR<CustomerPaymentCreateWithoutSaleInput, CustomerPaymentUncheckedCreateWithoutSaleInput> | CustomerPaymentCreateWithoutSaleInput[] | CustomerPaymentUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: CustomerPaymentCreateOrConnectWithoutSaleInput | CustomerPaymentCreateOrConnectWithoutSaleInput[]
    createMany?: CustomerPaymentCreateManySaleInputEnvelope
    connect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
  }

  export type InstallmentScheduleUncheckedCreateNestedManyWithoutSaleInput = {
    create?: XOR<InstallmentScheduleCreateWithoutSaleInput, InstallmentScheduleUncheckedCreateWithoutSaleInput> | InstallmentScheduleCreateWithoutSaleInput[] | InstallmentScheduleUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: InstallmentScheduleCreateOrConnectWithoutSaleInput | InstallmentScheduleCreateOrConnectWithoutSaleInput[]
    createMany?: InstallmentScheduleCreateManySaleInputEnvelope
    connect?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
  }

  export type CustomerPaymentUncheckedCreateNestedManyWithoutSaleInput = {
    create?: XOR<CustomerPaymentCreateWithoutSaleInput, CustomerPaymentUncheckedCreateWithoutSaleInput> | CustomerPaymentCreateWithoutSaleInput[] | CustomerPaymentUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: CustomerPaymentCreateOrConnectWithoutSaleInput | CustomerPaymentCreateOrConnectWithoutSaleInput[]
    createMany?: CustomerPaymentCreateManySaleInputEnvelope
    connect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
  }

  export type LandProjectUpdateOneRequiredWithoutLandSalesNestedInput = {
    create?: XOR<LandProjectCreateWithoutLandSalesInput, LandProjectUncheckedCreateWithoutLandSalesInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutLandSalesInput
    upsert?: LandProjectUpsertWithoutLandSalesInput
    connect?: LandProjectWhereUniqueInput
    update?: XOR<XOR<LandProjectUpdateToOneWithWhereWithoutLandSalesInput, LandProjectUpdateWithoutLandSalesInput>, LandProjectUncheckedUpdateWithoutLandSalesInput>
  }

  export type ProjectPlotUpdateOneWithoutLandSalesNestedInput = {
    create?: XOR<ProjectPlotCreateWithoutLandSalesInput, ProjectPlotUncheckedCreateWithoutLandSalesInput>
    connectOrCreate?: ProjectPlotCreateOrConnectWithoutLandSalesInput
    upsert?: ProjectPlotUpsertWithoutLandSalesInput
    disconnect?: ProjectPlotWhereInput | boolean
    delete?: ProjectPlotWhereInput | boolean
    connect?: ProjectPlotWhereUniqueInput
    update?: XOR<XOR<ProjectPlotUpdateToOneWithWhereWithoutLandSalesInput, ProjectPlotUpdateWithoutLandSalesInput>, ProjectPlotUncheckedUpdateWithoutLandSalesInput>
  }

  export type InstallmentScheduleUpdateManyWithoutSaleNestedInput = {
    create?: XOR<InstallmentScheduleCreateWithoutSaleInput, InstallmentScheduleUncheckedCreateWithoutSaleInput> | InstallmentScheduleCreateWithoutSaleInput[] | InstallmentScheduleUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: InstallmentScheduleCreateOrConnectWithoutSaleInput | InstallmentScheduleCreateOrConnectWithoutSaleInput[]
    upsert?: InstallmentScheduleUpsertWithWhereUniqueWithoutSaleInput | InstallmentScheduleUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: InstallmentScheduleCreateManySaleInputEnvelope
    set?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
    disconnect?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
    delete?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
    connect?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
    update?: InstallmentScheduleUpdateWithWhereUniqueWithoutSaleInput | InstallmentScheduleUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: InstallmentScheduleUpdateManyWithWhereWithoutSaleInput | InstallmentScheduleUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: InstallmentScheduleScalarWhereInput | InstallmentScheduleScalarWhereInput[]
  }

  export type CustomerPaymentUpdateManyWithoutSaleNestedInput = {
    create?: XOR<CustomerPaymentCreateWithoutSaleInput, CustomerPaymentUncheckedCreateWithoutSaleInput> | CustomerPaymentCreateWithoutSaleInput[] | CustomerPaymentUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: CustomerPaymentCreateOrConnectWithoutSaleInput | CustomerPaymentCreateOrConnectWithoutSaleInput[]
    upsert?: CustomerPaymentUpsertWithWhereUniqueWithoutSaleInput | CustomerPaymentUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: CustomerPaymentCreateManySaleInputEnvelope
    set?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    disconnect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    delete?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    connect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    update?: CustomerPaymentUpdateWithWhereUniqueWithoutSaleInput | CustomerPaymentUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: CustomerPaymentUpdateManyWithWhereWithoutSaleInput | CustomerPaymentUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: CustomerPaymentScalarWhereInput | CustomerPaymentScalarWhereInput[]
  }

  export type InstallmentScheduleUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: XOR<InstallmentScheduleCreateWithoutSaleInput, InstallmentScheduleUncheckedCreateWithoutSaleInput> | InstallmentScheduleCreateWithoutSaleInput[] | InstallmentScheduleUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: InstallmentScheduleCreateOrConnectWithoutSaleInput | InstallmentScheduleCreateOrConnectWithoutSaleInput[]
    upsert?: InstallmentScheduleUpsertWithWhereUniqueWithoutSaleInput | InstallmentScheduleUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: InstallmentScheduleCreateManySaleInputEnvelope
    set?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
    disconnect?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
    delete?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
    connect?: InstallmentScheduleWhereUniqueInput | InstallmentScheduleWhereUniqueInput[]
    update?: InstallmentScheduleUpdateWithWhereUniqueWithoutSaleInput | InstallmentScheduleUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: InstallmentScheduleUpdateManyWithWhereWithoutSaleInput | InstallmentScheduleUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: InstallmentScheduleScalarWhereInput | InstallmentScheduleScalarWhereInput[]
  }

  export type CustomerPaymentUncheckedUpdateManyWithoutSaleNestedInput = {
    create?: XOR<CustomerPaymentCreateWithoutSaleInput, CustomerPaymentUncheckedCreateWithoutSaleInput> | CustomerPaymentCreateWithoutSaleInput[] | CustomerPaymentUncheckedCreateWithoutSaleInput[]
    connectOrCreate?: CustomerPaymentCreateOrConnectWithoutSaleInput | CustomerPaymentCreateOrConnectWithoutSaleInput[]
    upsert?: CustomerPaymentUpsertWithWhereUniqueWithoutSaleInput | CustomerPaymentUpsertWithWhereUniqueWithoutSaleInput[]
    createMany?: CustomerPaymentCreateManySaleInputEnvelope
    set?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    disconnect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    delete?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    connect?: CustomerPaymentWhereUniqueInput | CustomerPaymentWhereUniqueInput[]
    update?: CustomerPaymentUpdateWithWhereUniqueWithoutSaleInput | CustomerPaymentUpdateWithWhereUniqueWithoutSaleInput[]
    updateMany?: CustomerPaymentUpdateManyWithWhereWithoutSaleInput | CustomerPaymentUpdateManyWithWhereWithoutSaleInput[]
    deleteMany?: CustomerPaymentScalarWhereInput | CustomerPaymentScalarWhereInput[]
  }

  export type LandSaleCreateNestedOneWithoutInstallmentSchedulesInput = {
    create?: XOR<LandSaleCreateWithoutInstallmentSchedulesInput, LandSaleUncheckedCreateWithoutInstallmentSchedulesInput>
    connectOrCreate?: LandSaleCreateOrConnectWithoutInstallmentSchedulesInput
    connect?: LandSaleWhereUniqueInput
  }

  export type LandSaleUpdateOneRequiredWithoutInstallmentSchedulesNestedInput = {
    create?: XOR<LandSaleCreateWithoutInstallmentSchedulesInput, LandSaleUncheckedCreateWithoutInstallmentSchedulesInput>
    connectOrCreate?: LandSaleCreateOrConnectWithoutInstallmentSchedulesInput
    upsert?: LandSaleUpsertWithoutInstallmentSchedulesInput
    connect?: LandSaleWhereUniqueInput
    update?: XOR<XOR<LandSaleUpdateToOneWithWhereWithoutInstallmentSchedulesInput, LandSaleUpdateWithoutInstallmentSchedulesInput>, LandSaleUncheckedUpdateWithoutInstallmentSchedulesInput>
  }

  export type LandSaleCreateNestedOneWithoutCustomerPaymentsInput = {
    create?: XOR<LandSaleCreateWithoutCustomerPaymentsInput, LandSaleUncheckedCreateWithoutCustomerPaymentsInput>
    connectOrCreate?: LandSaleCreateOrConnectWithoutCustomerPaymentsInput
    connect?: LandSaleWhereUniqueInput
  }

  export type BankAccountCreateNestedOneWithoutCustomerPaymentsInput = {
    create?: XOR<BankAccountCreateWithoutCustomerPaymentsInput, BankAccountUncheckedCreateWithoutCustomerPaymentsInput>
    connectOrCreate?: BankAccountCreateOrConnectWithoutCustomerPaymentsInput
    connect?: BankAccountWhereUniqueInput
  }

  export type LandSaleUpdateOneRequiredWithoutCustomerPaymentsNestedInput = {
    create?: XOR<LandSaleCreateWithoutCustomerPaymentsInput, LandSaleUncheckedCreateWithoutCustomerPaymentsInput>
    connectOrCreate?: LandSaleCreateOrConnectWithoutCustomerPaymentsInput
    upsert?: LandSaleUpsertWithoutCustomerPaymentsInput
    connect?: LandSaleWhereUniqueInput
    update?: XOR<XOR<LandSaleUpdateToOneWithWhereWithoutCustomerPaymentsInput, LandSaleUpdateWithoutCustomerPaymentsInput>, LandSaleUncheckedUpdateWithoutCustomerPaymentsInput>
  }

  export type BankAccountUpdateOneWithoutCustomerPaymentsNestedInput = {
    create?: XOR<BankAccountCreateWithoutCustomerPaymentsInput, BankAccountUncheckedCreateWithoutCustomerPaymentsInput>
    connectOrCreate?: BankAccountCreateOrConnectWithoutCustomerPaymentsInput
    upsert?: BankAccountUpsertWithoutCustomerPaymentsInput
    disconnect?: BankAccountWhereInput | boolean
    delete?: BankAccountWhereInput | boolean
    connect?: BankAccountWhereUniqueInput
    update?: XOR<XOR<BankAccountUpdateToOneWithWhereWithoutCustomerPaymentsInput, BankAccountUpdateWithoutCustomerPaymentsInput>, BankAccountUncheckedUpdateWithoutCustomerPaymentsInput>
  }

  export type LandProjectCreateNestedOneWithoutProfitDistributionsInput = {
    create?: XOR<LandProjectCreateWithoutProfitDistributionsInput, LandProjectUncheckedCreateWithoutProfitDistributionsInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutProfitDistributionsInput
    connect?: LandProjectWhereUniqueInput
  }

  export type PartnerCreateNestedOneWithoutProfitDistributionsInput = {
    create?: XOR<PartnerCreateWithoutProfitDistributionsInput, PartnerUncheckedCreateWithoutProfitDistributionsInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutProfitDistributionsInput
    connect?: PartnerWhereUniqueInput
  }

  export type LandProjectUpdateOneRequiredWithoutProfitDistributionsNestedInput = {
    create?: XOR<LandProjectCreateWithoutProfitDistributionsInput, LandProjectUncheckedCreateWithoutProfitDistributionsInput>
    connectOrCreate?: LandProjectCreateOrConnectWithoutProfitDistributionsInput
    upsert?: LandProjectUpsertWithoutProfitDistributionsInput
    connect?: LandProjectWhereUniqueInput
    update?: XOR<XOR<LandProjectUpdateToOneWithWhereWithoutProfitDistributionsInput, LandProjectUpdateWithoutProfitDistributionsInput>, LandProjectUncheckedUpdateWithoutProfitDistributionsInput>
  }

  export type PartnerUpdateOneRequiredWithoutProfitDistributionsNestedInput = {
    create?: XOR<PartnerCreateWithoutProfitDistributionsInput, PartnerUncheckedCreateWithoutProfitDistributionsInput>
    connectOrCreate?: PartnerCreateOrConnectWithoutProfitDistributionsInput
    upsert?: PartnerUpsertWithoutProfitDistributionsInput
    connect?: PartnerWhereUniqueInput
    update?: XOR<XOR<PartnerUpdateToOneWithWhereWithoutProfitDistributionsInput, PartnerUpdateWithoutProfitDistributionsInput>, PartnerUncheckedUpdateWithoutProfitDistributionsInput>
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

  export type ProjectPartnerCreateWithoutPartnerInput = {
    id: string
    sharePercentage: Decimal | DecimalJsLike | number | string
    project: LandProjectCreateNestedOneWithoutProjectPartnersInput
  }

  export type ProjectPartnerUncheckedCreateWithoutPartnerInput = {
    id: string
    projectId: string
    sharePercentage: Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerCreateOrConnectWithoutPartnerInput = {
    where: ProjectPartnerWhereUniqueInput
    create: XOR<ProjectPartnerCreateWithoutPartnerInput, ProjectPartnerUncheckedCreateWithoutPartnerInput>
  }

  export type ProjectPartnerCreateManyPartnerInputEnvelope = {
    data: ProjectPartnerCreateManyPartnerInput | ProjectPartnerCreateManyPartnerInput[]
    skipDuplicates?: boolean
  }

  export type PartnerTransactionCreateWithoutPartnerInput = {
    id: string
    txnType: string
    amount: Decimal | DecimalJsLike | number | string
    txnDate: Date | string
    referenceId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type PartnerTransactionUncheckedCreateWithoutPartnerInput = {
    id: string
    txnType: string
    amount: Decimal | DecimalJsLike | number | string
    txnDate: Date | string
    referenceId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type PartnerTransactionCreateOrConnectWithoutPartnerInput = {
    where: PartnerTransactionWhereUniqueInput
    create: XOR<PartnerTransactionCreateWithoutPartnerInput, PartnerTransactionUncheckedCreateWithoutPartnerInput>
  }

  export type PartnerTransactionCreateManyPartnerInputEnvelope = {
    data: PartnerTransactionCreateManyPartnerInput | PartnerTransactionCreateManyPartnerInput[]
    skipDuplicates?: boolean
  }

  export type ProjectExpenseCreateWithoutPaidByPartnerInput = {
    id: string
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
    project?: LandProjectCreateNestedOneWithoutProjectExpensesInput
    bankAccount?: BankAccountCreateNestedOneWithoutExpensesInput
  }

  export type ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput = {
    id: string
    projectId?: string | null
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    bankAccountId?: string | null
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type ProjectExpenseCreateOrConnectWithoutPaidByPartnerInput = {
    where: ProjectExpenseWhereUniqueInput
    create: XOR<ProjectExpenseCreateWithoutPaidByPartnerInput, ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput>
  }

  export type ProjectExpenseCreateManyPaidByPartnerInputEnvelope = {
    data: ProjectExpenseCreateManyPaidByPartnerInput | ProjectExpenseCreateManyPaidByPartnerInput[]
    skipDuplicates?: boolean
  }

  export type ProfitDistributionCreateWithoutPartnerInput = {
    id: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
    project: LandProjectCreateNestedOneWithoutProfitDistributionsInput
  }

  export type ProfitDistributionUncheckedCreateWithoutPartnerInput = {
    id: string
    projectId: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
  }

  export type ProfitDistributionCreateOrConnectWithoutPartnerInput = {
    where: ProfitDistributionWhereUniqueInput
    create: XOR<ProfitDistributionCreateWithoutPartnerInput, ProfitDistributionUncheckedCreateWithoutPartnerInput>
  }

  export type ProfitDistributionCreateManyPartnerInputEnvelope = {
    data: ProfitDistributionCreateManyPartnerInput | ProfitDistributionCreateManyPartnerInput[]
    skipDuplicates?: boolean
  }

  export type ProjectPartnerUpsertWithWhereUniqueWithoutPartnerInput = {
    where: ProjectPartnerWhereUniqueInput
    update: XOR<ProjectPartnerUpdateWithoutPartnerInput, ProjectPartnerUncheckedUpdateWithoutPartnerInput>
    create: XOR<ProjectPartnerCreateWithoutPartnerInput, ProjectPartnerUncheckedCreateWithoutPartnerInput>
  }

  export type ProjectPartnerUpdateWithWhereUniqueWithoutPartnerInput = {
    where: ProjectPartnerWhereUniqueInput
    data: XOR<ProjectPartnerUpdateWithoutPartnerInput, ProjectPartnerUncheckedUpdateWithoutPartnerInput>
  }

  export type ProjectPartnerUpdateManyWithWhereWithoutPartnerInput = {
    where: ProjectPartnerScalarWhereInput
    data: XOR<ProjectPartnerUpdateManyMutationInput, ProjectPartnerUncheckedUpdateManyWithoutPartnerInput>
  }

  export type ProjectPartnerScalarWhereInput = {
    AND?: ProjectPartnerScalarWhereInput | ProjectPartnerScalarWhereInput[]
    OR?: ProjectPartnerScalarWhereInput[]
    NOT?: ProjectPartnerScalarWhereInput | ProjectPartnerScalarWhereInput[]
    id?: StringFilter<"ProjectPartner"> | string
    projectId?: StringFilter<"ProjectPartner"> | string
    partnerId?: StringFilter<"ProjectPartner"> | string
    sharePercentage?: DecimalFilter<"ProjectPartner"> | Decimal | DecimalJsLike | number | string
  }

  export type PartnerTransactionUpsertWithWhereUniqueWithoutPartnerInput = {
    where: PartnerTransactionWhereUniqueInput
    update: XOR<PartnerTransactionUpdateWithoutPartnerInput, PartnerTransactionUncheckedUpdateWithoutPartnerInput>
    create: XOR<PartnerTransactionCreateWithoutPartnerInput, PartnerTransactionUncheckedCreateWithoutPartnerInput>
  }

  export type PartnerTransactionUpdateWithWhereUniqueWithoutPartnerInput = {
    where: PartnerTransactionWhereUniqueInput
    data: XOR<PartnerTransactionUpdateWithoutPartnerInput, PartnerTransactionUncheckedUpdateWithoutPartnerInput>
  }

  export type PartnerTransactionUpdateManyWithWhereWithoutPartnerInput = {
    where: PartnerTransactionScalarWhereInput
    data: XOR<PartnerTransactionUpdateManyMutationInput, PartnerTransactionUncheckedUpdateManyWithoutPartnerInput>
  }

  export type PartnerTransactionScalarWhereInput = {
    AND?: PartnerTransactionScalarWhereInput | PartnerTransactionScalarWhereInput[]
    OR?: PartnerTransactionScalarWhereInput[]
    NOT?: PartnerTransactionScalarWhereInput | PartnerTransactionScalarWhereInput[]
    id?: StringFilter<"PartnerTransaction"> | string
    partnerId?: StringFilter<"PartnerTransaction"> | string
    txnType?: StringFilter<"PartnerTransaction"> | string
    amount?: DecimalFilter<"PartnerTransaction"> | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFilter<"PartnerTransaction"> | Date | string
    referenceId?: StringNullableFilter<"PartnerTransaction"> | string | null
    notes?: StringNullableFilter<"PartnerTransaction"> | string | null
    createdAt?: DateTimeFilter<"PartnerTransaction"> | Date | string
  }

  export type ProjectExpenseUpsertWithWhereUniqueWithoutPaidByPartnerInput = {
    where: ProjectExpenseWhereUniqueInput
    update: XOR<ProjectExpenseUpdateWithoutPaidByPartnerInput, ProjectExpenseUncheckedUpdateWithoutPaidByPartnerInput>
    create: XOR<ProjectExpenseCreateWithoutPaidByPartnerInput, ProjectExpenseUncheckedCreateWithoutPaidByPartnerInput>
  }

  export type ProjectExpenseUpdateWithWhereUniqueWithoutPaidByPartnerInput = {
    where: ProjectExpenseWhereUniqueInput
    data: XOR<ProjectExpenseUpdateWithoutPaidByPartnerInput, ProjectExpenseUncheckedUpdateWithoutPaidByPartnerInput>
  }

  export type ProjectExpenseUpdateManyWithWhereWithoutPaidByPartnerInput = {
    where: ProjectExpenseScalarWhereInput
    data: XOR<ProjectExpenseUpdateManyMutationInput, ProjectExpenseUncheckedUpdateManyWithoutPaidByPartnerInput>
  }

  export type ProjectExpenseScalarWhereInput = {
    AND?: ProjectExpenseScalarWhereInput | ProjectExpenseScalarWhereInput[]
    OR?: ProjectExpenseScalarWhereInput[]
    NOT?: ProjectExpenseScalarWhereInput | ProjectExpenseScalarWhereInput[]
    id?: StringFilter<"ProjectExpense"> | string
    projectId?: StringNullableFilter<"ProjectExpense"> | string | null
    expenseCategory?: StringFilter<"ProjectExpense"> | string
    amount?: DecimalFilter<"ProjectExpense"> | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFilter<"ProjectExpense"> | Date | string
    description?: StringNullableFilter<"ProjectExpense"> | string | null
    paymentChannel?: StringFilter<"ProjectExpense"> | string
    bankAccountId?: StringNullableFilter<"ProjectExpense"> | string | null
    paidByPartnerId?: StringNullableFilter<"ProjectExpense"> | string | null
    voucherImageUrl?: StringNullableFilter<"ProjectExpense"> | string | null
    status?: StringFilter<"ProjectExpense"> | string
    approvedBy?: StringNullableFilter<"ProjectExpense"> | string | null
    createdBy?: StringFilter<"ProjectExpense"> | string
    createdAt?: DateTimeFilter<"ProjectExpense"> | Date | string
  }

  export type ProfitDistributionUpsertWithWhereUniqueWithoutPartnerInput = {
    where: ProfitDistributionWhereUniqueInput
    update: XOR<ProfitDistributionUpdateWithoutPartnerInput, ProfitDistributionUncheckedUpdateWithoutPartnerInput>
    create: XOR<ProfitDistributionCreateWithoutPartnerInput, ProfitDistributionUncheckedCreateWithoutPartnerInput>
  }

  export type ProfitDistributionUpdateWithWhereUniqueWithoutPartnerInput = {
    where: ProfitDistributionWhereUniqueInput
    data: XOR<ProfitDistributionUpdateWithoutPartnerInput, ProfitDistributionUncheckedUpdateWithoutPartnerInput>
  }

  export type ProfitDistributionUpdateManyWithWhereWithoutPartnerInput = {
    where: ProfitDistributionScalarWhereInput
    data: XOR<ProfitDistributionUpdateManyMutationInput, ProfitDistributionUncheckedUpdateManyWithoutPartnerInput>
  }

  export type ProfitDistributionScalarWhereInput = {
    AND?: ProfitDistributionScalarWhereInput | ProfitDistributionScalarWhereInput[]
    OR?: ProfitDistributionScalarWhereInput[]
    NOT?: ProfitDistributionScalarWhereInput | ProfitDistributionScalarWhereInput[]
    id?: StringFilter<"ProfitDistribution"> | string
    projectId?: StringFilter<"ProfitDistribution"> | string
    distributionDate?: DateTimeFilter<"ProfitDistribution"> | Date | string
    realizationBasis?: StringFilter<"ProfitDistribution"> | string
    totalProjectNetProfit?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    partnerId?: StringFilter<"ProfitDistribution"> | string
    partnerSharePercent?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFilter<"ProfitDistribution"> | Decimal | DecimalJsLike | number | string
  }

  export type TreasuryLedgerCreateWithoutBankAccountInput = {
    id: string
    txnDate: Date | string
    accountType: string
    flowType: string
    amount: Decimal | DecimalJsLike | number | string
    purpose: string
    referenceType: string
    referenceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type TreasuryLedgerUncheckedCreateWithoutBankAccountInput = {
    id: string
    txnDate: Date | string
    accountType: string
    flowType: string
    amount: Decimal | DecimalJsLike | number | string
    purpose: string
    referenceType: string
    referenceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type TreasuryLedgerCreateOrConnectWithoutBankAccountInput = {
    where: TreasuryLedgerWhereUniqueInput
    create: XOR<TreasuryLedgerCreateWithoutBankAccountInput, TreasuryLedgerUncheckedCreateWithoutBankAccountInput>
  }

  export type TreasuryLedgerCreateManyBankAccountInputEnvelope = {
    data: TreasuryLedgerCreateManyBankAccountInput | TreasuryLedgerCreateManyBankAccountInput[]
    skipDuplicates?: boolean
  }

  export type ProjectExpenseCreateWithoutBankAccountInput = {
    id: string
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
    project?: LandProjectCreateNestedOneWithoutProjectExpensesInput
    paidByPartner?: PartnerCreateNestedOneWithoutPaidExpensesInput
  }

  export type ProjectExpenseUncheckedCreateWithoutBankAccountInput = {
    id: string
    projectId?: string | null
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    paidByPartnerId?: string | null
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type ProjectExpenseCreateOrConnectWithoutBankAccountInput = {
    where: ProjectExpenseWhereUniqueInput
    create: XOR<ProjectExpenseCreateWithoutBankAccountInput, ProjectExpenseUncheckedCreateWithoutBankAccountInput>
  }

  export type ProjectExpenseCreateManyBankAccountInputEnvelope = {
    data: ProjectExpenseCreateManyBankAccountInput | ProjectExpenseCreateManyBankAccountInput[]
    skipDuplicates?: boolean
  }

  export type CustomerPaymentCreateWithoutBankAccountInput = {
    id: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    receiptNo: string
    remarks?: string | null
    sale: LandSaleCreateNestedOneWithoutCustomerPaymentsInput
  }

  export type CustomerPaymentUncheckedCreateWithoutBankAccountInput = {
    id: string
    saleId: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    receiptNo: string
    remarks?: string | null
  }

  export type CustomerPaymentCreateOrConnectWithoutBankAccountInput = {
    where: CustomerPaymentWhereUniqueInput
    create: XOR<CustomerPaymentCreateWithoutBankAccountInput, CustomerPaymentUncheckedCreateWithoutBankAccountInput>
  }

  export type CustomerPaymentCreateManyBankAccountInputEnvelope = {
    data: CustomerPaymentCreateManyBankAccountInput | CustomerPaymentCreateManyBankAccountInput[]
    skipDuplicates?: boolean
  }

  export type TreasuryLedgerUpsertWithWhereUniqueWithoutBankAccountInput = {
    where: TreasuryLedgerWhereUniqueInput
    update: XOR<TreasuryLedgerUpdateWithoutBankAccountInput, TreasuryLedgerUncheckedUpdateWithoutBankAccountInput>
    create: XOR<TreasuryLedgerCreateWithoutBankAccountInput, TreasuryLedgerUncheckedCreateWithoutBankAccountInput>
  }

  export type TreasuryLedgerUpdateWithWhereUniqueWithoutBankAccountInput = {
    where: TreasuryLedgerWhereUniqueInput
    data: XOR<TreasuryLedgerUpdateWithoutBankAccountInput, TreasuryLedgerUncheckedUpdateWithoutBankAccountInput>
  }

  export type TreasuryLedgerUpdateManyWithWhereWithoutBankAccountInput = {
    where: TreasuryLedgerScalarWhereInput
    data: XOR<TreasuryLedgerUpdateManyMutationInput, TreasuryLedgerUncheckedUpdateManyWithoutBankAccountInput>
  }

  export type TreasuryLedgerScalarWhereInput = {
    AND?: TreasuryLedgerScalarWhereInput | TreasuryLedgerScalarWhereInput[]
    OR?: TreasuryLedgerScalarWhereInput[]
    NOT?: TreasuryLedgerScalarWhereInput | TreasuryLedgerScalarWhereInput[]
    id?: StringFilter<"TreasuryLedger"> | string
    txnDate?: DateTimeFilter<"TreasuryLedger"> | Date | string
    accountType?: StringFilter<"TreasuryLedger"> | string
    bankAccountId?: StringNullableFilter<"TreasuryLedger"> | string | null
    flowType?: StringFilter<"TreasuryLedger"> | string
    amount?: DecimalFilter<"TreasuryLedger"> | Decimal | DecimalJsLike | number | string
    purpose?: StringFilter<"TreasuryLedger"> | string
    referenceType?: StringFilter<"TreasuryLedger"> | string
    referenceId?: StringNullableFilter<"TreasuryLedger"> | string | null
    createdBy?: StringFilter<"TreasuryLedger"> | string
    createdAt?: DateTimeFilter<"TreasuryLedger"> | Date | string
  }

  export type ProjectExpenseUpsertWithWhereUniqueWithoutBankAccountInput = {
    where: ProjectExpenseWhereUniqueInput
    update: XOR<ProjectExpenseUpdateWithoutBankAccountInput, ProjectExpenseUncheckedUpdateWithoutBankAccountInput>
    create: XOR<ProjectExpenseCreateWithoutBankAccountInput, ProjectExpenseUncheckedCreateWithoutBankAccountInput>
  }

  export type ProjectExpenseUpdateWithWhereUniqueWithoutBankAccountInput = {
    where: ProjectExpenseWhereUniqueInput
    data: XOR<ProjectExpenseUpdateWithoutBankAccountInput, ProjectExpenseUncheckedUpdateWithoutBankAccountInput>
  }

  export type ProjectExpenseUpdateManyWithWhereWithoutBankAccountInput = {
    where: ProjectExpenseScalarWhereInput
    data: XOR<ProjectExpenseUpdateManyMutationInput, ProjectExpenseUncheckedUpdateManyWithoutBankAccountInput>
  }

  export type CustomerPaymentUpsertWithWhereUniqueWithoutBankAccountInput = {
    where: CustomerPaymentWhereUniqueInput
    update: XOR<CustomerPaymentUpdateWithoutBankAccountInput, CustomerPaymentUncheckedUpdateWithoutBankAccountInput>
    create: XOR<CustomerPaymentCreateWithoutBankAccountInput, CustomerPaymentUncheckedCreateWithoutBankAccountInput>
  }

  export type CustomerPaymentUpdateWithWhereUniqueWithoutBankAccountInput = {
    where: CustomerPaymentWhereUniqueInput
    data: XOR<CustomerPaymentUpdateWithoutBankAccountInput, CustomerPaymentUncheckedUpdateWithoutBankAccountInput>
  }

  export type CustomerPaymentUpdateManyWithWhereWithoutBankAccountInput = {
    where: CustomerPaymentScalarWhereInput
    data: XOR<CustomerPaymentUpdateManyMutationInput, CustomerPaymentUncheckedUpdateManyWithoutBankAccountInput>
  }

  export type CustomerPaymentScalarWhereInput = {
    AND?: CustomerPaymentScalarWhereInput | CustomerPaymentScalarWhereInput[]
    OR?: CustomerPaymentScalarWhereInput[]
    NOT?: CustomerPaymentScalarWhereInput | CustomerPaymentScalarWhereInput[]
    id?: StringFilter<"CustomerPayment"> | string
    saleId?: StringFilter<"CustomerPayment"> | string
    paymentDate?: DateTimeFilter<"CustomerPayment"> | Date | string
    amountPaid?: DecimalFilter<"CustomerPayment"> | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFilter<"CustomerPayment"> | string
    bankAccountId?: StringNullableFilter<"CustomerPayment"> | string | null
    receiptNo?: StringFilter<"CustomerPayment"> | string
    remarks?: StringNullableFilter<"CustomerPayment"> | string | null
  }

  export type ProjectPartnerCreateWithoutProjectInput = {
    id: string
    sharePercentage: Decimal | DecimalJsLike | number | string
    partner: PartnerCreateNestedOneWithoutProjectPartnersInput
  }

  export type ProjectPartnerUncheckedCreateWithoutProjectInput = {
    id: string
    partnerId: string
    sharePercentage: Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerCreateOrConnectWithoutProjectInput = {
    where: ProjectPartnerWhereUniqueInput
    create: XOR<ProjectPartnerCreateWithoutProjectInput, ProjectPartnerUncheckedCreateWithoutProjectInput>
  }

  export type ProjectPartnerCreateManyProjectInputEnvelope = {
    data: ProjectPartnerCreateManyProjectInput | ProjectPartnerCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectExpenseCreateWithoutProjectInput = {
    id: string
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
    bankAccount?: BankAccountCreateNestedOneWithoutExpensesInput
    paidByPartner?: PartnerCreateNestedOneWithoutPaidExpensesInput
  }

  export type ProjectExpenseUncheckedCreateWithoutProjectInput = {
    id: string
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    bankAccountId?: string | null
    paidByPartnerId?: string | null
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type ProjectExpenseCreateOrConnectWithoutProjectInput = {
    where: ProjectExpenseWhereUniqueInput
    create: XOR<ProjectExpenseCreateWithoutProjectInput, ProjectExpenseUncheckedCreateWithoutProjectInput>
  }

  export type ProjectExpenseCreateManyProjectInputEnvelope = {
    data: ProjectExpenseCreateManyProjectInput | ProjectExpenseCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectPlotCreateWithoutProjectInput = {
    id: string
    plotNumber: string
    plotSizeShotok: Decimal | DecimalJsLike | number | string
    askingPrice: Decimal | DecimalJsLike | number | string
    status?: string
    landSales?: LandSaleCreateNestedManyWithoutPlotInput
  }

  export type ProjectPlotUncheckedCreateWithoutProjectInput = {
    id: string
    plotNumber: string
    plotSizeShotok: Decimal | DecimalJsLike | number | string
    askingPrice: Decimal | DecimalJsLike | number | string
    status?: string
    landSales?: LandSaleUncheckedCreateNestedManyWithoutPlotInput
  }

  export type ProjectPlotCreateOrConnectWithoutProjectInput = {
    where: ProjectPlotWhereUniqueInput
    create: XOR<ProjectPlotCreateWithoutProjectInput, ProjectPlotUncheckedCreateWithoutProjectInput>
  }

  export type ProjectPlotCreateManyProjectInputEnvelope = {
    data: ProjectPlotCreateManyProjectInput | ProjectPlotCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type LandSaleCreateWithoutProjectInput = {
    id: string
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    plot?: ProjectPlotCreateNestedOneWithoutLandSalesInput
    installmentSchedules?: InstallmentScheduleCreateNestedManyWithoutSaleInput
    customerPayments?: CustomerPaymentCreateNestedManyWithoutSaleInput
  }

  export type LandSaleUncheckedCreateWithoutProjectInput = {
    id: string
    plotId?: string | null
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    installmentSchedules?: InstallmentScheduleUncheckedCreateNestedManyWithoutSaleInput
    customerPayments?: CustomerPaymentUncheckedCreateNestedManyWithoutSaleInput
  }

  export type LandSaleCreateOrConnectWithoutProjectInput = {
    where: LandSaleWhereUniqueInput
    create: XOR<LandSaleCreateWithoutProjectInput, LandSaleUncheckedCreateWithoutProjectInput>
  }

  export type LandSaleCreateManyProjectInputEnvelope = {
    data: LandSaleCreateManyProjectInput | LandSaleCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProfitDistributionCreateWithoutProjectInput = {
    id: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
    partner: PartnerCreateNestedOneWithoutProfitDistributionsInput
  }

  export type ProfitDistributionUncheckedCreateWithoutProjectInput = {
    id: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerId: string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
  }

  export type ProfitDistributionCreateOrConnectWithoutProjectInput = {
    where: ProfitDistributionWhereUniqueInput
    create: XOR<ProfitDistributionCreateWithoutProjectInput, ProfitDistributionUncheckedCreateWithoutProjectInput>
  }

  export type ProfitDistributionCreateManyProjectInputEnvelope = {
    data: ProfitDistributionCreateManyProjectInput | ProfitDistributionCreateManyProjectInput[]
    skipDuplicates?: boolean
  }

  export type ProjectPartnerUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectPartnerWhereUniqueInput
    update: XOR<ProjectPartnerUpdateWithoutProjectInput, ProjectPartnerUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectPartnerCreateWithoutProjectInput, ProjectPartnerUncheckedCreateWithoutProjectInput>
  }

  export type ProjectPartnerUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectPartnerWhereUniqueInput
    data: XOR<ProjectPartnerUpdateWithoutProjectInput, ProjectPartnerUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectPartnerUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectPartnerScalarWhereInput
    data: XOR<ProjectPartnerUpdateManyMutationInput, ProjectPartnerUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectExpenseUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectExpenseWhereUniqueInput
    update: XOR<ProjectExpenseUpdateWithoutProjectInput, ProjectExpenseUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectExpenseCreateWithoutProjectInput, ProjectExpenseUncheckedCreateWithoutProjectInput>
  }

  export type ProjectExpenseUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectExpenseWhereUniqueInput
    data: XOR<ProjectExpenseUpdateWithoutProjectInput, ProjectExpenseUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectExpenseUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectExpenseScalarWhereInput
    data: XOR<ProjectExpenseUpdateManyMutationInput, ProjectExpenseUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectPlotUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProjectPlotWhereUniqueInput
    update: XOR<ProjectPlotUpdateWithoutProjectInput, ProjectPlotUncheckedUpdateWithoutProjectInput>
    create: XOR<ProjectPlotCreateWithoutProjectInput, ProjectPlotUncheckedCreateWithoutProjectInput>
  }

  export type ProjectPlotUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProjectPlotWhereUniqueInput
    data: XOR<ProjectPlotUpdateWithoutProjectInput, ProjectPlotUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectPlotUpdateManyWithWhereWithoutProjectInput = {
    where: ProjectPlotScalarWhereInput
    data: XOR<ProjectPlotUpdateManyMutationInput, ProjectPlotUncheckedUpdateManyWithoutProjectInput>
  }

  export type ProjectPlotScalarWhereInput = {
    AND?: ProjectPlotScalarWhereInput | ProjectPlotScalarWhereInput[]
    OR?: ProjectPlotScalarWhereInput[]
    NOT?: ProjectPlotScalarWhereInput | ProjectPlotScalarWhereInput[]
    id?: StringFilter<"ProjectPlot"> | string
    projectId?: StringFilter<"ProjectPlot"> | string
    plotNumber?: StringFilter<"ProjectPlot"> | string
    plotSizeShotok?: DecimalFilter<"ProjectPlot"> | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFilter<"ProjectPlot"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"ProjectPlot"> | string
  }

  export type LandSaleUpsertWithWhereUniqueWithoutProjectInput = {
    where: LandSaleWhereUniqueInput
    update: XOR<LandSaleUpdateWithoutProjectInput, LandSaleUncheckedUpdateWithoutProjectInput>
    create: XOR<LandSaleCreateWithoutProjectInput, LandSaleUncheckedCreateWithoutProjectInput>
  }

  export type LandSaleUpdateWithWhereUniqueWithoutProjectInput = {
    where: LandSaleWhereUniqueInput
    data: XOR<LandSaleUpdateWithoutProjectInput, LandSaleUncheckedUpdateWithoutProjectInput>
  }

  export type LandSaleUpdateManyWithWhereWithoutProjectInput = {
    where: LandSaleScalarWhereInput
    data: XOR<LandSaleUpdateManyMutationInput, LandSaleUncheckedUpdateManyWithoutProjectInput>
  }

  export type LandSaleScalarWhereInput = {
    AND?: LandSaleScalarWhereInput | LandSaleScalarWhereInput[]
    OR?: LandSaleScalarWhereInput[]
    NOT?: LandSaleScalarWhereInput | LandSaleScalarWhereInput[]
    id?: StringFilter<"LandSale"> | string
    projectId?: StringFilter<"LandSale"> | string
    plotId?: StringNullableFilter<"LandSale"> | string | null
    buyerName?: StringFilter<"LandSale"> | string
    buyerPhone?: StringFilter<"LandSale"> | string
    buyerNid?: StringNullableFilter<"LandSale"> | string | null
    saleDate?: DateTimeFilter<"LandSale"> | Date | string
    totalAgreedPrice?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFilter<"LandSale"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"LandSale"> | string
  }

  export type ProfitDistributionUpsertWithWhereUniqueWithoutProjectInput = {
    where: ProfitDistributionWhereUniqueInput
    update: XOR<ProfitDistributionUpdateWithoutProjectInput, ProfitDistributionUncheckedUpdateWithoutProjectInput>
    create: XOR<ProfitDistributionCreateWithoutProjectInput, ProfitDistributionUncheckedCreateWithoutProjectInput>
  }

  export type ProfitDistributionUpdateWithWhereUniqueWithoutProjectInput = {
    where: ProfitDistributionWhereUniqueInput
    data: XOR<ProfitDistributionUpdateWithoutProjectInput, ProfitDistributionUncheckedUpdateWithoutProjectInput>
  }

  export type ProfitDistributionUpdateManyWithWhereWithoutProjectInput = {
    where: ProfitDistributionScalarWhereInput
    data: XOR<ProfitDistributionUpdateManyMutationInput, ProfitDistributionUncheckedUpdateManyWithoutProjectInput>
  }

  export type LandProjectCreateWithoutProjectPartnersInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectExpenses?: ProjectExpenseCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotCreateNestedManyWithoutProjectInput
    landSales?: LandSaleCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutProjectInput
  }

  export type LandProjectUncheckedCreateWithoutProjectPartnersInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotUncheckedCreateNestedManyWithoutProjectInput
    landSales?: LandSaleUncheckedCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutProjectInput
  }

  export type LandProjectCreateOrConnectWithoutProjectPartnersInput = {
    where: LandProjectWhereUniqueInput
    create: XOR<LandProjectCreateWithoutProjectPartnersInput, LandProjectUncheckedCreateWithoutProjectPartnersInput>
  }

  export type PartnerCreateWithoutProjectPartnersInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    partnerTransactions?: PartnerTransactionCreateNestedManyWithoutPartnerInput
    paidExpenses?: ProjectExpenseCreateNestedManyWithoutPaidByPartnerInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUncheckedCreateWithoutProjectPartnersInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    partnerTransactions?: PartnerTransactionUncheckedCreateNestedManyWithoutPartnerInput
    paidExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutPaidByPartnerInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type PartnerCreateOrConnectWithoutProjectPartnersInput = {
    where: PartnerWhereUniqueInput
    create: XOR<PartnerCreateWithoutProjectPartnersInput, PartnerUncheckedCreateWithoutProjectPartnersInput>
  }

  export type LandProjectUpsertWithoutProjectPartnersInput = {
    update: XOR<LandProjectUpdateWithoutProjectPartnersInput, LandProjectUncheckedUpdateWithoutProjectPartnersInput>
    create: XOR<LandProjectCreateWithoutProjectPartnersInput, LandProjectUncheckedCreateWithoutProjectPartnersInput>
    where?: LandProjectWhereInput
  }

  export type LandProjectUpdateToOneWithWhereWithoutProjectPartnersInput = {
    where?: LandProjectWhereInput
    data: XOR<LandProjectUpdateWithoutProjectPartnersInput, LandProjectUncheckedUpdateWithoutProjectPartnersInput>
  }

  export type LandProjectUpdateWithoutProjectPartnersInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectExpenses?: ProjectExpenseUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutProjectNestedInput
  }

  export type LandProjectUncheckedUpdateWithoutProjectPartnersInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectExpenses?: ProjectExpenseUncheckedUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUncheckedUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUncheckedUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type PartnerUpsertWithoutProjectPartnersInput = {
    update: XOR<PartnerUpdateWithoutProjectPartnersInput, PartnerUncheckedUpdateWithoutProjectPartnersInput>
    create: XOR<PartnerCreateWithoutProjectPartnersInput, PartnerUncheckedCreateWithoutProjectPartnersInput>
    where?: PartnerWhereInput
  }

  export type PartnerUpdateToOneWithWhereWithoutProjectPartnersInput = {
    where?: PartnerWhereInput
    data: XOR<PartnerUpdateWithoutProjectPartnersInput, PartnerUncheckedUpdateWithoutProjectPartnersInput>
  }

  export type PartnerUpdateWithoutProjectPartnersInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partnerTransactions?: PartnerTransactionUpdateManyWithoutPartnerNestedInput
    paidExpenses?: ProjectExpenseUpdateManyWithoutPaidByPartnerNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerUncheckedUpdateWithoutProjectPartnersInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    partnerTransactions?: PartnerTransactionUncheckedUpdateManyWithoutPartnerNestedInput
    paidExpenses?: ProjectExpenseUncheckedUpdateManyWithoutPaidByPartnerNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type BankAccountCreateWithoutTreasuryLedgersInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    expenses?: ProjectExpenseCreateNestedManyWithoutBankAccountInput
    customerPayments?: CustomerPaymentCreateNestedManyWithoutBankAccountInput
  }

  export type BankAccountUncheckedCreateWithoutTreasuryLedgersInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    expenses?: ProjectExpenseUncheckedCreateNestedManyWithoutBankAccountInput
    customerPayments?: CustomerPaymentUncheckedCreateNestedManyWithoutBankAccountInput
  }

  export type BankAccountCreateOrConnectWithoutTreasuryLedgersInput = {
    where: BankAccountWhereUniqueInput
    create: XOR<BankAccountCreateWithoutTreasuryLedgersInput, BankAccountUncheckedCreateWithoutTreasuryLedgersInput>
  }

  export type BankAccountUpsertWithoutTreasuryLedgersInput = {
    update: XOR<BankAccountUpdateWithoutTreasuryLedgersInput, BankAccountUncheckedUpdateWithoutTreasuryLedgersInput>
    create: XOR<BankAccountCreateWithoutTreasuryLedgersInput, BankAccountUncheckedCreateWithoutTreasuryLedgersInput>
    where?: BankAccountWhereInput
  }

  export type BankAccountUpdateToOneWithWhereWithoutTreasuryLedgersInput = {
    where?: BankAccountWhereInput
    data: XOR<BankAccountUpdateWithoutTreasuryLedgersInput, BankAccountUncheckedUpdateWithoutTreasuryLedgersInput>
  }

  export type BankAccountUpdateWithoutTreasuryLedgersInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    expenses?: ProjectExpenseUpdateManyWithoutBankAccountNestedInput
    customerPayments?: CustomerPaymentUpdateManyWithoutBankAccountNestedInput
  }

  export type BankAccountUncheckedUpdateWithoutTreasuryLedgersInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    expenses?: ProjectExpenseUncheckedUpdateManyWithoutBankAccountNestedInput
    customerPayments?: CustomerPaymentUncheckedUpdateManyWithoutBankAccountNestedInput
  }

  export type PartnerCreateWithoutPartnerTransactionsInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutPartnerInput
    paidExpenses?: ProjectExpenseCreateNestedManyWithoutPaidByPartnerInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUncheckedCreateWithoutPartnerTransactionsInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutPartnerInput
    paidExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutPaidByPartnerInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type PartnerCreateOrConnectWithoutPartnerTransactionsInput = {
    where: PartnerWhereUniqueInput
    create: XOR<PartnerCreateWithoutPartnerTransactionsInput, PartnerUncheckedCreateWithoutPartnerTransactionsInput>
  }

  export type PartnerUpsertWithoutPartnerTransactionsInput = {
    update: XOR<PartnerUpdateWithoutPartnerTransactionsInput, PartnerUncheckedUpdateWithoutPartnerTransactionsInput>
    create: XOR<PartnerCreateWithoutPartnerTransactionsInput, PartnerUncheckedCreateWithoutPartnerTransactionsInput>
    where?: PartnerWhereInput
  }

  export type PartnerUpdateToOneWithWhereWithoutPartnerTransactionsInput = {
    where?: PartnerWhereInput
    data: XOR<PartnerUpdateWithoutPartnerTransactionsInput, PartnerUncheckedUpdateWithoutPartnerTransactionsInput>
  }

  export type PartnerUpdateWithoutPartnerTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutPartnerNestedInput
    paidExpenses?: ProjectExpenseUpdateManyWithoutPaidByPartnerNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerUncheckedUpdateWithoutPartnerTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutPartnerNestedInput
    paidExpenses?: ProjectExpenseUncheckedUpdateManyWithoutPaidByPartnerNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type LandProjectCreateWithoutProjectExpensesInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotCreateNestedManyWithoutProjectInput
    landSales?: LandSaleCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutProjectInput
  }

  export type LandProjectUncheckedCreateWithoutProjectExpensesInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotUncheckedCreateNestedManyWithoutProjectInput
    landSales?: LandSaleUncheckedCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutProjectInput
  }

  export type LandProjectCreateOrConnectWithoutProjectExpensesInput = {
    where: LandProjectWhereUniqueInput
    create: XOR<LandProjectCreateWithoutProjectExpensesInput, LandProjectUncheckedCreateWithoutProjectExpensesInput>
  }

  export type BankAccountCreateWithoutExpensesInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    treasuryLedgers?: TreasuryLedgerCreateNestedManyWithoutBankAccountInput
    customerPayments?: CustomerPaymentCreateNestedManyWithoutBankAccountInput
  }

  export type BankAccountUncheckedCreateWithoutExpensesInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    treasuryLedgers?: TreasuryLedgerUncheckedCreateNestedManyWithoutBankAccountInput
    customerPayments?: CustomerPaymentUncheckedCreateNestedManyWithoutBankAccountInput
  }

  export type BankAccountCreateOrConnectWithoutExpensesInput = {
    where: BankAccountWhereUniqueInput
    create: XOR<BankAccountCreateWithoutExpensesInput, BankAccountUncheckedCreateWithoutExpensesInput>
  }

  export type PartnerCreateWithoutPaidExpensesInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutPartnerInput
    partnerTransactions?: PartnerTransactionCreateNestedManyWithoutPartnerInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutPartnerInput
  }

  export type PartnerUncheckedCreateWithoutPaidExpensesInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutPartnerInput
    partnerTransactions?: PartnerTransactionUncheckedCreateNestedManyWithoutPartnerInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutPartnerInput
  }

  export type PartnerCreateOrConnectWithoutPaidExpensesInput = {
    where: PartnerWhereUniqueInput
    create: XOR<PartnerCreateWithoutPaidExpensesInput, PartnerUncheckedCreateWithoutPaidExpensesInput>
  }

  export type LandProjectUpsertWithoutProjectExpensesInput = {
    update: XOR<LandProjectUpdateWithoutProjectExpensesInput, LandProjectUncheckedUpdateWithoutProjectExpensesInput>
    create: XOR<LandProjectCreateWithoutProjectExpensesInput, LandProjectUncheckedCreateWithoutProjectExpensesInput>
    where?: LandProjectWhereInput
  }

  export type LandProjectUpdateToOneWithWhereWithoutProjectExpensesInput = {
    where?: LandProjectWhereInput
    data: XOR<LandProjectUpdateWithoutProjectExpensesInput, LandProjectUncheckedUpdateWithoutProjectExpensesInput>
  }

  export type LandProjectUpdateWithoutProjectExpensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutProjectNestedInput
  }

  export type LandProjectUncheckedUpdateWithoutProjectExpensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUncheckedUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUncheckedUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type BankAccountUpsertWithoutExpensesInput = {
    update: XOR<BankAccountUpdateWithoutExpensesInput, BankAccountUncheckedUpdateWithoutExpensesInput>
    create: XOR<BankAccountCreateWithoutExpensesInput, BankAccountUncheckedCreateWithoutExpensesInput>
    where?: BankAccountWhereInput
  }

  export type BankAccountUpdateToOneWithWhereWithoutExpensesInput = {
    where?: BankAccountWhereInput
    data: XOR<BankAccountUpdateWithoutExpensesInput, BankAccountUncheckedUpdateWithoutExpensesInput>
  }

  export type BankAccountUpdateWithoutExpensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    treasuryLedgers?: TreasuryLedgerUpdateManyWithoutBankAccountNestedInput
    customerPayments?: CustomerPaymentUpdateManyWithoutBankAccountNestedInput
  }

  export type BankAccountUncheckedUpdateWithoutExpensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    treasuryLedgers?: TreasuryLedgerUncheckedUpdateManyWithoutBankAccountNestedInput
    customerPayments?: CustomerPaymentUncheckedUpdateManyWithoutBankAccountNestedInput
  }

  export type PartnerUpsertWithoutPaidExpensesInput = {
    update: XOR<PartnerUpdateWithoutPaidExpensesInput, PartnerUncheckedUpdateWithoutPaidExpensesInput>
    create: XOR<PartnerCreateWithoutPaidExpensesInput, PartnerUncheckedCreateWithoutPaidExpensesInput>
    where?: PartnerWhereInput
  }

  export type PartnerUpdateToOneWithWhereWithoutPaidExpensesInput = {
    where?: PartnerWhereInput
    data: XOR<PartnerUpdateWithoutPaidExpensesInput, PartnerUncheckedUpdateWithoutPaidExpensesInput>
  }

  export type PartnerUpdateWithoutPaidExpensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutPartnerNestedInput
    partnerTransactions?: PartnerTransactionUpdateManyWithoutPartnerNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutPartnerNestedInput
  }

  export type PartnerUncheckedUpdateWithoutPaidExpensesInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutPartnerNestedInput
    partnerTransactions?: PartnerTransactionUncheckedUpdateManyWithoutPartnerNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutPartnerNestedInput
  }

  export type LandProjectCreateWithoutProjectPlotsInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutProjectInput
    projectExpenses?: ProjectExpenseCreateNestedManyWithoutProjectInput
    landSales?: LandSaleCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutProjectInput
  }

  export type LandProjectUncheckedCreateWithoutProjectPlotsInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutProjectInput
    projectExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutProjectInput
    landSales?: LandSaleUncheckedCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutProjectInput
  }

  export type LandProjectCreateOrConnectWithoutProjectPlotsInput = {
    where: LandProjectWhereUniqueInput
    create: XOR<LandProjectCreateWithoutProjectPlotsInput, LandProjectUncheckedCreateWithoutProjectPlotsInput>
  }

  export type LandSaleCreateWithoutPlotInput = {
    id: string
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    project: LandProjectCreateNestedOneWithoutLandSalesInput
    installmentSchedules?: InstallmentScheduleCreateNestedManyWithoutSaleInput
    customerPayments?: CustomerPaymentCreateNestedManyWithoutSaleInput
  }

  export type LandSaleUncheckedCreateWithoutPlotInput = {
    id: string
    projectId: string
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    installmentSchedules?: InstallmentScheduleUncheckedCreateNestedManyWithoutSaleInput
    customerPayments?: CustomerPaymentUncheckedCreateNestedManyWithoutSaleInput
  }

  export type LandSaleCreateOrConnectWithoutPlotInput = {
    where: LandSaleWhereUniqueInput
    create: XOR<LandSaleCreateWithoutPlotInput, LandSaleUncheckedCreateWithoutPlotInput>
  }

  export type LandSaleCreateManyPlotInputEnvelope = {
    data: LandSaleCreateManyPlotInput | LandSaleCreateManyPlotInput[]
    skipDuplicates?: boolean
  }

  export type LandProjectUpsertWithoutProjectPlotsInput = {
    update: XOR<LandProjectUpdateWithoutProjectPlotsInput, LandProjectUncheckedUpdateWithoutProjectPlotsInput>
    create: XOR<LandProjectCreateWithoutProjectPlotsInput, LandProjectUncheckedCreateWithoutProjectPlotsInput>
    where?: LandProjectWhereInput
  }

  export type LandProjectUpdateToOneWithWhereWithoutProjectPlotsInput = {
    where?: LandProjectWhereInput
    data: XOR<LandProjectUpdateWithoutProjectPlotsInput, LandProjectUncheckedUpdateWithoutProjectPlotsInput>
  }

  export type LandProjectUpdateWithoutProjectPlotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutProjectNestedInput
    projectExpenses?: ProjectExpenseUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutProjectNestedInput
  }

  export type LandProjectUncheckedUpdateWithoutProjectPlotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutProjectNestedInput
    projectExpenses?: ProjectExpenseUncheckedUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUncheckedUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type LandSaleUpsertWithWhereUniqueWithoutPlotInput = {
    where: LandSaleWhereUniqueInput
    update: XOR<LandSaleUpdateWithoutPlotInput, LandSaleUncheckedUpdateWithoutPlotInput>
    create: XOR<LandSaleCreateWithoutPlotInput, LandSaleUncheckedCreateWithoutPlotInput>
  }

  export type LandSaleUpdateWithWhereUniqueWithoutPlotInput = {
    where: LandSaleWhereUniqueInput
    data: XOR<LandSaleUpdateWithoutPlotInput, LandSaleUncheckedUpdateWithoutPlotInput>
  }

  export type LandSaleUpdateManyWithWhereWithoutPlotInput = {
    where: LandSaleScalarWhereInput
    data: XOR<LandSaleUpdateManyMutationInput, LandSaleUncheckedUpdateManyWithoutPlotInput>
  }

  export type LandProjectCreateWithoutLandSalesInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutProjectInput
    projectExpenses?: ProjectExpenseCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionCreateNestedManyWithoutProjectInput
  }

  export type LandProjectUncheckedCreateWithoutLandSalesInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutProjectInput
    projectExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotUncheckedCreateNestedManyWithoutProjectInput
    profitDistributions?: ProfitDistributionUncheckedCreateNestedManyWithoutProjectInput
  }

  export type LandProjectCreateOrConnectWithoutLandSalesInput = {
    where: LandProjectWhereUniqueInput
    create: XOR<LandProjectCreateWithoutLandSalesInput, LandProjectUncheckedCreateWithoutLandSalesInput>
  }

  export type ProjectPlotCreateWithoutLandSalesInput = {
    id: string
    plotNumber: string
    plotSizeShotok: Decimal | DecimalJsLike | number | string
    askingPrice: Decimal | DecimalJsLike | number | string
    status?: string
    project: LandProjectCreateNestedOneWithoutProjectPlotsInput
  }

  export type ProjectPlotUncheckedCreateWithoutLandSalesInput = {
    id: string
    projectId: string
    plotNumber: string
    plotSizeShotok: Decimal | DecimalJsLike | number | string
    askingPrice: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type ProjectPlotCreateOrConnectWithoutLandSalesInput = {
    where: ProjectPlotWhereUniqueInput
    create: XOR<ProjectPlotCreateWithoutLandSalesInput, ProjectPlotUncheckedCreateWithoutLandSalesInput>
  }

  export type InstallmentScheduleCreateWithoutSaleInput = {
    id: string
    dueDate: Date | string
    dueAmount: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type InstallmentScheduleUncheckedCreateWithoutSaleInput = {
    id: string
    dueDate: Date | string
    dueAmount: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type InstallmentScheduleCreateOrConnectWithoutSaleInput = {
    where: InstallmentScheduleWhereUniqueInput
    create: XOR<InstallmentScheduleCreateWithoutSaleInput, InstallmentScheduleUncheckedCreateWithoutSaleInput>
  }

  export type InstallmentScheduleCreateManySaleInputEnvelope = {
    data: InstallmentScheduleCreateManySaleInput | InstallmentScheduleCreateManySaleInput[]
    skipDuplicates?: boolean
  }

  export type CustomerPaymentCreateWithoutSaleInput = {
    id: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    receiptNo: string
    remarks?: string | null
    bankAccount?: BankAccountCreateNestedOneWithoutCustomerPaymentsInput
  }

  export type CustomerPaymentUncheckedCreateWithoutSaleInput = {
    id: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    bankAccountId?: string | null
    receiptNo: string
    remarks?: string | null
  }

  export type CustomerPaymentCreateOrConnectWithoutSaleInput = {
    where: CustomerPaymentWhereUniqueInput
    create: XOR<CustomerPaymentCreateWithoutSaleInput, CustomerPaymentUncheckedCreateWithoutSaleInput>
  }

  export type CustomerPaymentCreateManySaleInputEnvelope = {
    data: CustomerPaymentCreateManySaleInput | CustomerPaymentCreateManySaleInput[]
    skipDuplicates?: boolean
  }

  export type LandProjectUpsertWithoutLandSalesInput = {
    update: XOR<LandProjectUpdateWithoutLandSalesInput, LandProjectUncheckedUpdateWithoutLandSalesInput>
    create: XOR<LandProjectCreateWithoutLandSalesInput, LandProjectUncheckedCreateWithoutLandSalesInput>
    where?: LandProjectWhereInput
  }

  export type LandProjectUpdateToOneWithWhereWithoutLandSalesInput = {
    where?: LandProjectWhereInput
    data: XOR<LandProjectUpdateWithoutLandSalesInput, LandProjectUncheckedUpdateWithoutLandSalesInput>
  }

  export type LandProjectUpdateWithoutLandSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutProjectNestedInput
    projectExpenses?: ProjectExpenseUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUpdateManyWithoutProjectNestedInput
  }

  export type LandProjectUncheckedUpdateWithoutLandSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutProjectNestedInput
    projectExpenses?: ProjectExpenseUncheckedUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUncheckedUpdateManyWithoutProjectNestedInput
    profitDistributions?: ProfitDistributionUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectPlotUpsertWithoutLandSalesInput = {
    update: XOR<ProjectPlotUpdateWithoutLandSalesInput, ProjectPlotUncheckedUpdateWithoutLandSalesInput>
    create: XOR<ProjectPlotCreateWithoutLandSalesInput, ProjectPlotUncheckedCreateWithoutLandSalesInput>
    where?: ProjectPlotWhereInput
  }

  export type ProjectPlotUpdateToOneWithWhereWithoutLandSalesInput = {
    where?: ProjectPlotWhereInput
    data: XOR<ProjectPlotUpdateWithoutLandSalesInput, ProjectPlotUncheckedUpdateWithoutLandSalesInput>
  }

  export type ProjectPlotUpdateWithoutLandSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    project?: LandProjectUpdateOneRequiredWithoutProjectPlotsNestedInput
  }

  export type ProjectPlotUncheckedUpdateWithoutLandSalesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type InstallmentScheduleUpsertWithWhereUniqueWithoutSaleInput = {
    where: InstallmentScheduleWhereUniqueInput
    update: XOR<InstallmentScheduleUpdateWithoutSaleInput, InstallmentScheduleUncheckedUpdateWithoutSaleInput>
    create: XOR<InstallmentScheduleCreateWithoutSaleInput, InstallmentScheduleUncheckedCreateWithoutSaleInput>
  }

  export type InstallmentScheduleUpdateWithWhereUniqueWithoutSaleInput = {
    where: InstallmentScheduleWhereUniqueInput
    data: XOR<InstallmentScheduleUpdateWithoutSaleInput, InstallmentScheduleUncheckedUpdateWithoutSaleInput>
  }

  export type InstallmentScheduleUpdateManyWithWhereWithoutSaleInput = {
    where: InstallmentScheduleScalarWhereInput
    data: XOR<InstallmentScheduleUpdateManyMutationInput, InstallmentScheduleUncheckedUpdateManyWithoutSaleInput>
  }

  export type InstallmentScheduleScalarWhereInput = {
    AND?: InstallmentScheduleScalarWhereInput | InstallmentScheduleScalarWhereInput[]
    OR?: InstallmentScheduleScalarWhereInput[]
    NOT?: InstallmentScheduleScalarWhereInput | InstallmentScheduleScalarWhereInput[]
    id?: StringFilter<"InstallmentSchedule"> | string
    saleId?: StringFilter<"InstallmentSchedule"> | string
    dueDate?: DateTimeFilter<"InstallmentSchedule"> | Date | string
    dueAmount?: DecimalFilter<"InstallmentSchedule"> | Decimal | DecimalJsLike | number | string
    status?: StringFilter<"InstallmentSchedule"> | string
  }

  export type CustomerPaymentUpsertWithWhereUniqueWithoutSaleInput = {
    where: CustomerPaymentWhereUniqueInput
    update: XOR<CustomerPaymentUpdateWithoutSaleInput, CustomerPaymentUncheckedUpdateWithoutSaleInput>
    create: XOR<CustomerPaymentCreateWithoutSaleInput, CustomerPaymentUncheckedCreateWithoutSaleInput>
  }

  export type CustomerPaymentUpdateWithWhereUniqueWithoutSaleInput = {
    where: CustomerPaymentWhereUniqueInput
    data: XOR<CustomerPaymentUpdateWithoutSaleInput, CustomerPaymentUncheckedUpdateWithoutSaleInput>
  }

  export type CustomerPaymentUpdateManyWithWhereWithoutSaleInput = {
    where: CustomerPaymentScalarWhereInput
    data: XOR<CustomerPaymentUpdateManyMutationInput, CustomerPaymentUncheckedUpdateManyWithoutSaleInput>
  }

  export type LandSaleCreateWithoutInstallmentSchedulesInput = {
    id: string
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    project: LandProjectCreateNestedOneWithoutLandSalesInput
    plot?: ProjectPlotCreateNestedOneWithoutLandSalesInput
    customerPayments?: CustomerPaymentCreateNestedManyWithoutSaleInput
  }

  export type LandSaleUncheckedCreateWithoutInstallmentSchedulesInput = {
    id: string
    projectId: string
    plotId?: string | null
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    customerPayments?: CustomerPaymentUncheckedCreateNestedManyWithoutSaleInput
  }

  export type LandSaleCreateOrConnectWithoutInstallmentSchedulesInput = {
    where: LandSaleWhereUniqueInput
    create: XOR<LandSaleCreateWithoutInstallmentSchedulesInput, LandSaleUncheckedCreateWithoutInstallmentSchedulesInput>
  }

  export type LandSaleUpsertWithoutInstallmentSchedulesInput = {
    update: XOR<LandSaleUpdateWithoutInstallmentSchedulesInput, LandSaleUncheckedUpdateWithoutInstallmentSchedulesInput>
    create: XOR<LandSaleCreateWithoutInstallmentSchedulesInput, LandSaleUncheckedCreateWithoutInstallmentSchedulesInput>
    where?: LandSaleWhereInput
  }

  export type LandSaleUpdateToOneWithWhereWithoutInstallmentSchedulesInput = {
    where?: LandSaleWhereInput
    data: XOR<LandSaleUpdateWithoutInstallmentSchedulesInput, LandSaleUncheckedUpdateWithoutInstallmentSchedulesInput>
  }

  export type LandSaleUpdateWithoutInstallmentSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    project?: LandProjectUpdateOneRequiredWithoutLandSalesNestedInput
    plot?: ProjectPlotUpdateOneWithoutLandSalesNestedInput
    customerPayments?: CustomerPaymentUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleUncheckedUpdateWithoutInstallmentSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    plotId?: NullableStringFieldUpdateOperationsInput | string | null
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    customerPayments?: CustomerPaymentUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleCreateWithoutCustomerPaymentsInput = {
    id: string
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    project: LandProjectCreateNestedOneWithoutLandSalesInput
    plot?: ProjectPlotCreateNestedOneWithoutLandSalesInput
    installmentSchedules?: InstallmentScheduleCreateNestedManyWithoutSaleInput
  }

  export type LandSaleUncheckedCreateWithoutCustomerPaymentsInput = {
    id: string
    projectId: string
    plotId?: string | null
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
    installmentSchedules?: InstallmentScheduleUncheckedCreateNestedManyWithoutSaleInput
  }

  export type LandSaleCreateOrConnectWithoutCustomerPaymentsInput = {
    where: LandSaleWhereUniqueInput
    create: XOR<LandSaleCreateWithoutCustomerPaymentsInput, LandSaleUncheckedCreateWithoutCustomerPaymentsInput>
  }

  export type BankAccountCreateWithoutCustomerPaymentsInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    treasuryLedgers?: TreasuryLedgerCreateNestedManyWithoutBankAccountInput
    expenses?: ProjectExpenseCreateNestedManyWithoutBankAccountInput
  }

  export type BankAccountUncheckedCreateWithoutCustomerPaymentsInput = {
    id: string
    bankName: string
    accountNumber: string
    branchName?: string | null
    currentBalance?: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    treasuryLedgers?: TreasuryLedgerUncheckedCreateNestedManyWithoutBankAccountInput
    expenses?: ProjectExpenseUncheckedCreateNestedManyWithoutBankAccountInput
  }

  export type BankAccountCreateOrConnectWithoutCustomerPaymentsInput = {
    where: BankAccountWhereUniqueInput
    create: XOR<BankAccountCreateWithoutCustomerPaymentsInput, BankAccountUncheckedCreateWithoutCustomerPaymentsInput>
  }

  export type LandSaleUpsertWithoutCustomerPaymentsInput = {
    update: XOR<LandSaleUpdateWithoutCustomerPaymentsInput, LandSaleUncheckedUpdateWithoutCustomerPaymentsInput>
    create: XOR<LandSaleCreateWithoutCustomerPaymentsInput, LandSaleUncheckedCreateWithoutCustomerPaymentsInput>
    where?: LandSaleWhereInput
  }

  export type LandSaleUpdateToOneWithWhereWithoutCustomerPaymentsInput = {
    where?: LandSaleWhereInput
    data: XOR<LandSaleUpdateWithoutCustomerPaymentsInput, LandSaleUncheckedUpdateWithoutCustomerPaymentsInput>
  }

  export type LandSaleUpdateWithoutCustomerPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    project?: LandProjectUpdateOneRequiredWithoutLandSalesNestedInput
    plot?: ProjectPlotUpdateOneWithoutLandSalesNestedInput
    installmentSchedules?: InstallmentScheduleUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleUncheckedUpdateWithoutCustomerPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    plotId?: NullableStringFieldUpdateOperationsInput | string | null
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    installmentSchedules?: InstallmentScheduleUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type BankAccountUpsertWithoutCustomerPaymentsInput = {
    update: XOR<BankAccountUpdateWithoutCustomerPaymentsInput, BankAccountUncheckedUpdateWithoutCustomerPaymentsInput>
    create: XOR<BankAccountCreateWithoutCustomerPaymentsInput, BankAccountUncheckedCreateWithoutCustomerPaymentsInput>
    where?: BankAccountWhereInput
  }

  export type BankAccountUpdateToOneWithWhereWithoutCustomerPaymentsInput = {
    where?: BankAccountWhereInput
    data: XOR<BankAccountUpdateWithoutCustomerPaymentsInput, BankAccountUncheckedUpdateWithoutCustomerPaymentsInput>
  }

  export type BankAccountUpdateWithoutCustomerPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    treasuryLedgers?: TreasuryLedgerUpdateManyWithoutBankAccountNestedInput
    expenses?: ProjectExpenseUpdateManyWithoutBankAccountNestedInput
  }

  export type BankAccountUncheckedUpdateWithoutCustomerPaymentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    bankName?: StringFieldUpdateOperationsInput | string
    accountNumber?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    currentBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    treasuryLedgers?: TreasuryLedgerUncheckedUpdateManyWithoutBankAccountNestedInput
    expenses?: ProjectExpenseUncheckedUpdateManyWithoutBankAccountNestedInput
  }

  export type LandProjectCreateWithoutProfitDistributionsInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutProjectInput
    projectExpenses?: ProjectExpenseCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotCreateNestedManyWithoutProjectInput
    landSales?: LandSaleCreateNestedManyWithoutProjectInput
  }

  export type LandProjectUncheckedCreateWithoutProfitDistributionsInput = {
    id: string
    projectName: string
    mouza: string
    jlNumber?: string | null
    dagNumbers: string
    khatianNumbers: string
    totalAreaShotok: Decimal | DecimalJsLike | number | string
    purchasePrice: Decimal | DecimalJsLike | number | string
    baynaAmount?: Decimal | DecimalJsLike | number | string
    registrationCost?: Decimal | DecimalJsLike | number | string
    mutationTaxCost?: Decimal | DecimalJsLike | number | string
    status?: string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutProjectInput
    projectExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutProjectInput
    projectPlots?: ProjectPlotUncheckedCreateNestedManyWithoutProjectInput
    landSales?: LandSaleUncheckedCreateNestedManyWithoutProjectInput
  }

  export type LandProjectCreateOrConnectWithoutProfitDistributionsInput = {
    where: LandProjectWhereUniqueInput
    create: XOR<LandProjectCreateWithoutProfitDistributionsInput, LandProjectUncheckedCreateWithoutProfitDistributionsInput>
  }

  export type PartnerCreateWithoutProfitDistributionsInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerCreateNestedManyWithoutPartnerInput
    partnerTransactions?: PartnerTransactionCreateNestedManyWithoutPartnerInput
    paidExpenses?: ProjectExpenseCreateNestedManyWithoutPaidByPartnerInput
  }

  export type PartnerUncheckedCreateWithoutProfitDistributionsInput = {
    id: string
    globalUserId?: string | null
    name: string
    phone: string
    nidNumber?: string | null
    openingBalance?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    projectPartners?: ProjectPartnerUncheckedCreateNestedManyWithoutPartnerInput
    partnerTransactions?: PartnerTransactionUncheckedCreateNestedManyWithoutPartnerInput
    paidExpenses?: ProjectExpenseUncheckedCreateNestedManyWithoutPaidByPartnerInput
  }

  export type PartnerCreateOrConnectWithoutProfitDistributionsInput = {
    where: PartnerWhereUniqueInput
    create: XOR<PartnerCreateWithoutProfitDistributionsInput, PartnerUncheckedCreateWithoutProfitDistributionsInput>
  }

  export type LandProjectUpsertWithoutProfitDistributionsInput = {
    update: XOR<LandProjectUpdateWithoutProfitDistributionsInput, LandProjectUncheckedUpdateWithoutProfitDistributionsInput>
    create: XOR<LandProjectCreateWithoutProfitDistributionsInput, LandProjectUncheckedCreateWithoutProfitDistributionsInput>
    where?: LandProjectWhereInput
  }

  export type LandProjectUpdateToOneWithWhereWithoutProfitDistributionsInput = {
    where?: LandProjectWhereInput
    data: XOR<LandProjectUpdateWithoutProfitDistributionsInput, LandProjectUncheckedUpdateWithoutProfitDistributionsInput>
  }

  export type LandProjectUpdateWithoutProfitDistributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutProjectNestedInput
    projectExpenses?: ProjectExpenseUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUpdateManyWithoutProjectNestedInput
  }

  export type LandProjectUncheckedUpdateWithoutProfitDistributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectName?: StringFieldUpdateOperationsInput | string
    mouza?: StringFieldUpdateOperationsInput | string
    jlNumber?: NullableStringFieldUpdateOperationsInput | string | null
    dagNumbers?: StringFieldUpdateOperationsInput | string
    khatianNumbers?: StringFieldUpdateOperationsInput | string
    totalAreaShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purchasePrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    baynaAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    registrationCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    mutationTaxCost?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutProjectNestedInput
    projectExpenses?: ProjectExpenseUncheckedUpdateManyWithoutProjectNestedInput
    projectPlots?: ProjectPlotUncheckedUpdateManyWithoutProjectNestedInput
    landSales?: LandSaleUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type PartnerUpsertWithoutProfitDistributionsInput = {
    update: XOR<PartnerUpdateWithoutProfitDistributionsInput, PartnerUncheckedUpdateWithoutProfitDistributionsInput>
    create: XOR<PartnerCreateWithoutProfitDistributionsInput, PartnerUncheckedCreateWithoutProfitDistributionsInput>
    where?: PartnerWhereInput
  }

  export type PartnerUpdateToOneWithWhereWithoutProfitDistributionsInput = {
    where?: PartnerWhereInput
    data: XOR<PartnerUpdateWithoutProfitDistributionsInput, PartnerUncheckedUpdateWithoutProfitDistributionsInput>
  }

  export type PartnerUpdateWithoutProfitDistributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUpdateManyWithoutPartnerNestedInput
    partnerTransactions?: PartnerTransactionUpdateManyWithoutPartnerNestedInput
    paidExpenses?: ProjectExpenseUpdateManyWithoutPaidByPartnerNestedInput
  }

  export type PartnerUncheckedUpdateWithoutProfitDistributionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalUserId?: NullableStringFieldUpdateOperationsInput | string | null
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    nidNumber?: NullableStringFieldUpdateOperationsInput | string | null
    openingBalance?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projectPartners?: ProjectPartnerUncheckedUpdateManyWithoutPartnerNestedInput
    partnerTransactions?: PartnerTransactionUncheckedUpdateManyWithoutPartnerNestedInput
    paidExpenses?: ProjectExpenseUncheckedUpdateManyWithoutPaidByPartnerNestedInput
  }

  export type ProjectPartnerCreateManyPartnerInput = {
    id: string
    projectId: string
    sharePercentage: Decimal | DecimalJsLike | number | string
  }

  export type PartnerTransactionCreateManyPartnerInput = {
    id: string
    txnType: string
    amount: Decimal | DecimalJsLike | number | string
    txnDate: Date | string
    referenceId?: string | null
    notes?: string | null
    createdAt?: Date | string
  }

  export type ProjectExpenseCreateManyPaidByPartnerInput = {
    id: string
    projectId?: string | null
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    bankAccountId?: string | null
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type ProfitDistributionCreateManyPartnerInput = {
    id: string
    projectId: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    project?: LandProjectUpdateOneRequiredWithoutProjectPartnersNestedInput
  }

  export type ProjectPartnerUncheckedUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerUncheckedUpdateManyWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type PartnerTransactionUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PartnerTransactionUncheckedUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PartnerTransactionUncheckedUpdateManyWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectExpenseUpdateWithoutPaidByPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: LandProjectUpdateOneWithoutProjectExpensesNestedInput
    bankAccount?: BankAccountUpdateOneWithoutExpensesNestedInput
  }

  export type ProjectExpenseUncheckedUpdateWithoutPaidByPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectExpenseUncheckedUpdateManyWithoutPaidByPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfitDistributionUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    project?: LandProjectUpdateOneRequiredWithoutProfitDistributionsNestedInput
  }

  export type ProfitDistributionUncheckedUpdateWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProfitDistributionUncheckedUpdateManyWithoutPartnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type TreasuryLedgerCreateManyBankAccountInput = {
    id: string
    txnDate: Date | string
    accountType: string
    flowType: string
    amount: Decimal | DecimalJsLike | number | string
    purpose: string
    referenceType: string
    referenceId?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type ProjectExpenseCreateManyBankAccountInput = {
    id: string
    projectId?: string | null
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    paidByPartnerId?: string | null
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type CustomerPaymentCreateManyBankAccountInput = {
    id: string
    saleId: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    receiptNo: string
    remarks?: string | null
  }

  export type TreasuryLedgerUpdateWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    accountType?: StringFieldUpdateOperationsInput | string
    flowType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purpose?: StringFieldUpdateOperationsInput | string
    referenceType?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreasuryLedgerUncheckedUpdateWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    accountType?: StringFieldUpdateOperationsInput | string
    flowType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purpose?: StringFieldUpdateOperationsInput | string
    referenceType?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TreasuryLedgerUncheckedUpdateManyWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    txnDate?: DateTimeFieldUpdateOperationsInput | Date | string
    accountType?: StringFieldUpdateOperationsInput | string
    flowType?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    purpose?: StringFieldUpdateOperationsInput | string
    referenceType?: StringFieldUpdateOperationsInput | string
    referenceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectExpenseUpdateWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: LandProjectUpdateOneWithoutProjectExpensesNestedInput
    paidByPartner?: PartnerUpdateOneWithoutPaidExpensesNestedInput
  }

  export type ProjectExpenseUncheckedUpdateWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    paidByPartnerId?: NullableStringFieldUpdateOperationsInput | string | null
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectExpenseUncheckedUpdateManyWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: NullableStringFieldUpdateOperationsInput | string | null
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    paidByPartnerId?: NullableStringFieldUpdateOperationsInput | string | null
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerPaymentUpdateWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    sale?: LandSaleUpdateOneRequiredWithoutCustomerPaymentsNestedInput
  }

  export type CustomerPaymentUncheckedUpdateWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerPaymentUncheckedUpdateManyWithoutBankAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    saleId?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ProjectPartnerCreateManyProjectInput = {
    id: string
    partnerId: string
    sharePercentage: Decimal | DecimalJsLike | number | string
  }

  export type ProjectExpenseCreateManyProjectInput = {
    id: string
    expenseCategory: string
    amount: Decimal | DecimalJsLike | number | string
    expenseDate: Date | string
    description?: string | null
    paymentChannel: string
    bankAccountId?: string | null
    paidByPartnerId?: string | null
    voucherImageUrl?: string | null
    status?: string
    approvedBy?: string | null
    createdBy: string
    createdAt?: Date | string
  }

  export type ProjectPlotCreateManyProjectInput = {
    id: string
    plotNumber: string
    plotSizeShotok: Decimal | DecimalJsLike | number | string
    askingPrice: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type LandSaleCreateManyProjectInput = {
    id: string
    plotId?: string | null
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type ProfitDistributionCreateManyProjectInput = {
    id: string
    distributionDate: Date | string
    realizationBasis: string
    totalProjectNetProfit: Decimal | DecimalJsLike | number | string
    partnerId: string
    partnerSharePercent: Decimal | DecimalJsLike | number | string
    payoutAmount: Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partner?: PartnerUpdateOneRequiredWithoutProjectPartnersNestedInput
  }

  export type ProjectPartnerUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProjectPartnerUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    partnerId?: StringFieldUpdateOperationsInput | string
    sharePercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProjectExpenseUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bankAccount?: BankAccountUpdateOneWithoutExpensesNestedInput
    paidByPartner?: PartnerUpdateOneWithoutPaidExpensesNestedInput
  }

  export type ProjectExpenseUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    paidByPartnerId?: NullableStringFieldUpdateOperationsInput | string | null
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectExpenseUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    expenseCategory?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    expenseDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    paymentChannel?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    paidByPartnerId?: NullableStringFieldUpdateOperationsInput | string | null
    voucherImageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectPlotUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    landSales?: LandSaleUpdateManyWithoutPlotNestedInput
  }

  export type ProjectPlotUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    landSales?: LandSaleUncheckedUpdateManyWithoutPlotNestedInput
  }

  export type ProjectPlotUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    plotNumber?: StringFieldUpdateOperationsInput | string
    plotSizeShotok?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    askingPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type LandSaleUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    plot?: ProjectPlotUpdateOneWithoutLandSalesNestedInput
    installmentSchedules?: InstallmentScheduleUpdateManyWithoutSaleNestedInput
    customerPayments?: CustomerPaymentUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    plotId?: NullableStringFieldUpdateOperationsInput | string | null
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    installmentSchedules?: InstallmentScheduleUncheckedUpdateManyWithoutSaleNestedInput
    customerPayments?: CustomerPaymentUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    plotId?: NullableStringFieldUpdateOperationsInput | string | null
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type ProfitDistributionUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partner?: PartnerUpdateOneRequiredWithoutProfitDistributionsNestedInput
  }

  export type ProfitDistributionUncheckedUpdateWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerId?: StringFieldUpdateOperationsInput | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type ProfitDistributionUncheckedUpdateManyWithoutProjectInput = {
    id?: StringFieldUpdateOperationsInput | string
    distributionDate?: DateTimeFieldUpdateOperationsInput | Date | string
    realizationBasis?: StringFieldUpdateOperationsInput | string
    totalProjectNetProfit?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    partnerId?: StringFieldUpdateOperationsInput | string
    partnerSharePercent?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payoutAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
  }

  export type LandSaleCreateManyPlotInput = {
    id: string
    projectId: string
    buyerName: string
    buyerPhone: string
    buyerNid?: string | null
    saleDate: Date | string
    totalAgreedPrice: Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: Decimal | DecimalJsLike | number | string
    currentDueAmount: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type LandSaleUpdateWithoutPlotInput = {
    id?: StringFieldUpdateOperationsInput | string
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    project?: LandProjectUpdateOneRequiredWithoutLandSalesNestedInput
    installmentSchedules?: InstallmentScheduleUpdateManyWithoutSaleNestedInput
    customerPayments?: CustomerPaymentUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleUncheckedUpdateWithoutPlotInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
    installmentSchedules?: InstallmentScheduleUncheckedUpdateManyWithoutSaleNestedInput
    customerPayments?: CustomerPaymentUncheckedUpdateManyWithoutSaleNestedInput
  }

  export type LandSaleUncheckedUpdateManyWithoutPlotInput = {
    id?: StringFieldUpdateOperationsInput | string
    projectId?: StringFieldUpdateOperationsInput | string
    buyerName?: StringFieldUpdateOperationsInput | string
    buyerPhone?: StringFieldUpdateOperationsInput | string
    buyerNid?: NullableStringFieldUpdateOperationsInput | string | null
    saleDate?: DateTimeFieldUpdateOperationsInput | Date | string
    totalAgreedPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    advanceBookingAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentDueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type InstallmentScheduleCreateManySaleInput = {
    id: string
    dueDate: Date | string
    dueAmount: Decimal | DecimalJsLike | number | string
    status?: string
  }

  export type CustomerPaymentCreateManySaleInput = {
    id: string
    paymentDate: Date | string
    amountPaid: Decimal | DecimalJsLike | number | string
    paymentMethod: string
    bankAccountId?: string | null
    receiptNo: string
    remarks?: string | null
  }

  export type InstallmentScheduleUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type InstallmentScheduleUncheckedUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type InstallmentScheduleUncheckedUpdateManyWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    dueDate?: DateTimeFieldUpdateOperationsInput | Date | string
    dueAmount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    status?: StringFieldUpdateOperationsInput | string
  }

  export type CustomerPaymentUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    bankAccount?: BankAccountUpdateOneWithoutCustomerPaymentsNestedInput
  }

  export type CustomerPaymentUncheckedUpdateWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerPaymentUncheckedUpdateManyWithoutSaleInput = {
    id?: StringFieldUpdateOperationsInput | string
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    amountPaid?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    bankAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    receiptNo?: StringFieldUpdateOperationsInput | string
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
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