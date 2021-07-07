// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api/types';

declare module '@polkadot/api/types/errors' {
  export interface AugmentedErrors<ApiType> {
    assets: {
      /**
       * Cannot convert Amount into Balance type
       **/
      AmountIntoBalanceFailed: AugmentedError<ApiType>;
      /**
       * The balance is too low
       **/
      BalanceTooLow: AugmentedError<ApiType>;
      /**
       * Failed because liquidity restrictions due to locking
       **/
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Failed because the maximum locks was exceeded
       **/
      MaxLocksExceeded: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    balances: {
      /**
       * Beneficiary account must pre-exist
       **/
      DeadAccount: AugmentedError<ApiType>;
      /**
       * Value too low to create account due to existential deposit
       **/
      ExistentialDeposit: AugmentedError<ApiType>;
      /**
       * A vesting schedule already exists for this account
       **/
      ExistingVestingSchedule: AugmentedError<ApiType>;
      /**
       * Balance too low to send value
       **/
      InsufficientBalance: AugmentedError<ApiType>;
      /**
       * Transfer/payment would kill account
       **/
      KeepAlive: AugmentedError<ApiType>;
      /**
       * Account liquidity restrictions prevent withdrawal
       **/
      LiquidityRestrictions: AugmentedError<ApiType>;
      /**
       * Vesting balance too high to send value
       **/
      VestingBalance: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    bancor: {
      AmountNotGreaterThanZero: AugmentedError<ApiType>;
      BancorPoolNotExist: AugmentedError<ApiType>;
      ConversionError: AugmentedError<ApiType>;
      CurrencyIdNotExist: AugmentedError<ApiType>;
      NotEnoughBalance: AugmentedError<ApiType>;
      TokenSupplyNotEnought: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    bifrostAssets: {
      /**
       * This operation will cause balance to overflow
       **/
      BalanceOverflow: AugmentedError<ApiType>;
      /**
       * The balance is too low
       **/
      BalanceTooLow: AugmentedError<ApiType>;
      /**
       * Destroy balance too much
       **/
      BurnTooMuch: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    chargeTransactionFee: {
      ConversionError: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    council: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    currencies: {
      /**
       * Unable to convert the Amount type into Balance.
       **/
      AmountIntoBalanceFailed: AugmentedError<ApiType>;
      /**
       * Balance is too low.
       **/
      BalanceTooLow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    democracy: {
      /**
       * Cannot cancel the same proposal twice
       **/
      AlreadyCanceled: AugmentedError<ApiType>;
      /**
       * The account is already delegating.
       **/
      AlreadyDelegating: AugmentedError<ApiType>;
      /**
       * Identity may not veto a proposal twice
       **/
      AlreadyVetoed: AugmentedError<ApiType>;
      /**
       * Unknown index
       **/
      BadIndex: AugmentedError<ApiType>;
      /**
       * Preimage already noted
       **/
      DuplicatePreimage: AugmentedError<ApiType>;
      /**
       * Proposal already made
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Imminent
       **/
      Imminent: AugmentedError<ApiType>;
      /**
       * The instant referendum origin is currently disallowed.
       **/
      InstantNotAllowed: AugmentedError<ApiType>;
      /**
       * Too high a balance was provided that the account cannot afford.
       **/
      InsufficientFunds: AugmentedError<ApiType>;
      /**
       * Invalid hash
       **/
      InvalidHash: AugmentedError<ApiType>;
      /**
       * The provided witness data is wrong.
       **/
      InvalidWitness: AugmentedError<ApiType>;
      /**
       * Maximum number of votes reached.
       **/
      MaxVotesReached: AugmentedError<ApiType>;
      /**
       * No proposals waiting
       **/
      NoneWaiting: AugmentedError<ApiType>;
      /**
       * Delegation to oneself makes no sense.
       **/
      Nonsense: AugmentedError<ApiType>;
      /**
       * The actor has no permission to conduct the action.
       **/
      NoPermission: AugmentedError<ApiType>;
      /**
       * No external proposal
       **/
      NoProposal: AugmentedError<ApiType>;
      /**
       * Not delegated
       **/
      NotDelegated: AugmentedError<ApiType>;
      /**
       * The account is not currently delegating.
       **/
      NotDelegating: AugmentedError<ApiType>;
      /**
       * The lock on the account to be unlocked has not yet expired.
       **/
      NotExpired: AugmentedError<ApiType>;
      /**
       * Not imminent
       **/
      NotImminent: AugmentedError<ApiType>;
      /**
       * The target account does not have a lock.
       **/
      NotLocked: AugmentedError<ApiType>;
      /**
       * Next external proposal not simple majority
       **/
      NotSimpleMajority: AugmentedError<ApiType>;
      /**
       * The given account did not vote on the referendum.
       **/
      NotVoter: AugmentedError<ApiType>;
      /**
       * Invalid preimage
       **/
      PreimageInvalid: AugmentedError<ApiType>;
      /**
       * Preimage not found
       **/
      PreimageMissing: AugmentedError<ApiType>;
      /**
       * Proposal still blacklisted
       **/
      ProposalBlacklisted: AugmentedError<ApiType>;
      /**
       * Proposal does not exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * Vote given for invalid referendum
       **/
      ReferendumInvalid: AugmentedError<ApiType>;
      /**
       * Too early
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * Maximum number of proposals reached.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Value too low
       **/
      ValueLow: AugmentedError<ApiType>;
      /**
       * The account currently has votes attached to it and the operation cannot succeed until
       * these are removed, either through `unvote` or `reap_vote`.
       **/
      VotesExist: AugmentedError<ApiType>;
      /**
       * Invalid upper bound.
       **/
      WrongUpperBound: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    dmpQueue: {
      /**
       * The amount of weight given is possibly not enough for executing the message.
       **/
      OverLimit: AugmentedError<ApiType>;
      /**
       * The message index given is unknown.
       **/
      Unknown: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    indices: {
      /**
       * The index was not available.
       **/
      InUse: AugmentedError<ApiType>;
      /**
       * The index was not already assigned.
       **/
      NotAssigned: AugmentedError<ApiType>;
      /**
       * The index is assigned to another account.
       **/
      NotOwner: AugmentedError<ApiType>;
      /**
       * The source and destination accounts are identical.
       **/
      NotTransfer: AugmentedError<ApiType>;
      /**
       * The index is permanent and may not be freed/changed.
       **/
      Permanent: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    minterReward: {
      /**
       * There's no price at all.
       **/
      FailToGetSwapPrice: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    parachainSystem: {
      /**
       * The inherent which supplies the host configuration did not run this block
       **/
      HostConfigurationNotAvailable: AugmentedError<ApiType>;
      /**
       * No code upgrade has been authorized.
       **/
      NothingAuthorized: AugmentedError<ApiType>;
      /**
       * No validation function upgrade is currently scheduled.
       **/
      NotScheduled: AugmentedError<ApiType>;
      /**
       * Attempt to upgrade validation function while existing upgrade pending
       **/
      OverlappingUpgrades: AugmentedError<ApiType>;
      /**
       * Polkadot currently prohibits this parachain from upgrading its validation function
       **/
      ProhibitedByPolkadot: AugmentedError<ApiType>;
      /**
       * The supplied validation function has compiled into a blob larger than Polkadot is
       * willing to run
       **/
      TooBig: AugmentedError<ApiType>;
      /**
       * The given code upgrade has not been authorized.
       **/
      Unauthorized: AugmentedError<ApiType>;
      /**
       * The inherent which supplies the validation data did not run this block
       **/
      ValidationDataNotAvailable: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    polkadotXcm: {
      /**
       * The message execution fails the filter.
       **/
      Filtered: AugmentedError<ApiType>;
      SendFailure: AugmentedError<ApiType>;
      Unreachable: AugmentedError<ApiType>;
      /**
       * The message's weight could not be determined.
       **/
      UnweighableMessage: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    salp: {
      /**
       * This parachain's bid or lease is still active and withdraw cannot yet begin.
       **/
      BidOrLeaseActive: AugmentedError<ApiType>;
      /**
       * The campaign ends before the current block number. The end must be in the future.
       **/
      CannotEndInPast: AugmentedError<ApiType>;
      /**
       * Contributions exceed maximum amount.
       **/
      CapExceeded: AugmentedError<ApiType>;
      /**
       * The contribution period has already ended.
       **/
      ContributionPeriodOver: AugmentedError<ApiType>;
      /**
       * The contribution was below the minimum, `MinContribution`.
       **/
      ContributionTooSmall: AugmentedError<ApiType>;
      /**
       * The first slot needs to at least be less than 3 `max_value`.
       **/
      FirstSlotTooFarInFuture: AugmentedError<ApiType>;
      /**
       * The crowdloan has not yet ended.
       **/
      FundNotEnded: AugmentedError<ApiType>;
      /**
       * Fund has not yet retired.
       **/
      FundNotRetired: AugmentedError<ApiType>;
      /**
       * Funds have not yet been returned.
       **/
      FundsNotReturned: AugmentedError<ApiType>;
      /**
       * This crowdloan has an active parachain and cannot be dissolved.
       **/
      HasActiveParachain: AugmentedError<ApiType>;
      /**
       * Invalid fund status.
       **/
      InvalidFundStatus: AugmentedError<ApiType>;
      /**
       * The origin of this call is invalid.
       **/
      InvalidOrigin: AugmentedError<ApiType>;
      /**
       * Invalid fund index.
       **/
      InvalidParaId: AugmentedError<ApiType>;
      /**
       * Invalid signature.
       **/
      InvalidSignature: AugmentedError<ApiType>;
      /**
       * Last slot must be greater than first slot.
       **/
      LastSlotBeforeFirstSlot: AugmentedError<ApiType>;
      /**
       * The last slot cannot be more then 3 slots after the first slot.
       **/
      LastSlotTooFarInFuture: AugmentedError<ApiType>;
      /**
       * This parachain lease is still active and retirement cannot yet begin.
       **/
      LeaseActive: AugmentedError<ApiType>;
      /**
       * There are no contributions stored in this crowdloan.
       **/
      NoContributions: AugmentedError<ApiType>;
      /**
       * This crowdloan does not correspond to a parachain.
       **/
      NotParachain: AugmentedError<ApiType>;
      /**
       * The crowdloan is not ready to dissolve. Potentially still has a slot or in retirement period.
       **/
      NotReadyToDissolve: AugmentedError<ApiType>;
      /**
       * There was an overflow.
       **/
      Overflow: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    scheduler: {
      /**
       * Failed to schedule a call
       **/
      FailedToSchedule: AugmentedError<ApiType>;
      /**
       * Cannot find the scheduled call.
       **/
      NotFound: AugmentedError<ApiType>;
      /**
       * Reschedule failed because it does not change scheduled time.
       **/
      RescheduleNoChange: AugmentedError<ApiType>;
      /**
       * Given target block number is in the past.
       **/
      TargetBlockNumberInPast: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    sudo: {
      /**
       * Sender must be the Sudo account
       **/
      RequireSudo: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    system: {
      /**
       * Failed to extract the runtime version from the new runtime.
       * 
       * Either calling `Core_version` or decoding `RuntimeVersion` failed.
       **/
      FailedToExtractRuntimeVersion: AugmentedError<ApiType>;
      /**
       * The name of specification does not match between the current runtime
       * and the new runtime.
       **/
      InvalidSpecName: AugmentedError<ApiType>;
      /**
       * Suicide called when the account has non-default composite data.
       **/
      NonDefaultComposite: AugmentedError<ApiType>;
      /**
       * There is a non-zero reference count preventing the account from being purged.
       **/
      NonZeroRefCount: AugmentedError<ApiType>;
      /**
       * The specification version is not allowed to decrease between the current runtime
       * and the new runtime.
       **/
      SpecVersionNeedsToIncrease: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    technicalCommittee: {
      /**
       * Members are already initialized!
       **/
      AlreadyInitialized: AugmentedError<ApiType>;
      /**
       * Duplicate proposals not allowed
       **/
      DuplicateProposal: AugmentedError<ApiType>;
      /**
       * Duplicate vote ignored
       **/
      DuplicateVote: AugmentedError<ApiType>;
      /**
       * Account is not a member
       **/
      NotMember: AugmentedError<ApiType>;
      /**
       * Proposal must exist
       **/
      ProposalMissing: AugmentedError<ApiType>;
      /**
       * The close call was made too early, before the end of the voting.
       **/
      TooEarly: AugmentedError<ApiType>;
      /**
       * There can only be a maximum of `MaxProposals` active proposals.
       **/
      TooManyProposals: AugmentedError<ApiType>;
      /**
       * Mismatched index
       **/
      WrongIndex: AugmentedError<ApiType>;
      /**
       * The given length bound for the proposal was too low.
       **/
      WrongProposalLength: AugmentedError<ApiType>;
      /**
       * The given weight bound for the proposal was too low.
       **/
      WrongProposalWeight: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    voucher: {
      /**
       * Transferring too big balance
       **/
      TransferringTooBigBalance: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    vtokenMint: {
      /**
       * Account balance must be greater than or equal to the transfer amount.
       **/
      BalanceLow: AugmentedError<ApiType>;
      /**
       * Balance should be non-zero.
       **/
      BalanceZero: AugmentedError<ApiType>;
      /**
       * Empty vtoken pool, cause there's no price at all.
       **/
      EmptyVtokenPool: AugmentedError<ApiType>;
      /**
       * The amount of token you want to mint is bigger than the vtoken pool.
       **/
      NotEnoughVtokenPool: AugmentedError<ApiType>;
      /**
       * Token type not support.
       **/
      NotSupportTokenType: AugmentedError<ApiType>;
      /**
       * User's token still under staking while he want to redeem.
       **/
      UnderStaking: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    xcmpQueue: {
      /**
       * Bad XCM data.
       **/
      BadXcm: AugmentedError<ApiType>;
      /**
       * Bad XCM origin.
       **/
      BadXcmOrigin: AugmentedError<ApiType>;
      /**
       * Failed to send XCM message.
       **/
      FailedToSend: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
    zenlinkProtocol: {
      /**
       * Location given was invalid or unsupported.
       **/
      AccountIdBadLocation: AugmentedError<ApiType>;
      /**
       * Asset does not exist.
       **/
      AssetNotExists: AugmentedError<ApiType>;
      /**
       * Transaction block number is larger than the end block number.
       **/
      Deadline: AugmentedError<ApiType>;
      /**
       * Trading pair can't be created.
       **/
      DeniedCreatePair: AugmentedError<ApiType>;
      /**
       * Transfer to self by XCM message
       **/
      DeniedTransferToSelf: AugmentedError<ApiType>;
      /**
       * Sold amount is more than exception.
       **/
      ExcessiveSoldAmount: AugmentedError<ApiType>;
      /**
       * XCM execution failed
       **/
      ExecutionFailed: AugmentedError<ApiType>;
      /**
       * Incorrect foreign amount range.
       **/
      IncorrectAssetAmountRange: AugmentedError<ApiType>;
      /**
       * Account balance must be greater than or equal to the transfer amount.
       **/
      InsufficientAssetBalance: AugmentedError<ApiType>;
      /**
       * Liquidity is not enough.
       **/
      InsufficientLiquidity: AugmentedError<ApiType>;
      /**
       * Trading pair does have enough foreign.
       **/
      InsufficientPairReserve: AugmentedError<ApiType>;
      /**
       * Get target amount is less than exception.
       **/
      InsufficientTargetAmount: AugmentedError<ApiType>;
      /**
       * Can't find pair though trading path.
       **/
      InvalidPath: AugmentedError<ApiType>;
      /**
       * Account native currency balance must be greater than ExistentialDeposit
       **/
      NativeBalanceTooLow: AugmentedError<ApiType>;
      /**
       * Overflow.
       **/
      Overflow: AugmentedError<ApiType>;
      /**
       * Trading pair already exists.
       **/
      PairAlreadyExists: AugmentedError<ApiType>;
      /**
       * Trading pair does not exist.
       **/
      PairNotExists: AugmentedError<ApiType>;
      /**
       * Not in ZenlinkRegistedParaChains
       **/
      TargetChainNotRegistered: AugmentedError<ApiType>;
      /**
       * Unsupported AssetId by this ZenlinkProtocol Version
       **/
      UnsupportedAssetType: AugmentedError<ApiType>;
      /**
       * Generic error
       **/
      [key: string]: AugmentedError<ApiType>;
    };
  }

  export interface DecoratedErrors<ApiType extends ApiTypes> extends AugmentedErrors<ApiType> {
    [key: string]: ModuleErrors<ApiType>;
  }
}
