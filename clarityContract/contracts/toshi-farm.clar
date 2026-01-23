;; SatoshiFarm - Decentralized Farmers Marketplace on Stacks Blockchain
;; Harvest your sats like a true Bitcoin farmer!

(define-data-var next-item-id uint u1)

(define-map satoshi-farm-items uint 
  { name: (string-ascii 100), 
    description: (string-ascii 200), 
    image-url: (string-ascii 200),
    price: uint, 
    quantity: uint, 
    seller: principal, 
    active: bool })

(define-map seller-stx-earnings principal uint)  ;; Accumulated STX earnings per seller
(define-map seller-usdcx-earnings principal uint)  ;; Accumulated USDCx earnings per seller

;; List a new item for sale - plant your produce in the marketplace!
(define-public (list-item (name (string-ascii 100)) (description (string-ascii 200)) (image-url (string-ascii 200)) (price uint) (quantity uint))
  (begin
    ;; Validate inputs - no free lunches or empty fields
    (asserts! (> (len name) u0) (err u101))
    (asserts! (> (len description) u0) (err u101))
    (asserts! (> (len image-url) u0) (err u101))
    (asserts! (> price u0) (err u101))
    (asserts! (> quantity u0) (err u101))
    (let ((item-id (var-get next-item-id)))
      ;; Plant the item in our marketplace map
      (map-set satoshi-farm-items item-id 
        {name: name, description: description, image-url: image-url, price: price, quantity: quantity, seller: tx-sender, active: true})
      ;; Increment the item ID for the next farmer
      (var-set next-item-id (+ item-id u1))
      (ok item-id))))

;; Buy items - STX direct, USDCx to treasury
(define-public (buy-item (item-id uint) (quantity-to-buy uint) (use-stx bool))
  (let ((item (unwrap! (map-get? satoshi-farm-items item-id) (err u102)))
        (total-cost (* (get price item) quantity-to-buy))
        (seller (get seller item)))
    ;; Ensure item is active and has enough quantity
    (asserts! (get active item) (err u102))
    (asserts! (>= (get quantity item) quantity-to-buy) (err u103))
    ;; Transfer payment: STX direct to seller, USDCx to treasury
    (if use-stx
      (try! (stx-transfer? total-cost tx-sender seller))
      (try! (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx transfer total-cost tx-sender (as-contract tx-sender) none)))
    (let ((new-quantity (- (get quantity item) quantity-to-buy)))
      ;; Update item quantity and deactivate if sold out
      (map-set satoshi-farm-items item-id (merge item {quantity: new-quantity, active: (> new-quantity u0)}))
      ;; Add earnings to seller's balance for tracking
      (if use-stx
        (map-set seller-stx-earnings seller (+ (default-to u0 (map-get? seller-stx-earnings seller)) total-cost))
        (map-set seller-usdcx-earnings seller (+ (default-to u0 (map-get? seller-usdcx-earnings seller)) total-cost)))
      (ok true))))

;; Withdraw STX earnings (STX already transferred directly)
(define-public (withdraw-stx)
  (let ((earnings (default-to u0 (map-get? seller-stx-earnings tx-sender))))
    ;; Only farmers with earnings can withdraw
    (asserts! (> earnings u0) (err u104))
    ;; Reset balance to zero - STX already transferred
    (map-delete seller-stx-earnings tx-sender)
    (ok earnings)))

;; Withdraw USDCx earnings from treasury
(define-public (withdraw-usdcx)
  (let ((earnings (default-to u0 (map-get? seller-usdcx-earnings tx-sender)))
        (user tx-sender))
    ;; Only farmers with earnings can withdraw
    (asserts! (> earnings u0) (err u104))
    ;; Transfer USDCx from treasury to seller
    (try! (as-contract (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx transfer earnings tx-sender user none)))
    ;; Reset balance to zero
    (map-delete seller-usdcx-earnings tx-sender)
    (ok earnings)))

;; Read-only functions - check the marketplace without planting or harvesting

(define-read-only (get-item (item-id uint))
  (map-get? satoshi-farm-items item-id))

(define-read-only (get-next-item-id)
  (var-get next-item-id))

(define-read-only (get-seller-stx-earnings (seller principal))
  (default-to u0 (map-get? seller-stx-earnings seller)))

(define-read-only (get-seller-usdcx-earnings (seller principal))
  (default-to u0 (map-get? seller-usdcx-earnings seller)))
