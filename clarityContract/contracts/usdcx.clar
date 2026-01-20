;; Minimal stub for USDCx SIP-010 token for local Clarinet testing
;; Only the transfer function signature is needed for contract-call? to resolve

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (if false (err u0) (ok true)))
