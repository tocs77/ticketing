export enum OrderStatus {
  Created = 'created', // created but ticket hasn`t yet reserved
  Cancelled = 'cancelled', //user cancelled or ticket already have been reserved or order expires before payment
  AwaitingPayment = 'awaiting:payment', // order successfully reserved ticket
  Complete = 'complete', //ticket reserved and user payd
}
